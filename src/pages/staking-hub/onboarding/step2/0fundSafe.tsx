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
  ButtonContainer,
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
import { StepContainer } from '../components';
import Button from '../../../../future-hopr-lib-components/Button';
import styled from '@emotion/styled';


const GreenText = styled.p`
  color: green;
  display: inline;
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
    if (Number(safeBalance.xDai.formatted) >= MINIMUM_XDAI_TO_FUND) {
      return true;
    }
    return false;
  };

  const wxhoprEnoughBalance = (): boolean => {
    if (Number(safeBalance.wxHopr.formatted) >= MINIMUM_WXHOPR_TO_FUND) {
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
      description="You're about to create a new Safe and move funds to it. There will be an deployment fee in xDAi charged to your wallet. Please confirm it."
      descriptionLeft
    >
      <StyledForm>
        <StyledInstructions>
          <Text>
            Move <Lowercase>x</Lowercase>DAI to safe
          </Text>
          <StyledDescription>
            Add-in the amount of <Lowercase>x</Lowercase>DAI you like to deposit to your safe. In a later step these
            will then be moved to your node. {xdaiEnoughBalance() && <GreenText>enough balance</GreenText>}
          </StyledDescription>
        </StyledInstructions>
        <StyledInputGroup>
          <StyledTextField
            type="number"
            variant="outlined"
            placeholder="-"
            size="small"
            value={xdaiValue}
            onChange={(e) => set_xdaiValue(e.target.value)}
            InputProps={{ inputProps: {
              style: { textAlign: 'right' },
              min: 0,
              pattern: '[0-9]*',
            } }}
          />
          <StyledCoinLabel>
            <Lowercase>x</Lowercase>DAI
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
          <StyledDescription>
            Add-in the amount of <Lowercase>wx</Lowercase>HOPR you like to deposit to your safe. We suggest to move all
            your <Lowercase>wx</Lowercase>HOPR to the safe.{' '}
            {wxhoprEnoughBalance() && <GreenText>enough balance</GreenText>}
          </StyledDescription>
        </StyledInstructions>
        <StyledInputGroup>
          <StyledTextField
            type="number"
            variant="outlined"
            placeholder="-"
            size="small"
            value={wxhoprValue}
            onChange={(e) => set_wxhoprValue(e.target.value)}
            InputProps={{ inputProps: {
              style: { textAlign: 'right' },
              min: 0,
              pattern: '[0-9]*',
            } }}
          />
          <StyledCoinLabel>
            <Lowercase>wx</Lowercase>HOPR
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
      <ButtonContainer>
        <StyledGrayButton
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(3));
          }}
        >
          Back
        </StyledGrayButton>
        <Button
          onClick={() => {
            dispatch(stakingHubActions.setOnboardingStep(5));
          }}
          disabled={!xdaiEnoughBalance() || !wxhoprEnoughBalance()}
        >
          Continue
        </Button>
      </ButtonContainer>
      {(is_xDAI_to_safe_loading || is_wxHOPR_to_safe_loading) && <span>Check your Wallet...</span>}
    </StepContainer>
  );
};

export default FundsToSafe;
