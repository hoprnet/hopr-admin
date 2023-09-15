import { useEffect, useState } from 'react';
import { Address, formatEther, parseEther, parseUnits } from 'viem';
import {
  erc20ABI,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction
} from 'wagmi';
import { wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS, MINIMUM_XDAI_TO_FUND, MINIMUM_WXHOPR_TO_FUND } from '../../../config';

//Store
import { useAppSelector, useAppDispatch } from '../../store';
import { stakingHubActions } from '../../store/slices/stakingHub';

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
} from './onboarding/styled';
import { StepContainer, ConfirmButton } from './onboarding/components';
import styled from '@emotion/styled';
import Section from '../../future-hopr-lib-components/Section';

const StakewxHOPR = () => {
  const dispatch = useAppDispatch();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const walletBalance = useAppSelector((store) => store.web3.balance);
  const [xdaiValue, set_xdaiValue] = useState('');
  const [wxhoprValue, set_wxhoprValue] = useState('');

  const {
    refetch: refetchXDaiSafeBalance,
    data: xDaiSafeBalance,
  } = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    watch: true,
    enabled: !!selectedSafeAddress,
  });

  const {
    refetch: refetchWXHoprSafeBalance,
    data: wxHoprSafeBalance,
  } = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
    enabled: !!selectedSafeAddress,
  });

  useEffect(() => {
    const fetchBalanceInterval = setInterval(() => {
      if (selectedSafeAddress) {
        refetchWXHoprSafeBalance();
        refetchWXHoprSafeBalance();
      }
    }, 15_000);

    return () => {
      clearInterval(fetchBalanceInterval);
    };
  }, []);

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
  } = useContractWrite({
    ...wxHOPR_to_safe_config,
    onSuccess: () => refetchWXHoprSafeBalance(),
  });

  useEffect(() => {
    if (is_wxHOPR_to_safe_success) {
      set_wxhoprValue('');
    }
  }, [is_wxHOPR_to_safe_loading]);

  const {
    isSuccess: is_xDAI_to_safe_success,
    isLoading: is_xDAI_to_safe_loading,
    sendTransaction: send_xDAI_to_safe,
  } = useSendTransaction({
    ...xDAI_to_safe_config,
    onSuccess: () => refetchXDaiSafeBalance(),
  });

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

  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <StepContainer
        image={{
          src: '/assets/funds-to-safe.svg',
          alt: 'Funds to safe image',
          height: 134,
        }}
        title="MOVE wxHOPR TO SAFE"
        description="You're about to fund a safe with wxHOPR."
        buttons={
          <ConfirmButton
            onClick={handleFundwxHopr}
            disabled={!wxhoprValue || wxhoprValue === '' || wxhoprValue === '0'}
            pending={is_wxHOPR_to_safe_loading}
          >
            FUND
          </ConfirmButton>
        }
      >
        <StyledForm>
          <StyledInstructions>
            <Text>
              Move <Lowercase>wx</Lowercase>HOPR into safe
            </Text>
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
            <StyledCoinLabel>wxHOPR</StyledCoinLabel>
            <StyledGrayButton onClick={setMax_wxHOPR}>Max</StyledGrayButton>
          </StyledInputGroup>
        </StyledForm>
        {(is_xDAI_to_safe_loading || is_wxHOPR_to_safe_loading) && <span>Check your Wallet...</span>}
      </StepContainer>
    </Section>
  );
};

export default StakewxHOPR;
