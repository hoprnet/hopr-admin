import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { Address } from 'viem';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import { StepContainer } from '../components';
import { useEthersSigner } from '../../../../hooks';

// Web3
import { createIncludeNodeTransactionData, encodeDefaultPermissions } from '../../../../utils/blockchain'

// Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { safeActionsAsync } from '../../../../store/slices/safe';

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
  const nodeAddress = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const safeModules = useAppSelector((state) => state.safe.info.data?.modules);
  const signer = useEthersSigner();
  const [isLoading, set_isLoading] = useState(false);
  const [includeNodeResponse, set_includeNodeResponse] = useState('');

  const setAllowance = async () => {
    
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
        >Back</StyledGrayButton>
        <Button
          onClick={setAllowance}
          pending={isLoading}
        >
          SIGN
        </Button>
      </ButtonContainer>
    </StepContainer>
  );
};
