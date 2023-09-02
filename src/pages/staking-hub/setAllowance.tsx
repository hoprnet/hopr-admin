// UI
import styled from '@emotion/styled';
import Section from '../../future-hopr-lib-components/Section';
import Button from '../../future-hopr-lib-components/Button';
import { useEthersSigner } from '../../hooks';
import { StepContainer, ConfirmButton } from './onboarding/components';
import { Lowercase, StyledCoinLabel, StyledInputGroup, StyledTextField } from './onboarding/safeOnboarding/styled';
import { DEFAULT_ALLOWANCE } from '../../../config';
import { useNavigate } from 'react-router-dom';

// Blockchain
import { Address, formatEther, parseEther, parseUnits } from 'viem';
import { HOPR_TOKEN_USED_CONTRACT_ADDRESS } from '../../../config';
import { MAX_UINT256, createApproveTransactionData } from '../../utils/blockchain';

// Store
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActionsAsync } from '../../store/slices/safe';
import { stakingHubActions } from '../../store/slices/stakingHub';


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
  const navigate = useNavigate();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as Address;
  const nodeAddress = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const signer = useEthersSigner();
  const [wxHoprValue, set_wxHoprValue] = useState('');
  const [loading, set_loading] = useState(false);

  const setAllowance = async () => {
    if (signer && selectedSafeAddress && nodeAddress) {
      set_loading(true);
      await dispatch(
        safeActionsAsync.createAndExecuteContractTransactionThunk({
          data: createApproveTransactionData(nodeAddress,parseUnits(wxHoprValue, 18)),
          signer,
          safeAddress: selectedSafeAddress,
          smartContractAddress: HOPR_TOKEN_USED_CONTRACT_ADDRESS,
        }),
      ).unwrap();
      navigate('/staking/dashboard#node');
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
          <ConfirmButton
            onClick={setAllowance}
            disabled={wxHoprValue === '' || wxHoprValue === '0' || wxHoprValue.includes('-') || wxHoprValue.includes('+')}
            pending={loading}
          >
            EXECUTE
          </ConfirmButton>
        }
      >
        <StyledInputGroup
          style={{alignItems: 'flex-start'}}
        >
          <StyledText
          >NODE ALLOWANCE</StyledText>
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
          <StyledCoinLabel
            style={{lineHeight: '40px'}}
          >
            <Lowercase>wx</Lowercase>HOPR
          </StyledCoinLabel>
          <Button onClick={() => set_wxHoprValue(DEFAULT_ALLOWANCE.toString())}>DEFAULT</Button>
        </StyledInputGroup>
      </StepContainer>
    </Section>
  );
}
