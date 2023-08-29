import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { Address, getAddress } from 'viem';
import { StepContainer } from '../components';
import { useEthersSigner } from '../../../../hooks';

// Web3
import { createIncludeNodeTransactionData, encodeDefaultPermissions } from '../../../../utils/blockchain';

// Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { safeActionsAsync } from '../../../../store/slices/safe';

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

export default function ConfigureNode() {
  const dispatch = useAppDispatch();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const nodeAddress = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const moduleAddress = useAppSelector((state) => state.stakingHub.onboarding.moduleAddress) as Address;
  const isLoading = useAppSelector((store) => store.safe.executeTransaction.isFetching);
  const signer = useEthersSigner();

  const includeNode = async () => {
    if (signer && selectedSafeAddress && moduleAddress && nodeAddress) {
      dispatch(
        safeActionsAsync.createAndExecuteContractTransactionThunk({
          smartContractAddress: moduleAddress,
          data: createIncludeNodeTransactionData(encodeDefaultPermissions(getAddress(nodeAddress))),
          safeAddress: selectedSafeAddress,
          signer,
        }),
      )
        .unwrap()
        .then(() => {
          dispatch(stakingHubActions.setOnboardingStep(14));
        });
    }
  };

  return (
    <StepContainer
      title="Configure Node"
      description={'You need to sign a transaction to connect your node to your existing HOPR safe.'}
      image={{
        src: '/assets/node-blue.svg',
        height: 200,
      }}
    >
      <ButtonContainer>
        <Button
          onClick={includeNode}
          pending={isLoading}
        >
          SIGN
        </Button>
      </ButtonContainer>
    </StepContainer>
  );
}
