import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Address, parseUnits, getAddress } from 'viem';
import { MINIMUM_XDAI_TO_FUND_NODE } from '../../../config';
import Section from '../../future-hopr-lib-components/Section';
import { useEthersSigner } from '../../hooks';
import { StepContainer } from './onboarding/components';
import { StyledTextField } from './onboarding/styled';

// Store
import { FeedbackTransaction } from '../../components/FeedbackTransaction';
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActionsAsync } from '../../store/slices/safe';
import SafeTransactionButton from '../../components/SafeTransactionButton';

// HOPR Components
import StartOnboarding from '../../components/Modal/staking-hub/StartOnboarding';

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


export const SSafeTransactionButton = styled(SafeTransactionButton)`
  max-width: 250px;
  width: 100%;
  align-self: center;
`;

export default function FundNode() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const nodeAddressFromParams = searchParams.get('nodeAddress');

  // injected states
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress);
  const safeInfo = useAppSelector((store) => store.safe.info.data);
  const nodeAddressFromTheStore = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const safeXDaiBalance = useAppSelector((store) => store.safe.balance.data.xDai.formatted) as string;

  // local states
  const [xdaiValue, set_xdaiValue] = useState<string>('');
  const [isWalletLoading, set_isWalletLoading] = useState<boolean>();
  const [lowBalanceError, set_lowBalanceError] = useState<boolean>(false);
  const [txError, set_txError] = useState<string | null>(null);
  const [transactionHash, set_transactionHash] = useState<Address>()
  const signer = useEthersSigner();

  const nodeAddress = nodeAddressFromParams ? nodeAddressFromParams : nodeAddressFromTheStore;

  const createAndExecuteTx = async () => {
    if(txError) set_txError(null);
    if (!signer || !Number(xdaiValue) || !selectedSafeAddress || !nodeAddress) return;
    set_isWalletLoading(true);

    await dispatch(
      safeActionsAsync.createAndExecuteSafeTransactionThunk({
        signer,
        safeAddress: getAddress(selectedSafeAddress),
        safeTransactionData: {
          to: getAddress(nodeAddress),
          value: parseUnits(xdaiValue as `${number}`, 18).toString(),
          data: '0x',
        },
      }),
    ).unwrap()
    .then(res => {
      set_transactionHash(res as Address)
      setTimeout(() => {
        navigate('/staking/dashboard#node');
      }, 3000)
    })
    .catch((e) => {
      if(e.message) set_txError(`ERROR: ${JSON.stringify(e.message)}`)
      else set_txError(`ERROR: ${JSON.stringify(e)}`)
    });
    set_isWalletLoading(false);
  };


  const signTx = async () => {
    if(txError) set_txError(null)
    if (!signer || !Number(xdaiValue) || !selectedSafeAddress || !nodeAddress) return;
    set_isWalletLoading(true);

    await dispatch(
      safeActionsAsync.createSafeTransactionThunk({
        signer,
        safeAddress: getAddress(selectedSafeAddress),
        safeTransactionData: {
          to: getAddress(nodeAddress),
          value: parseUnits(xdaiValue as `${number}`, 18).toString(),
          data: '0x',
        },
      }),
    ).unwrap()
    .then(res => {
      set_transactionHash(res as Address)
      setTimeout(() => {
        navigate('/staking/dashboard#node');
      }, 3000)
    })
    .catch((e) => {
      if(e.message) set_txError(`ERROR: ${JSON.stringify(e.message)}`)
      else set_txError(`ERROR: ${JSON.stringify(e)}`)
    });
    set_isWalletLoading(false);
  };

  useEffect(() => {
    if (safeXDaiBalance !== null &&
      parseUnits(xdaiValue, 18) > parseUnits(safeXDaiBalance, 18)
    ) {
      set_lowBalanceError(true);
    } else {
      set_lowBalanceError(false);
    }
  }, [xdaiValue]);

  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <StartOnboarding />
      <StepContainer
        title="FUND YOUR NODE WITH xDAI"
        image={{
          src: '/assets/fund_node_from_safe.png',
          height: 133,
        }}
        buttons={
          <SSafeTransactionButton
            executeOptions={{
              onClick: createAndExecuteTx,
              pending: isWalletLoading,
              disabled: lowBalanceError || xdaiValue === '' || parseUnits(xdaiValue, 18) === parseUnits('0', 18) || xdaiValue.includes('-') || xdaiValue.includes('+'),
              buttonText: 'FUND',
            }}
            signOptions={{
              onClick: signTx,
              pending: isWalletLoading,
              disabled: lowBalanceError || xdaiValue === '' || parseUnits(xdaiValue, 18) === parseUnits('0', 18) || xdaiValue.includes('-') || xdaiValue.includes('+'),
              buttonText: 'SIGN FUND',
            }}
            safeInfo={safeInfo}
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
              <StyledText>SEND xDAI TO NODE</StyledText>
            </StyledInstructions>
            <StyledInputGroup>
              <StyledTextField
                variant="outlined"
                placeholder="-"
                size="small"
                style={{ width: '300px' }}
                value={xdaiValue}
                onChange={(e) => {
                  if(txError) set_txError(null)
                  set_xdaiValue(e.target.value);
                }}
                type="number"
                inputProps={{
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                }}
                InputProps={{ inputProps: { style: { textAlign: 'right' } } }}
                helperText={lowBalanceError ? 'You do not have enough xDai in Safe.' : `min. ${MINIMUM_XDAI_TO_FUND_NODE}`}
                error={!!xdaiValue && lowBalanceError}
              />
              <StyledCoinLabel>xDAI</StyledCoinLabel>
            </StyledInputGroup>
          </StyledForm>
          <FeedbackTransaction
            confirmations={1}
            isWalletLoading={isWalletLoading}
            transactionHash={transactionHash}
            feedbackTexts={{ loading: 'Please wait while we confirm the transaction...' }}
            errorMessage={txError}
          />
        </div>
      </StepContainer>
    </Section>
  );
}
