import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Address, getAddress } from 'viem';
import { StepContainer } from '../components';
import { useEthersSigner } from '../../../../hooks';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../future-hopr-lib-components/Button';

// Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { safeActionsAsync } from '../../../../store/slices/safe';
import SafeTransactionButton from '../../../../components/SafeTransactionButton';

// Web3
import { createIncludeNodeTransactionData } from '../../../../utils/blockchain';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';


export const SSafeTransactionButton = styled(SafeTransactionButton)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

export default function ConfigureNode(props?: { onDone?: Function, nodeAddress?: string | null}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const signer = useEthersSigner();
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const walletAddress =  useAppSelector((store) => store.web3.account);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress) as Address;
  const moduleAddress = useAppSelector((state) => state.stakingHub.onboarding.moduleAddress) as Address;
  const isLoading = useAppSelector((store) => store.safe.executeTransaction.isFetching);
  const nodeAddressFromOnboarding = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const threshold = safeInfo?.threshold;
  const nodeAddress = props?.nodeAddress ? props.nodeAddress : nodeAddressFromOnboarding;
  const pendingTransations = useAppSelector((store) => store.safe.pendingTransactions.data?.results);
  const [thisTransactionIsWaitingToSign, set_thisTransactionIsWaitingToSign] = useState(false);
  const [thisTransactionHasSignaturesIsWaitingToExecute, set_thisTransactionHasSignaturesIsWaitingToExecute] = useState<false | SafeMultisigTransactionResponse>(false);

  useEffect(()=>{
    if(walletAddress && moduleAddress && threshold && threshold > 1 && nodeAddress) {
      if(pendingTransations && pendingTransations.length !== 0) {
        for(let i = 0; i < pendingTransations.length; i++) {
          if(
            pendingTransations[i] &&
            moduleAddress === pendingTransations[i].to &&
            pendingTransations[i].data && typeof(pendingTransations[i].data) === 'string' &&
            // @ts-ignore
            pendingTransations[i].data.slice(0,10) === '0xb5736962' && pendingTransations[i].data.slice(50,73) === '01020100000000000000000' && pendingTransations[i].data.slice(10,50).toLowerCase() === nodeAddress.toLowerCase().slice(2,42) &&
            pendingTransations[i].confirmations!.length > 0
          ) {
            console.log('[Onboarding check] We have an onboarding TX created for that node', pendingTransations[i])
            const confirmationsDone = pendingTransations[i].confirmations!.length | 0;

            // If this is the last signature or we have all signatures
            if(pendingTransations[i].confirmationsRequired - 1 >= confirmationsDone) {
              console.log('pendingTransations[i]', pendingTransations[i])
              set_thisTransactionHasSignaturesIsWaitingToExecute(pendingTransations[i]);
              return
            }

            //If not last signature needed
            const confirmations = pendingTransations[i].confirmations;
            for(let j = 0; j < confirmationsDone; j++) {
              // @ts-ignore
              const confirmation = confirmations[j];
              const signerOfTheConfirmation = confirmation.owner;
              if(signerOfTheConfirmation === walletAddress) {
                set_thisTransactionIsWaitingToSign(true);
                return;
              }
            }
          }
        }
      }
    }
  },[threshold, pendingTransations, moduleAddress, walletAddress, nodeAddress])

  const executeIncludeNode = async () => {
    if (signer && selectedSafeAddress && moduleAddress && nodeAddress) {
      dispatch(
        safeActionsAsync.createAndExecuteSafeContractTransactionThunk({
          smartContractAddress: moduleAddress,
          data: createIncludeNodeTransactionData(nodeAddress),
          safeAddress: selectedSafeAddress,
          signer,
        }),
      )
        .unwrap()
        .then(() => {
          if (props?.onDone){
            props.onDone();
            dispatch(stakingHubActions.setNextOnboarding({
              key: 'includedInModule',
              nodeAddress: nodeAddress,
              value: true,
            }));
          } else {
            dispatch(stakingHubActions.setOnboardingStep(14));
          }
        });
    }
  };

  const signIncludeNode = async () => {
    if (signer && selectedSafeAddress && moduleAddress && nodeAddress) {
      await dispatch(
        safeActionsAsync.createSafeContractTransactionThunk({
          smartContractAddress: moduleAddress,
          data: createIncludeNodeTransactionData(nodeAddress),
          safeAddress: selectedSafeAddress,
          signer,
        }),
      ).unwrap();
      navigate('/staking/dashboard#transactions');
    }
  };

  const executeSignedIncludeNode = async (transaction: SafeMultisigTransactionResponse) => {
    if (signer && selectedSafeAddress && moduleAddress && nodeAddress){
      await dispatch(
        safeActionsAsync.executePendingTransactionThunk({
          safeAddress: transaction.safe,
          signer,
          safeTransaction: transaction,
        }),
      ).unwrap().then(() => {
        if (props?.onDone){
          props.onDone();
          dispatch(stakingHubActions.setNextOnboarding({
            key: 'includedInModule',
            nodeAddress: nodeAddress,
            value: true,
          }));
        } else {
          dispatch(stakingHubActions.setOnboardingStep(14));
        }
      });
    }
  };

  return (
    <StepContainer
      title="CONFIGURE NODE"
      description={'You need to sign a transaction to connect your node to your existing HOPR safe.'}
      image={{
        src: '/assets/safe-and-node-chain.svg',
        height: 200,
      }}
      buttons={
        thisTransactionHasSignaturesIsWaitingToExecute ?
        <Button
          onClick={()=>{executeSignedIncludeNode(thisTransactionHasSignaturesIsWaitingToExecute)}}
        >
          EXECUTE
        </Button>
        :
        <SSafeTransactionButton
          executeOptions={{
            onClick: executeIncludeNode,
            pending: isLoading,
            buttonText: 'EXECUTE',
          }}
          signOptions={{
            onClick: signIncludeNode,
            pending: isLoading,
            buttonText: 'SIGN',
            disabled: thisTransactionIsWaitingToSign,
            tooltipText: thisTransactionIsWaitingToSign ? 'You need to sign this transaction by using another owner' : undefined
          }}
          safeInfo={safeInfo}
        />
       }
    />
  );
}
