import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { Address, parseUnits } from 'viem';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import { StepContainer } from '../components';
import { useEthersSigner } from '../../../../hooks';

// Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';

// MUI
import TextField from '@mui/material/TextField';

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

const StyledForm = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  border-bottom: 1px solid #414141;
`;

const StyledInstructions = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
`;

const StyledText = styled.h3`
  color: var(--414141, #414141);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-transform: uppercase;
`;

const StyledDescription = styled.p`
  color: #414141;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.35px;
`;

const StyledInputGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const StyledCoinLabel = styled.p`
  color: var(--414141, #414141);
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 60px;
  letter-spacing: 0.35px;
  text-transform: uppercase;
`;

const StyledBlueButton = styled(Button)`
  text-transform: uppercase;
  padding: 0.2rem 4rem;
`;

export default function FundNode() {
  const dispatch = useAppDispatch();
  // injected states
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const nodeAddress = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  // local states
  const [xdaiValue, set_xdaiValue] = useState<string>('');
  const [isExecutionLoading, set_isExecutionLoading] = useState<boolean>();

  const signer = useEthersSigner();

  const createAndExecuteTx = () => {
    if (!signer || !Number(xdaiValue) || !selectedSafeAddress || !nodeAddress) return;
    set_isExecutionLoading(true);

    dispatch(
      safeActionsAsync.createAndExecuteTransactionThunk({
        signer,
        safeAddress: selectedSafeAddress,
        safeTransactionData: {
          to: nodeAddress,
          value: parseUnits(xdaiValue as `${number}`, 18).toString(),
          data: '0x',
        },
      }),
    )
      .unwrap()
      .then(() => {
        set_isExecutionLoading(false);
      })
      .catch(() => {
        set_isExecutionLoading(false);
      });
  };

  return (
    <StepContainer
      title="Fund Node"
      description={'You need to sign a transaction to connect your node to your existing HOPR safe.'}
    >
      <div>
        <StyledForm>
          <StyledInstructions>
            <StyledText>SEND xdAI to Node</StyledText>
            <StyledDescription>
              Add-in the amount of xDAI you like to transfer from your safe to your node.
            </StyledDescription>
          </StyledInstructions>
          <StyledInputGroup>
            <TextField
              variant="outlined"
              placeholder="-"
              size="small"
              value={xdaiValue}
              onChange={(e) => set_xdaiValue(e.target.value)}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
              InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
            />
            <StyledCoinLabel>xdai</StyledCoinLabel>
          </StyledInputGroup>
        </StyledForm>
        <StyledBlueButton
          onClick={createAndExecuteTx}
          pending={isExecutionLoading}
        >
          FUND
        </StyledBlueButton>
        {isExecutionLoading && <p>Executing transaction with nonce...</p>}
      </div>
    </StepContainer>
  );
}
