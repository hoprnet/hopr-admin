import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useEthersSigner } from '../../../hooks';
import { useAppDispatch, useAppSelector } from '../../../store';
import { safeActionsAsync } from '../../../store/slices/safe';
import { encodeFunctionData } from 'viem';
import { OperationType } from '@safe-global/safe-core-sdk-types';
import { MULTISEND_CONTRACT_GNOSIS } from '../../../../config';

// HOPR Components
import Button from '../../../future-hopr-lib-components/Button';
import { GrayCard } from '../../../future-hopr-lib-components/Cards/GrayCard';
import { stakingHubActions } from '../../../store/slices/stakingHub';
import { web3ActionsAsync } from '../../../store/slices/web3';
import { useWalletClient } from 'wagmi';
import { web3 } from '@hoprnet/hopr-sdk';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */
  /* justify-items: center; */
  /* align-items: center; */
  padding: 16px;
  flex-grow: 1;
  gap: 32px;
  p.center {
    width: calc(100% - 32px);
    text-align: center;
  }
  div.center {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .line {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;
  }

  .half-line {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-between;
  }

  #redeemed-tickets,
  #earned-rewards,
  #wxhopr-total-stake,
  #xdai-in-safe,
  #Update-Node-Configuration,
  #transfer-nft {
    flex: 1;
  }
`;

const TransferNFT = styled.div`
  display: flex;
  gap: 1rem;
  img {
    width: 116px;
    height: 116px;
  }
  button {
    width: 254px;
    text-transform: uppercase;
  }
`;

function SafeDashboard() {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const walletAddress = useAppSelector((store) => store.web3.account);
  const { data: walletClient } = useWalletClient();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as `0x${string}`;
  const moduleAddress = useAppSelector((store) => store.stakingHub.onboarding.moduleAddress) as `0x${string}`;
  const needsUpdate = useAppSelector((store) => store.stakingHub.config.needsUpdate.data);
  const updateStrategy = useAppSelector((store) => store.stakingHub.config.needsUpdate.strategy);
  const communityNftIdInWallet = useAppSelector((store) => store.web3.communityNftId);
  const communityNftIdInSafe = useAppSelector((store) => !!store.safe.communityNftIds.data.length);
  const sendingNFT = useAppSelector((store) => store.web3.communityNftTransferring);
  const [updating, set_updating] = useState(false);
  const [TxHashOfTheUpdate, set_TxHashOfTheUpdate] = useState<string | null>(null);

  const updateConfig = async () => {
    if (signer) {
      set_updating(true);
      if (updateStrategy === 'configWillPointToCorrectContracts') {
        // GROUP 1 when target is false 1. addChannelsAndTokenTarget (0xa2450f89) in the module contract
        const newConfig = `0x693bac5ce61c720ddc68533991ceb41199d8f8ae010103030303030303030303`;

        const addChannelsAndTokenTarget = encodeFunctionData({
          abi: web3.hoprNodeManagementModuleABI,
          functionName: 'addChannelsAndTokenTarget',
          args: [newConfig],
        });

        dispatch(
          safeActionsAsync.createAndExecuteContractTransactionThunk({
            data: addChannelsAndTokenTarget,
            signer,
            safeAddress: selectedSafeAddress,
            smartContractAddress: moduleAddress,
          }),
        )
          .unwrap()
          .then((transactionResponse) => {
            set_TxHashOfTheUpdate(transactionResponse);
            dispatch(stakingHubActions.setConfigUpdated());
          })
          .finally(() => {
            set_updating(false);
          });
      } else if (moduleAddress && updateStrategy === 'configWillLetOpenChannels') {
        // GROUP 2: Safes cloned with old wrong config, but correct SC addresses

        const moduleAddressWithout0x = moduleAddress.slice(2).toLocaleLowerCase();

        const newConfig = `0x8d80ff0a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000016b00${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000693bac5ce61c720ddc68533991ceb41199d8f8ae00${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000d4fdec44db9d44b8f2b6d529620f9c0c7066a2c100${moduleAddressWithout0x}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024a2450f89693bac5ce61c720ddc68533991ceb41199d8f8ae010103030303030303030303000000000000000000000000000000000000000000`;

        dispatch(
          safeActionsAsync.createAndExecuteContractTransactionThunk({
            data: newConfig,
            signer,
            safeAddress: selectedSafeAddress,
            operation: OperationType.DelegateCall,
            smartContractAddress: MULTISEND_CONTRACT_GNOSIS,
          }),
        )
          .unwrap()
          .then((transactionResponse) => {
            console.log(`transaction went through`, transactionResponse);
            set_TxHashOfTheUpdate(transactionResponse);
            dispatch(stakingHubActions.setConfigUpdated());
          })
          .finally(() => {
            set_updating(false);
          });
      }
    }
  };

  function whichNFTimage() {
    if (communityNftIdInSafe !== false) return '/assets/nft-in-safe.png';
    if (communityNftIdInWallet === null) return '/assets/nft-NOT-detected-in-wallet.png';
    if (communityNftIdInWallet !== null) return '/assets/nft-detected-in-wallet.png';
  }

  return (
    <Container className="SafeDashboard">
      <div className="line">
        <GrayCard
          id="Update-Node-Configuration"
          title="Safe Configuration"
          currency={needsUpdate ? <span style={{ color: 'red' }}>Update needed</span> : <span>Current version</span>}
          buttons={[
            {
              text: 'Update',
              onClick: updateConfig,
              pending: updating,
              disabled: !needsUpdate,
            },
          ]}
        />
        <GrayCard
          id="transfer-nft"
          buttons={
            communityNftIdInSafe
              ? [
                {
                  text: 'Withdraw NFT from Safe',
                  link: '/staking/withdraw?token=nft',
                },
              ]
              : [
                {
                  disabled: communityNftIdInWallet === null || !!communityNftIdInSafe,
                  pending: sendingNFT,
                  text: 'Transfer NFT to Safe',
                  onClick: () => {
                    if (!walletClient) return;
                    if (walletAddress && selectedSafeAddress && communityNftIdInWallet !== null) {
                      dispatch(
                        web3ActionsAsync.sendNftToSafeThunk({
                          walletAddress,
                          safeAddress: selectedSafeAddress,
                          walletClient,
                          communityNftId: communityNftIdInWallet,
                        }),
                      );
                    }
                  },
                },
              ]
          }
        >
          <TransferNFT>
            <img src={whichNFTimage()} />
          </TransferNFT>
        </GrayCard>
      </div>

      <p className="center">
        In order to adjust the settings of your safe or transfer assets that are not supported by the HOPR Staking Hub
        use any of the below mentioned third party general purpose Safe user interfaces:
      </p>
      <div className="center">
        <Button href={`https://app.safe.global/home?safe=gno:${selectedSafeAddress}`}>safe.global</Button>
        <Button href={`https://app.onchainden.com/safes/gnosis:${selectedSafeAddress}`}>OnChainDen.com</Button>
      </div>
    </Container>
  );
}

export default SafeDashboard;
