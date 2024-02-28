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
import { MINIMUM_WXHOPR_TO_FUND, MINIMUM_WXHOPR_TO_FUND_NFT, MINIMUM_XDAI_TO_FUND, wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS } from '../../../../../config'

//Store
import { useAppDispatch, useAppSelector } from '../../../../store';
import { stakingHubActions } from '../../../../store/slices/stakingHub';

// HOPR Components
import styled from '@emotion/styled';
import { FeedbackTransaction } from '../../../../components/FeedbackTransaction';
import Button from '../../../../future-hopr-lib-components/Button';
import { ConfirmButton, StepContainer } from '../components';
import {
  Lowercase,
  StyledCoinLabel,
  StyledForm,
  StyledGrayButton,
  StyledInputGroup,
  StyledInstructions,
  StyledTextField,
  Text
} from '../styled';

// MUI
import { Tooltip, TooltipProps, tooltipClasses } from '@mui/material';

const GreenText = styled.div`
  color: #004e00;
  font-weight: 700;
  font-size: 18px;
  font-style: normal;
  line-height: 1.5;
  min-height: 30px;
  width: 100%;
  text-align: center;
  &.underline {
    border-bottom: 1px solid #414141;
  }
  &.mb16 {
    margin-bottom: 16px;
  }
`;

const BlueTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#DAF8FF",
    color: '#414141',
    borderRadius: "10px",
    fontSize: "12px",
    boxShadow: "0px 4px 4px #00000040"
  },
}));

