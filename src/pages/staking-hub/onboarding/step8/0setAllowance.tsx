// UI
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { useEthersSigner } from '../../../../hooks';
import { StepContainer } from '../components';
import { Lowercase, StyledCoinLabel, StyledInputGroup, StyledTextField } from '../styled';

// Blockchain
import { Address, parseUnits } from 'viem';
import { HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, DEFAULT_ALLOWANCE, HOPR_TOKEN_USED_CONTRACT_ADDRESS } from '../../../../../config'
import { createApproveTransactionData } from '../../../../utils/blockchain';

// Store
import { useState } from 'react';
import { FeedbackTransaction } from '../../../../components/FeedbackTransaction';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { stakingHubActions } from '../../../../store/slices/stakingHub';
import SafeTransactionButton from '../../../../components/SafeTransactionButton';

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

export const SSafeTransactionButton = styled(SafeTransactionButton)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

export default function SetAllowance() {
  const dispatch = useAppDispatch();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress) as Address;
  const safeInfo = useAppSelector((store) => store.safe.info.data)
  const signer = useEthersSigner();
  const [wxHoprValue, set_wxHoprValue] = useState('');
  const [isWalletLoading, set_isWalletLoading] = useState(false);
  const [transactionHash, set_transactionHash] = useState<Address>();

  const executeAllowance = async () => {
    if (signer && selectedSafeAddress && HOPR_CHANNELS_SMART_CONTRACT_ADDRESS) {
      set_isWalletLoading(true);
      await dispatch(
        safeActionsAsync.createAndExecuteSafeContractTransactionThunk({
          data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, parseUnits(wxHoprValue, 18)),
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
          set_isWalletLoading(false);
        });
    }
  };

  const signAllowance = async () => {
    if (signer && selectedSafeAddress && HOPR_CHANNELS_SMART_CONTRACT_ADDRESS) {
      set_isWalletLoading(true);
      await dispatch(
        safeActionsAsync.createSafeContractTransactionThunk({
          data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, parseUnits(wxHoprValue, 18)),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      )
        .unwrap()
        .finally(() => {
          set_isWalletLoading(false);
        });
    }
  };

  return (
    <StepContainer
      title="SET wxHOPR ALLOWANCE"
      description={`Your node will need to access wxHOPR from your safe to fund payment channels on the HOPR network. You can set a maximum allowance to reduce your funds at risk in case your node is ever compromised.`}
      buttons={
        <SSafeTransactionButton
          executeOptions={{
            onClick: executeAllowance,
            disabled: wxHoprValue === '' || wxHoprValue === '0' || wxHoprValue.includes('-') || wxHoprValue.includes('+'),
            pending: isWalletLoading,
            buttonText: 'EXECUTE',
          }}
          safeInfo={safeInfo}
          signOptions={{
            onClick: signAllowance,
            disabled: wxHoprValue === '' || wxHoprValue === '0' || wxHoprValue.includes('-') || wxHoprValue.includes('+'),
            pending: isWalletLoading,
            buttonText: 'SIGN',
          }}
        />
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
        isWalletLoading={isWalletLoading}
        feedbackTexts={{ loading: 'Please wait while we confirm the transaction...' }}
        transactionHash={transactionHash}
      />
    </StepContainer>
  );
}
