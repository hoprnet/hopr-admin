import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Address, parseUnits } from 'viem';
import { MINIMUM_XDAI_TO_FUND_NODE } from '../../../config';
import Section from '../../future-hopr-lib-components/Section';
import { useEthersSigner } from '../../hooks';
import { ConfirmButton, StepContainer } from './onboarding/components';
import { StyledTextField } from './onboarding/styled';

// Store
import { FeedbackTransaction } from '../../components/FeedbackTransaction';
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActionsAsync } from '../../store/slices/safe';

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

export default function FundNode() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const nodeAddressFromParams = searchParams.get('nodeAddress');

  // injected states
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const nodeAddressFromTheStore = useAppSelector((store) => store.stakingHub.onboarding.nodeAddress) as Address;
  const safeXDaiBalance = useAppSelector((store) => store.safe.balance.data.xDai.formatted) as string;

  // local states
  const [xdaiValue, set_xdaiValue] = useState<string>('');
  const [isWalletLoading, set_isWalletLoading] = useState<boolean>();
  const [error, set_error] = useState<boolean>(false);
  const [transactionHash, set_transactionHash] = useState<Address>()
  const signer = useEthersSigner();

  const nodeAddress = nodeAddressFromParams ? nodeAddressFromParams : nodeAddressFromTheStore;

  const createAndExecuteTx = async () => {
    if (!signer || !Number(xdaiValue) || !selectedSafeAddress || !nodeAddress) return;
    set_isWalletLoading(true);

    await dispatch(
      safeActionsAsync.createAndExecuteTransactionThunk({
        signer,
        safeAddress: selectedSafeAddress,
        safeTransactionData: {
          to: nodeAddress,
          value: parseUnits(xdaiValue as `${number}`, 18).toString(),
          data: '0x',
        },
      }),
    ).unwrap().then(res => {
      set_transactionHash(res as Address)
      setTimeout(() => {
        navigate('/staking/dashboard#node');
      }, 3000)
    });
    set_isWalletLoading(false);
  };

  useEffect(() => {
    if (safeXDaiBalance !== null &&
      parseUnits(xdaiValue, 18) > parseUnits(safeXDaiBalance, 18)
    ) {
      set_error(true);
    } else {
      set_error(false);
    }
  }, [xdaiValue]);

  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <StepContainer
        title="FUND YOUR NODE WITH xDAI"
        image={{
          src: '/assets/fund_node_from_safe.png',
          height: 133,
        }}
        buttons={
          <ConfirmButton
            onClick={createAndExecuteTx}
            pending={isWalletLoading}
            disabled={error || xdaiValue === '' || parseUnits(xdaiValue, 18) === parseUnits('0', 18) || xdaiValue.includes('-') || xdaiValue.includes('+')}
          >
            FUND
          </ConfirmButton>
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
            </StyledInputGroup>
          </StyledForm>
          <FeedbackTransaction
            confirmations={1}
            isWalletLoading={isWalletLoading}
            transactionHash={transactionHash}
            feedbackTexts={{ loading: 'Please wait while we confirm the transaction...' }}
          />
        </div>
      </StepContainer>
    </Section>
  );
}