const FundsToSafe = () => {
  const dispatch = useAppDispatch();
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress);
  const communityNftIdInSafe = useAppSelector((store) => !!store.safe.communityNftIds.data.length);
  const walletBalance = useAppSelector((store) => store.web3.balance);
  const walletwxHoprBalance = walletBalance.wxHopr.value;
  const walletxDaiBalance = walletBalance.xDai.value;
  const [xdaiValue, set_xdaiValue] = useState('');
  const [wxhoprValue, set_wxhoprValue] = useState('');
  const [wxhoprValueMin, set_wxhoprValueMin] = useState(MINIMUM_WXHOPR_TO_FUND);
  const [transactionHashFundXDai, set_transactionHashFundXDai] = useState<Address>();
  const [transactionHashFundWXHopr, set_transactionHashFundWXHopr] = useState<Address>();

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

  useEffect(() => {
    if (communityNftIdInSafe) {
      set_wxhoprValueMin(MINIMUM_WXHOPR_TO_FUND_NFT);
    }
  }, [communityNftIdInSafe]);

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

  const setMin_xDAI = () => {
    if (walletBalance.xDai.value) {
      if (BigInt(walletBalance.xDai.value) > parseUnits('2', 18)) {
        set_xdaiValue('2');
      } else {
        set_xdaiValue(formatEther(BigInt(walletBalance.xDai.value) - parseUnits(`${0.002}`, 18)));
      }
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
    onSuccess: (result) => {
      set_transactionHashFundWXHopr(result.hash);
      refetchWXHoprSafeBalance();
    },
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
    onSuccess: (result) => {
      set_transactionHashFundXDai(result.hash);
      refetchXDaiSafeBalance();
    },
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

  const xdaiEnoughBalance = (): boolean => {
    if (xDaiSafeBalance?.value && BigInt(xDaiSafeBalance.value) >= BigInt(MINIMUM_XDAI_TO_FUND * 1e18)) {
      return true;
    }
    return false;
  };

  const wxhoprEnoughBalance = (): boolean => {
    if (wxHoprSafeBalance?.value && BigInt(wxHoprSafeBalance.value) >= BigInt(wxhoprValueMin * 1e18)) {
      return true;
    }
    return false;
  };

  const notEnoughxDaiInWallet = !!walletxDaiBalance && !!xdaiValue && BigInt(parseFloat(xdaiValue) * 1e18) > BigInt(walletxDaiBalance);
  const notEnoughwxHoprInWallet = !!walletwxHoprBalance && !!wxhoprValue && BigInt(parseFloat(wxhoprValue) * 1e18) > BigInt(walletwxHoprBalance);

  return (
    <StepContainer
      image={{
        src: '/assets/funds-to-safe.svg',
        alt: 'Funds to safe image',
        height: 134,
      }}
      title="MOVE FUNDS TO SAFE"
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
            CONTINUE
          </ConfirmButton>
        </>
      }
    >
      <StyledForm>
        <StyledInstructions>
          <Text>
            Move <Lowercase>x</Lowercase>DAI to safe {' '}
            <BlueTooltip title="Enter the amount of xDAI you would like to deposit to your Safe. In a later step this will be used to fund your node." >
              <img src='/assets/question-icon.svg' style={{ height: "100%" }} />
            </BlueTooltip>
          </Text>
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
            helperText={`min. ${MINIMUM_XDAI_TO_FUND}`}
          />
          <StyledCoinLabel>xDAI</StyledCoinLabel>
          <StyledGrayButton onClick={setMin_xDAI}>Min</StyledGrayButton>
          {
            notEnoughxDaiInWallet ?
            <Tooltip
              title='You do not have enough xDai in your wallet'
            >
              <span>
                <Button
                  onClick={handleFundxDai}
                  disabled={!xdaiValue || xdaiValue === '' || xdaiValue === '0' || notEnoughxDaiInWallet}
                  pending={is_xDAI_to_safe_loading}
                >
                  Fund
                </Button>
              </span>
            </Tooltip>
            :
            <Button
              onClick={handleFundxDai}
              disabled={!xdaiValue || xdaiValue === '' || xdaiValue === '0'}
              pending={is_xDAI_to_safe_loading}
            >
              Fund
            </Button>
          }
        </StyledInputGroup>
      </StyledForm>
      <GreenText className="underline mb16">{xdaiEnoughBalance() && 'You transferred enough xDai'}</GreenText>
      <StyledForm>
        <StyledInstructions>
          <Text>
            Move <Lowercase>wx</Lowercase>HOPR into safe {' '}
            <BlueTooltip title="Enter the amount of wxHOPR you would like to deposit to your Safe. We recommend moving all of your wxHOPR." >
              <img src='/assets/question-icon.svg' style={{ height: "100%" }} />
            </BlueTooltip>
          </Text>
          <GreenText></GreenText>
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
            helperText={`min. ${wxhoprValueMin}`}
          />
          <StyledCoinLabel>wxHOPR</StyledCoinLabel>
          <StyledGrayButton onClick={setMax_wxHOPR}>Max</StyledGrayButton>

          {
            notEnoughwxHoprInWallet ?
            <Tooltip
              title='You do not have enough xDai in your wallet'
            >
              <span>
                <Button
                  onClick={handleFundwxHopr}
                  disabled={!wxhoprValue || wxhoprValue === '' || wxhoprValue === '0' || notEnoughwxHoprInWallet}
                  pending={is_wxHOPR_to_safe_loading}
                >
                  Fund
                </Button>
              </span>
            </Tooltip>
            :
            <Button
              onClick={handleFundwxHopr}
              disabled={!wxhoprValue || wxhoprValue === '' || wxhoprValue === '0'}
              pending={is_wxHOPR_to_safe_loading}
            >
              Fund
            </Button>
          }
        </StyledInputGroup>
      </StyledForm>
      <GreenText>{wxhoprEnoughBalance() && 'You transferred enough wxHOPR'}</GreenText>
      <FeedbackTransaction
        isWalletLoading={is_xDAI_to_safe_loading || is_wxHOPR_to_safe_loading}
        transactionHash={transactionHashFundXDai || transactionHashFundWXHopr}
        confirmations={1}
        feedbackTexts={{ loading: 'Please wait while we confirm the transaction...' }}
      />
    </StepContainer>
  );
};

export default FundsToSafe;
