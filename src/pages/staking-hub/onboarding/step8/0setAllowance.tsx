// UI
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import { useEthersSigner } from '../../../../hooks';
import { StepContainer } from '../components';

// Blockchain
import { Address, formatEther, parseEther } from 'viem';
import { HOPR_TOKEN_USED_CONTRACT_ADDRESS } from '../../../../../config';
import { MAX_UINT256, createApproveTransactionData } from '../../../../utils/blockchain';

// Store
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import { Lowercase, StyledCoinLabel, StyledInputGroup, StyledTextField } from '../safeOnboarding/styled';

const StyledText = styled.h3`
  color: var(--414141, #414141);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-align: end;
`;

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
  const isLoading = useAppSelector((store) => store.safe.createTransaction.isFetching);
  const signer = useEthersSigner();
  const [wxhoprValue, set_wxhoprValue] = useState('');

  const setAllowance = async () => {
    if (signer && selectedSafeAddress) {
      await dispatch(
        safeActionsAsync.createSafeContractTransaction({
          data: createApproveTransactionData(nodeAddress, MAX_UINT256),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      ).unwrap();
    }
  };

  return (
    <StepContainer
      title="SET wxHOPR ALLOWANCE"
      description={`Your node will need to access wxHOPR from your safe to fund payment channels on the HOPR network. You can set a maximum allowance to reduce your funds at risk in case your node is ever compromised.`}
    >
      <StyledInputGroup>
        <StyledText>NODE ALLOWANCE</StyledText>
        <StyledTextField
          type="number"
          variant="outlined"
          placeholder="-"
          size="small"
          value={formatEther(BigInt(wxhoprValue))}
          onChange={(e) => set_wxhoprValue(parseEther(e.target.value).toString())}
          InputProps={{ inputProps: {
            style: { textAlign: 'right' },
            min: 0,
            pattern: '[0-9]*',
          } }}
        />
        <StyledCoinLabel>
          <Lowercase>wx</Lowercase>hopr
        </StyledCoinLabel>
        <Button onClick={() => set_wxhoprValue(MAX_UINT256.toString())}>DEFAULT</Button>
      </StyledInputGroup>
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
