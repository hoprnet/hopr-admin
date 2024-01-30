// UI
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_ALLOWANCE, HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, HOPR_TOKEN_USED_CONTRACT_ADDRESS } from '../../../config'
import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';
import { useEthersSigner } from '../../hooks';
import { StepContainer } from './onboarding/components';
import { Lowercase, StyledCoinLabel, StyledInputGroup, StyledTextField } from './onboarding/styled';

// Blockchain
import { Address, parseUnits } from 'viem';
import { createApproveTransactionData } from '../../utils/blockchain';

// Store
import { useState } from 'react';
import SafeTransactionButton from '../../components/SafeTransactionButton';
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActionsAsync } from '../../store/slices/safe';

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
  const navigate = useNavigate();
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const signer = useEthersSigner();
  const [wxHoprValue, set_wxHoprValue] = useState('');
  const [loading, set_loading] = useState(false);

  const executeAllowance = async () => {
    if (signer && selectedSafeAddress && HOPR_CHANNELS_SMART_CONTRACT_ADDRESS) {
      set_loading(true);
      await dispatch(
        safeActionsAsync.createAndExecuteSafeContractTransactionThunk({
          data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, parseUnits(wxHoprValue, 18)),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      ).unwrap();
      navigate('/staking/dashboard');
      set_loading(false);
    }
  };

  const signAllowance = async () => {
    if (signer && selectedSafeAddress && HOPR_CHANNELS_SMART_CONTRACT_ADDRESS) {
      set_loading(true);
      await dispatch(
        safeActionsAsync.createSafeContractTransactionThunk({
          data: createApproveTransactionData(HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, parseUnits(wxHoprValue, 18)),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      ).unwrap();
      navigate('/staking/dashboard');
      set_loading(false);
    }
  };

  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <StepContainer
        title="SET wxHOPR ALLOWANCE"
        description={`Your node will need to access wxHOPR from your safe to fund payment channels on the HOPR network. You can set a maximum allowance to reduce your funds at risk in case your node is ever compromised.`}
        buttons={
          <SSafeTransactionButton
            executeOptions={{
              onClick: executeAllowance,
              disabled:
                wxHoprValue === '' || wxHoprValue === '0' || wxHoprValue.includes('-') || wxHoprValue.includes('+'),
              pending: loading,
            }}
            signOptions={{
              onClick: signAllowance,
              disabled:
                wxHoprValue === '' || wxHoprValue === '0' || wxHoprValue.includes('-') || wxHoprValue.includes('+'),
              pending: loading,
            }}
            safeInfo={safeInfo}
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
      </StepContainer>
    </Section>
  );
}
