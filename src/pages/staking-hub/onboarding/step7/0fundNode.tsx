import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import { Address, parseUnits } from 'viem';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import { StepContainer, ConfirmButton } from '../components';
import { useEthersSigner } from '../../../../hooks';
import { StyledTextField } from '../safeOnboarding/styled';
import { MINIMUM_XDAI_TO_FUND_NODE } from '../../../../../config';

// Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

const StyledForm = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 1rem;
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
`;

export const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

export default function FundNode() {
  const dispatch = useAppDispatch();
  // injected states
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const nodeAddress = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const safeXDaiBalance = useAppSelector((store) => store.safe.balance.data.xDai.formatted) as string;

  // local states
  const [xdaiValue, set_xdaiValue] = useState<string>('');
  const [isExecutionLoading, set_isExecutionLoading] = useState<boolean>();
  const [error, set_error] = useState<boolean>(false);

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
        dispatch(stakingHubActions.setOnboardingStep(15));
        set_isExecutionLoading(false);
      })
      .catch(() => {
        set_isExecutionLoading(false);
      });
  };

  useEffect(() => {
    if(safeXDaiBalance !== null && 
      parseUnits(xdaiValue, 18) > parseUnits(safeXDaiBalance, 18)
    ) { 
      set_error (true);
    } else {
      set_error (false);
    }
  }, [xdaiValue]);

  return (
    <StepContainer
      title="FUND YOUR NODE WITH xDAI"
      image={{
        src: '/assets/fund_node_from_safe.png',
        height: 133,
      }}
      buttons={
        <ConfirmButton
          onClick={createAndExecuteTx}
          pending={isExecutionLoading}
          disabled={error || xdaiValue === '' || parseUnits(xdaiValue, 18) ===  parseUnits('0', 18) || xdaiValue.includes('-') || xdaiValue.includes('+')}
        >
          FUND
        </ConfirmButton>
      }
    >
      <div>
        <StyledForm>
          <StyledInstructions>
            <StyledText>SEND xDAI TO NODE</StyledText>
          </StyledInstructions>
          <StyledInputGroup>
            <StyledTextField
              variant="outlined"
              placeholder="-"
              size="small"
              style={{width: '300px'}}
              value={xdaiValue}
              onChange={(e) => set_xdaiValue(e.target.value)}
              type="number"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
              InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
              helperText={error ? 'You do not have enough xDai in Safe.' : `min. ${MINIMUM_XDAI_TO_FUND_NODE}`}
              error={!!xdaiValue && error}
            />
            <StyledCoinLabel>xDAI</StyledCoinLabel>
            <StyledGrayButton onClick={() => set_xdaiValue('1')}>MIN</StyledGrayButton>
          </StyledInputGroup>
        </StyledForm>
        {isExecutionLoading && <p>Executing transaction...</p>}
      </div>
    </StepContainer>
  );
}
