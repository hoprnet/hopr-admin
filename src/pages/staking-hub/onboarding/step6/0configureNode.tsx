import styled from '@emotion/styled';
import { Address, getAddress } from 'viem';
import { StepContainer } from '../components';
import { useEthersSigner } from '../../../../hooks';

// Web3
import { createIncludeNodeTransactionData } from '../../../../utils/blockchain';

// Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { safeActionsAsync } from '../../../../store/slices/safe';
import SafeTransactionButton from '../../../../components/SafeTransactionButton';


export const SSafeTransactionButton = styled(SafeTransactionButton)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

export default function ConfigureNode(props?: { onDone?: Function, nodeAddress?: string | null}) {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const moduleAddress = useAppSelector((state) => state.stakingHub.onboarding.moduleAddress) as Address;
  const isLoading = useAppSelector((store) => store.safe.executeTransaction.isFetching);
  const nodeAddressFromOnboarding = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const nodeAddress = props?.nodeAddress ? props.nodeAddress : nodeAddressFromOnboarding;

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
      dispatch(
        safeActionsAsync.createSafeContractTransactionThunk({
          smartContractAddress: moduleAddress,
          data: createIncludeNodeTransactionData(nodeAddress),
          safeAddress: selectedSafeAddress,
          signer,
        }),
      )
        .unwrap()
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
          }}
          safeInfo={safeInfo}
        />
      }
    />
  );
}
