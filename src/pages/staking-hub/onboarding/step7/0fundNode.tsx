import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address, parseUnits } from 'viem';
import { MINIMUM_XDAI_TO_FUND_NODE } from '../../../../../config';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';
import { useEthersSigner } from '../../../../hooks';
import { StepContainer } from '../components';
import { StyledTextField } from '../styled';

// Store
import { FeedbackTransaction } from '../../../../components/FeedbackTransaction';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { safeActionsAsync } from '../../../../store/slices/safe';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

// MUI
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';
import SafeTransactionButton from '../../../../components/SafeTransactionButton';

const BlueTooltip = styled(({
  className,
  ...props
}: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({ [`& .${tooltipClasses.tooltip}`]: {
  backgroundColor: "#DAF8FF",
  color: '#414141',
  borderRadius: "10px",
  fontSize: "12px",
  boxShadow: "0px 4px 4px #00000040",
} }));


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

export const SSafeTransactionButton = styled(SafeTransactionButton)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

export default function FundNode(props?: { onDone?: Function, nodeAddress?: string | null}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // injected states
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress);
  const nodeAddressFromStore = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const safeXDaiBalance = useAppSelector((store) => store.safe.balance.data.xDai.formatted) as string;
  const isExecutionLoading = useAppSelector((store) => store.safe.executeTransaction.isFetching);

  // local states
  const [xdaiValue, set_xdaiValue] = useState<string>('');
  const [error, set_error] = useState<boolean>(false);
  const [errorMessage, set_errorMessage] = useState<string | null>(null);
  const [transactionHash, set_transactionHash] = useState<Address>();
  const [isWalletLoading, set_isWalletLoading] = useState(false);
  const signer = useEthersSigner();

  const nodeAddress:string = props?.nodeAddress ? props.nodeAddress : nodeAddressFromStore;

  const createAndExecuteTx = () => {
    if (!signer || !Number(xdaiValue) || !selectedSafeAddress || !nodeAddress) return;
    set_isWalletLoading(true);
    dispatch(
      safeActionsAsync.createAndExecuteSafeTransactionThunk({
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
      .then((hash) => {
        set_transactionHash(hash as Address);
        if (props?.onDone){
          props.onDone();
        } else {
          dispatch(stakingHubActions.setOnboardingStep(15));
        }
      })
      .catch(() => {
        set_error(true);
      })
      .finally(() => set_isWalletLoading(false));
  };

  const signTx = () => {
    if (!signer || !Number(xdaiValue) || !selectedSafeAddress || !nodeAddress) return;
    set_isWalletLoading(true);
    dispatch(
      safeActionsAsync.createSafeTransactionThunk({
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
      .catch((error) => {
        console.warn(error);
        if(JSON.stringify(error).includes('user rejected transaction')){
          set_errorMessage('User rejected transaction');
        }
        set_error(true);
      })
      .finally(() => {
        set_isWalletLoading(false);
        navigate('/staking/dashboard#transactions');
      });
  };

  useEffect(() => {
    if (safeXDaiBalance !== null && parseUnits(xdaiValue, 18) > parseUnits(safeXDaiBalance, 18)) {
      set_error(true);
      set_errorMessage('You do not have enough xDai in Safe');
    } else {
      set_error(false);
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
        <SSafeTransactionButton
          safeInfo={safeInfo}
          executeOptions={{
            onClick: createAndExecuteTx,
            pending: isExecutionLoading || isWalletLoading,
            disabled:
              error ||
              xdaiValue === '' ||
              parseUnits(xdaiValue, 18) === parseUnits('0', 18) ||
              xdaiValue.includes('-') ||
              xdaiValue.includes('+'),
            buttonText: 'FUND',
          }}
          signOptions={{
            onClick: signTx,
            pending: isWalletLoading,
            disabled:
              error ||
              xdaiValue === '' ||
              parseUnits(xdaiValue, 18) === parseUnits('0', 18) ||
              xdaiValue.includes('-') ||
              xdaiValue.includes('+'),
            buttonText: 'SIGN FUND',
          }}
        />
      }
    >
      <div>
        <StyledForm>
          <StyledInstructions>
            <StyledText>NODE ADDRESS</StyledText>
          </StyledInstructions>
          <StyledInputGroup>
            <StyledTextField
              variant="outlined"
              placeholder="-"
              size="small"
              style={{ width: '435px' }}
              value={nodeAddress}
              disabled
              InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
            />
          </StyledInputGroup>
        </StyledForm>
        <StyledForm>
          <StyledInstructions>
            <StyledText>SEND xDAI TO NODE {' '}
              <BlueTooltip title="Enter the amount of xDAI you would like to transfer from your Safe to your node." >
                <img src='/assets/question-icon.svg' style={{ height: "100%" }} />
              </BlueTooltip></StyledText>
          </StyledInstructions>
          <StyledInputGroup>
            <StyledTextField
              variant="outlined"
              placeholder="-"
              size="small"
              style={{ width: '300px' }}
              value={xdaiValue}
              onChange={(e) => set_xdaiValue(e.target.value)}
              type="number"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
              InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
              helperText={error ? errorMessage : `min. ${MINIMUM_XDAI_TO_FUND_NODE}`}
              error={!!xdaiValue && error}
            />
            <StyledCoinLabel>xDAI</StyledCoinLabel>
            <StyledGrayButton onClick={() => set_xdaiValue('1')}>MIN</StyledGrayButton>
          </StyledInputGroup>
        </StyledForm>
        <FeedbackTransaction
          isWalletLoading={isWalletLoading}
          confirmations={1}
          transactionHash={transactionHash}
          feedbackTexts={{ loading: 'Please wait while we confirm the transaction...' }}
        />
      </div>
    </StepContainer>
  );
}
