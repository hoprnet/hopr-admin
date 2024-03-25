import { useEffect, useState } from 'react';
import { Address, parseUnits } from 'viem';
import { erc20ABI, useBalance, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS } from '../../../config';

//Store
import { useAppSelector } from '../../store';

// HOPR Components
import { FeedbackTransaction } from '../../components/FeedbackTransaction';
import Section from '../../future-hopr-lib-components/Section';
import { ConfirmButton, StepContainer } from './onboarding/components';
import {
  Lowercase,
  StyledCoinLabel,
  StyledForm,
  StyledGrayButton,
  StyledInputGroup,
  StyledInstructions,
  StyledTextField,
  Text
} from './onboarding/styled';

const StakewxHOPR = () => {
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress);
  const walletBalance = useAppSelector((store) => store.web3.balance);
  const [wxhoprValue, set_wxhoprValue] = useState('');
  const [transactionHash, set_transactionHash] = useState<Address>();

  const { refetch: refetchWXHoprSafeBalance } = useBalance({
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

  const { config: wxHOPR_to_safe_config } = usePrepareContractWrite({
    address: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    abi: erc20ABI,
    functionName: 'transfer',
    args: [selectedSafeAddress as Address, parseUnits(wxhoprValue, 18)],
  });

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
    onSuccess: (res) => {
      set_transactionHash(res.hash);
      refetchWXHoprSafeBalance();
    },
  });

  useEffect(() => {
    if (is_wxHOPR_to_safe_success) {
      set_wxhoprValue('');
    }
  }, [is_wxHOPR_to_safe_loading]);

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
        <FeedbackTransaction
          confirmations={1}
          isWalletLoading={is_wxHOPR_to_safe_loading}
          transactionHash={transactionHash}
          feedbackTexts={{ loading: 'Please wait while we confirm the transaction...' }}
        />
      </StepContainer>
    </Section>
  );
};

export default StakewxHOPR;
