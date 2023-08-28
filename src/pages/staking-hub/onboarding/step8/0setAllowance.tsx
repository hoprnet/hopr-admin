// UI
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import { useEthersSigner } from '../../../../hooks';
import { StepContainer } from '../components';

// Blockchain
import { MAX_UINT256, createApproveTransactionData } from '../../../../utils/blockchain';
import { HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, HOPR_TOKEN_USED_CONTRACT_ADDRESS } from '../../../../../config';
import { Address } from 'viem';

// Store
import { useAppDispatch, useAppSelector } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

export default function SetAllowance() {
  const dispatch = useAppDispatch();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const isLoading = useAppSelector((store) => store.safe.createTransaction.isFetching);
  const signer = useEthersSigner();

  const setAllowance = async () => {
    if (signer && selectedSafeAddress) {
      dispatch(
        safeActionsAsync.createSafeContractTransaction({
          data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, MAX_UINT256),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      );
    }
  };

  return (
    <StepContainer
      title="Set Allowance"
      description={''}
    >
      <ButtonContainer>
        <StyledGrayButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(12));
          }}
        >
          Back
        </StyledGrayButton>
        <Button
          onClick={setAllowance}
          pending={isLoading}
        >
          SIGN
        </Button>
      </ButtonContainer>
    </StepContainer>
  );
}
