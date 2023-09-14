// UI
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { useEthersSigner } from '../../../../hooks';
import { StepContainer, ConfirmButton } from '../components';
import { Lowercase, StyledCoinLabel, StyledInputGroup, StyledTextField } from '../styled';

// Blockchain
import { Address, parseUnits } from 'viem';
import { HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, DEFAULT_ALLOWANCE, HOPR_TOKEN_USED_CONTRACT_ADDRESS } from '../../../../../config';
import { createApproveTransactionData } from '../../../../utils/blockchain';

// Store
import { useState } from 'react';
import { FeedbackTransaction } from '../../../../components/FeedbackTransaction';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

const StyledText = styled.h3`
  color: var(--414141, #414141);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-align: end;
  margin: 0;
  margin-top: 5px;
`;

export default function SetAllowance() {
  const dispatch = useAppDispatch();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const signer = useEthersSigner();
  const [wxHoprValue, set_wxHoprValue] = useState('');
  const [loading, set_loading] = useState(false);
  const [transactionHash, set_transactionHash] = useState<Address>();

  const setAllowance = async () => {
    if (signer && selectedSafeAddress && HOPR_CHANNELS_SMART_CONTRACT_ADDRESS) {
      set_loading(true);
      await dispatch(
        safeActionsAsync.createAndExecuteContractTransactionThunk({
          data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS,parseUnits(wxHoprValue, 18)),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      )
        .unwrap()
        .then((hash) => {
          set_transactionHash(hash as Address);
          dispatch(stakingHubActions.setOnboardingStep(16));
        })
        .finally(() => {
          set_loading(false);
        });
    }
  };

  return (
    <StepContainer
      title="SET wxHOPR ALLOWANCE"
      description={`Your node will need to access wxHOPR from your safe to fund payment channels on the HOPR network. You can set a maximum allowance to reduce your funds at risk in case your node is ever compromised.`}
      buttons={
        <ConfirmButton
          onClick={setAllowance}
          disabled={wxHoprValue === '' || wxHoprValue === '0' || wxHoprValue.includes('-') || wxHoprValue.includes('+')}
          pending={loading}
        >
          EXECUTE
        </ConfirmButton>
      }
    >
      <StyledInputGroup style={{ alignItems: 'flex-start' }}>
        <StyledText>NODE ALLOWANCE</StyledText>
        <StyledTextField
          type="number"
          variant="outlined"
          placeholder="-"
          size="small"
          value={wxHoprValue}
          onChange={(e) => set_wxHoprValue(e.target.value)}
          InputProps={{ inputProps: {
            style: { textAlign: 'right' },
            min: 0,
            pattern: '[0-9]*',
          } }}
          helperText={`Suggested value is ${DEFAULT_ALLOWANCE} wxHopr`}
        />
        <StyledCoinLabel style={{ lineHeight: '40px' }}>
          <Lowercase>wx</Lowercase>HOPR
        </StyledCoinLabel>
        <Button onClick={() => set_wxHoprValue(DEFAULT_ALLOWANCE.toString())}>DEFAULT</Button>
      </StyledInputGroup>
      <FeedbackTransaction
        confirmations={1}
        feedbackTexts={{ loading: 'Please wait while we confirm the transaction...' }}
        transactionHash={transactionHash}
      />
    </StepContainer>
  );
}
