import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useEthersSigner } from '../../../hooks';
import { useAppDispatch, useAppSelector } from '../../../store';
import { safeActionsAsync } from '../../../store/slices/safe';
import { encodeFunctionData } from 'viem';
import { OperationType } from '@safe-global/safe-core-sdk-types';
import { MULTISEND_CONTRACT_GNOSIS } from '../../../../config';
import { web3 } from '@hoprnet/hopr-sdk';

// HOPR Components
import Button from '../../../future-hopr-lib-components/Button';
import { GrayCard } from '../../../future-hopr-lib-components/Cards/GrayCard';
import { stakingHubActions } from '../../../store/slices/stakingHub';
import { web3ActionsAsync } from '../../../store/slices/web3';
import { useWalletClient } from 'wagmi';
import SafeTransactionButton from '../../../components/SafeTransactionButton';


const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 16px;
  gap: 32px;

  .line {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;
  }

  #safe-owners {
    grid-column: span 2;
    li {
      overflow-wrap: break-word;
    }
    .inline {
      display: inline;
    }
  }


  #Update-Node-Configuration {
    grid-column: span 1;
  }

  #transfer-nft{
    grid-column: span 1;
  }

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

  @media screen and (max-width: 1350px) {
    grid-template-columns: repeat(1, 1fr);
    #safe-owners {
      grid-column: span 1;
    }
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
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress) as `0x${string}`;
  const moduleAddress = useAppSelector((store) => store.safe.selectedSafe.data.moduleAddress) as `0x${string}`;
  const needsUpdate = useAppSelector((store) => store.stakingHub.config.needsUpdate.data);
  const updateStrategy = useAppSelector((store) => store.stakingHub.config.needsUpdate.strategy);
  const communityNftIdInWallet = useAppSelector((store) => store.web3.communityNftId);
  const communityNftIdInSafe = useAppSelector((store) => !!store.safe.communityNftIds.data.length);
  const sendingNFT = useAppSelector((store) => store.web3.communityNftTransferring);
  //const safeOwners = useAppSelector((store) => store.safe.info.data?.owners); // Safe Infra
  const safeOwnersSubgraph = useAppSelector((store) => store.stakingHub.safeInfo.data.owners); // Subgraph
  const safeOwners = safeOwnersSubgraph.map((elem) => elem.owner.id);
  const safeThreshold = useAppSelector((store) => store.stakingHub.safeInfo.data.threshold);
  const onboardingIsNotFinished = useAppSelector((store) => store.stakingHub.onboarding.notFinished);
  const onboardingIsFetching = useAppSelector((store) => store.stakingHub.onboarding.notFinished);
  const [updating, set_updating] = useState(false);

  const onboardingIsFinished = !onboardingIsFetching && !onboardingIsNotFinished;

  const executeUpdateConfig = async () => {
    if (!signer || !moduleAddress) return;

    set_updating(true);
    if (updateStrategy === 'configWillPointToCorrectContracts') {
      // GROUP 1 when target is false 1. addChannelsAndTokenTarget (0xa2450f89) in the module contract
      const newConfig = `0x693bac5ce61c720ddc68533991ceb41199d8f8ae010103030303030303030303`;

      const addChannelsAndTokenTarget  = encodeFunctionData({
        abi: web3.hoprNodeManagementModuleABI,
        functionName: 'addChannelsAndTokenTarget',
        args: [newConfig],
      });

      console.log('addChannelsAndTokenTarget', addChannelsAndTokenTarget)

      dispatch(
        safeActionsAsync.createAndExecuteSafeContractTransactionThunk({
          data: addChannelsAndTokenTarget,
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: moduleAddress,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(stakingHubActions.setConfigUpdated());
        })
        .finally(() => {
          set_updating(false);
        });
    }

    else if (updateStrategy === 'configWillLetOpenChannels') {
      // GROUP 2: Safes cloned with old wrong config, but correct SC addresses

      const moduleAddressWithout0x = moduleAddress.slice(2).toLocaleLowerCase();

      // configWillLetOpenChannels
      // const newConfig = `0x8d80ff0a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000016b00${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000693bac5ce61c720ddc68533991ceb41199d8f8ae00${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000d4fdec44db9d44b8f2b6d529620f9c0c7066a2c100${moduleAddressWithout0x}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024a2450f89693bac5ce61c720ddc68533991ceb41199d8f8ae010103030303030303030303000000000000000000000000000000000000000000`;

      // configWillLetOpenChannels and configAnnounceOnly
      const newConfig = `0x8d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001e400${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000693bac5ce61c720ddc68533991ceb41199d8f8ae00${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000d4fdec44db9d44b8f2b6d529620f9c0c7066a2c100${moduleAddressWithout0x}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024a2450f89693bac5ce61c720ddc68533991ceb41199d8f8ae01010303030303030303030300${moduleAddressWithout0x}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024a76c9a2f619eabE23FD0E2291B50a507719aa633fE6069b801000300000000000000000000000000000000000000000000000000000000000000000000000000`

      dispatch(
        safeActionsAsync.createAndExecuteSafeContractTransactionThunk({
          data: newConfig,
          signer,
          safeAddress: selectedSafeAddress,
          operation: OperationType.DelegateCall,
          smartContractAddress: MULTISEND_CONTRACT_GNOSIS,
        }),
      )
      .unwrap()
      .then(() => {
        dispatch(stakingHubActions.setConfigUpdated());
      })
      .finally(() => {
        set_updating(false);
      });
    }

    else if (updateStrategy === 'configAnnounceOnly') {
      // GROUP 3 when announce target was not provided earlier
      const newConfig = `0x619eabE23FD0E2291B50a507719aa633fE6069b8010003000000000000000000`;

      const scopeTargetToken  = encodeFunctionData({
        abi: web3.hoprNodeManagementModuleABI,
        functionName: 'scopeTargetToken',
        args: [newConfig],
      });

      console.log('scopeTargetToken', scopeTargetToken)

      dispatch(
        safeActionsAsync.createAndExecuteSafeContractTransactionThunk({
          data: scopeTargetToken,
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: moduleAddress,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(stakingHubActions.setConfigUpdated());
        })
        .finally(() => {
          set_updating(false);
        });
    }


    else {
      set_updating(false)
    }

  };

  const signUpdateConfig = async () => {
    if (!signer || !moduleAddress) return;

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
        safeActionsAsync.createSafeContractTransactionThunk({
          data: addChannelsAndTokenTarget,
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: moduleAddress,
        }),
      )
        .unwrap()
        .finally(() => {
          set_updating(false);
        });
    }

    else if (updateStrategy === 'configWillLetOpenChannels') {
      // GROUP 2: Safes cloned with old wrong config, but correct SC addresses
      const moduleAddressWithout0x = moduleAddress.slice(2).toLocaleLowerCase();

      // configWillLetOpenChannels and configAnnounceOnly
      const newConfig = `0x8d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000001e400${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000693bac5ce61c720ddc68533991ceb41199d8f8ae00${moduleAddressWithout0x}000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000243401cde8000000000000000000000000d4fdec44db9d44b8f2b6d529620f9c0c7066a2c100${moduleAddressWithout0x}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024a2450f89693bac5ce61c720ddc68533991ceb41199d8f8ae01010303030303030303030300${moduleAddressWithout0x}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000024a76c9a2f619eabE23FD0E2291B50a507719aa633fE6069b801000300000000000000000000000000000000000000000000000000000000000000000000000000`

      dispatch(
        safeActionsAsync.createSafeContractTransactionThunk({
          data: newConfig,
          signer,
          safeAddress: selectedSafeAddress,
          operation: OperationType.DelegateCall,
          smartContractAddress: MULTISEND_CONTRACT_GNOSIS,
        }),
      )
        .unwrap()
        .finally(() => {
          set_updating(false);
        });
    }

    else if (updateStrategy === 'configAnnounceOnly') {
      // GROUP 3 when announce target was not provided earlier
      const newConfig = `0x619eabE23FD0E2291B50a507719aa633fE6069b8010003000000000000000000`;

      const scopeTargetToken  = encodeFunctionData({
        abi: web3.hoprNodeManagementModuleABI,
        functionName: 'scopeTargetToken',
        args: [newConfig],
      });

      console.log('scopeTargetToken', scopeTargetToken)

      dispatch(
        safeActionsAsync.createSafeContractTransactionThunk({
          data: scopeTargetToken,
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: moduleAddress,
        }),
      )
        .unwrap()
        .finally(() => {
          set_updating(false);
        });
    }
  };

  function whichNFTimage() {
    if (communityNftIdInSafe !== false) return '/assets/nft-in-safe.png';
    if (communityNftIdInWallet === null) return '/assets/nft-NOT-detected-in-wallet.png';
    if (communityNftIdInWallet !== null) return '/assets/nft-detected-in-wallet.png';
  }

  return (
    <Container className="SafeDashboard">
        <GrayCard
          id="safe-owners"
          title="Safe Owners:"
          buttons={[
              {
                text: 'Edit',
                link: '/staking/edit-owners',
              },
            ]
          }
        >
          <ul>
            {safeOwners?.map(owner => <li key={`safe_owner_${owner}`}>{owner}</li>)}
          </ul>
          <div className="inline"><h4 className="inline">Required confirmations:</h4> {safeThreshold} out of {safeOwners && safeOwners.length} owners.</div>
        </GrayCard>
        <GrayCard
          id="Update-Node-Configuration"
          title="Safe Configuration"
          currency={needsUpdate && onboardingIsFinished ? <span style={{ color: 'red' }}>Update needed</span> : <span style={{ color: 'darkGreen' }}>Current version</span>}
          >
            <SafeTransactionButton
              executeOptions={{
                pending: updating,
                disabled: !(needsUpdate && onboardingIsFinished),
                onClick: executeUpdateConfig,
                buttonText: 'Update',
              }}
              signOptions={{
                pending: updating,
                disabled: !(needsUpdate && onboardingIsFinished),
                onClick: signUpdateConfig,
                buttonText: 'Sign update',
              }}
              safeInfo={safeInfo}
            />
        </GrayCard>
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
