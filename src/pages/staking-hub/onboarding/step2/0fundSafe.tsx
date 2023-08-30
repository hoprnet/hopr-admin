import { useEffect, useState } from 'react';
import { Address, formatEther, parseEther, parseUnits } from 'viem';
import {
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction
} from 'wagmi';
import { wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS, MINIMUM_XDAI_TO_FUND, MINIMUM_WXHOPR_TO_FUND } from '../../../../../config'

//Store
import { useAppSelector, useAppDispatch } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

// HOPR Components
import {
  Lowercase,
  MaxButton,
  StyledCoinLabel,
  StyledDescription,
  StyledForm,
  StyledGrayButton,
  StyledInputGroup,
  StyledInstructions,
  StyledTextField,
  Text
} from '../safeOnboarding/styled';
import { StepContainer, ConfirmButton } from '../components';
import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';

const GreenText = styled.span`
  color: #004e00;
  display: inline;
  font-weight: 700; 
  font-size: 12px;
  font-style: normal;
  line-height: 1.5;
  margin-top: 16px;
  margin-bottom: 10px;
  min-height: 19px;
`;

const FundsToSafe = () => {
  const dispatch = useAppDispatch();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const walletBalance = useAppSelector((store) => store.web3.balance);
  const safeBalance = useAppSelector((store) => store.safe.balance.data);

  const [xdaiValue, set_xdaiValue] = useState('');
  const [wxhoprValue, set_wxhoprValue] = useState('');

  const { config: xDAI_to_safe_config } = usePrepareSendTransaction({
    to: selectedSafeAddress ?? undefined,
    value: parseEther(xdaiValue),
  });

  const { config: wxHOPR_to_safe_config } = usePrepareContractWrite({
    address: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [selectedSafeAddress as Address, parseUnits(wxhoprValue, 18)],
  });

  const setMax_xDAI = () => {
    if (walletBalance.xDai.value) {
      set_xdaiValue(formatEther(BigInt(walletBalance.xDai.value) - parseUnits(`${0.002}`, 18)));
    }
  };

  const setMax_wxHOPR = () => {
    if (walletBalance.wxHopr.formatted) {
      set_wxhoprValue(walletBalance.wxHopr.formatted);
    }
  };

  const {
    isSuccess: is_wxHOPR_to_safe_success,
    isLoading: is_wxHOPR_to_safe_loading,
    write: write_wxHOPR_to_safe,
  } = useContractWrite({ ...wxHOPR_to_safe_config });

  useEffect(() => {
    if (is_wxHOPR_to_safe_success) {
      set_wxhoprValue('');
    }
  }, [is_wxHOPR_to_safe_loading]);

  const {
    isSuccess: is_xDAI_to_safe_success,
    isLoading: is_xDAI_to_safe_loading,
    sendTransaction: send_xDAI_to_safe,
  } = useSendTransaction({ ...xDAI_to_safe_config });

  useEffect(() => {
    if (is_xDAI_to_safe_success) {
      set_xdaiValue('');
    }
  }, [is_xDAI_to_safe_loading]);

  const handleFundxDai = () => {
    send_xDAI_to_safe?.();
  };

  const handleFundwxHopr = () => {
    write_wxHOPR_to_safe?.();
  };

  const xdaiEnoughBalance = (): boolean => {
    if (safeBalance.xDai.value && BigInt(safeBalance.xDai.value) >= BigInt(MINIMUM_XDAI_TO_FUND * 1e18)) {
      return true;
    }
    return false;
  };

  const wxhoprEnoughBalance = (): boolean => {
    if (safeBalance.wxHopr.value && BigInt(safeBalance.wxHopr.value) >= BigInt(MINIMUM_XDAI_TO_FUND * 1e18)) {
      return true;
    }
    return false;
  };

  return (
    <StepContainer
      image={{
        src: '/assets/funds-to-safe.svg',
        alt: 'Funds to safe image',
        height: 134,
      }}
      title="Move funds to Safe"
      description="You're about to fund a new safe with xDAI & wxHOPR. These will be used later on to pay transaction fees on Gnosis Chain and fund HOPR payment channels respectively."
      buttons={
        <>
          <StyledGrayButton
            onClick={() => {
              dispatch(stakingHubActions.setOnboardingStep(3));
            }}
          >
            Back
          </StyledGrayButton>
          <ConfirmButton
            onClick={() => {
              dispatch(stakingHubActions.setOnboardingStep(5));
            }}
            disabled={!xdaiEnoughBalance() || !wxhoprEnoughBalance()}
          >
            Continue
          </ConfirmButton>
        </>
      }
    >
      <StyledForm className='underline'>
        <StyledInstructions>
          <Text>
            Move <Lowercase>x</Lowercase>DAI to safe
          </Text>
          <GreenText>
            {xdaiEnoughBalance() && 'You transfered enough xDai'}
          </GreenText>
        </StyledInstructions>
        <StyledInputGroup>
          <StyledTextField
            type="number"
            variant="outlined"
            placeholder="-"
            size="small"
            value={xdaiValue}
            onChange={(e) => set_xdaiValue(e.target.value)}
            InputProps={{
              inputProps: {
                style: { textAlign: 'right' },
                min: 0,
                pattern: '[0-9]*',
              }
            }}
          />
          <StyledCoinLabel>
            xDAI
          </StyledCoinLabel>
          <MaxButton onClick={setMax_xDAI}>Max</MaxButton>
          <Button
            onClick={handleFundxDai}
            disabled={!xdaiValue || xdaiValue === '' || xdaiValue === '0'}
          >
            Fund
          </Button>
        </StyledInputGroup>
      </StyledForm>
      <StyledForm>
        <StyledInstructions>
          <Text>
            Stake <Lowercase>wx</Lowercase>HOPR into safe
          </Text>
          <GreenText>
            {wxhoprEnoughBalance() && 'You transfered enough wxHOPR'}
          </GreenText>
        </StyledInstructions>
        <StyledInputGroup>
          <StyledTextField
            type="number"
            variant="outlined"
            placeholder="-"
            size="small"
            value={wxhoprValue}
            onChange={(e) => set_wxhoprValue(e.target.value)}
            InputProps={{
              inputProps: {
                style: { textAlign: 'right' },
                min: 0,
                pattern: '[0-9]*',
              }
            }}
          />
          <StyledCoinLabel>
           wxHOPR
          </StyledCoinLabel>
          <MaxButton onClick={setMax_wxHOPR}>Max</MaxButton>
          <Button
            onClick={handleFundwxHopr}
            disabled={!wxhoprValue || wxhoprValue === '' || wxhoprValue === '0'}
          >
            Fund
          </Button>
        </StyledInputGroup>
      </StyledForm>

      {(is_xDAI_to_safe_loading || is_wxHOPR_to_safe_loading) && <span>Check your Wallet...</span>}
    </StepContainer>
  );
};

export default FundsToSafe;
