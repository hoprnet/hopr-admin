import { useEffect, useState } from 'react';
import { useBalance, useContractWrite, usePrepareContractWrite, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import wrapperAbi from '../abi/wrapperAbi.json';

import styled from '@emotion/styled';
import {
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  Button as MuiButton
} from '@mui/material'
import Button from '../future-hopr-lib-components/Button';
import Section from '../future-hopr-lib-components/Section';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LaunchIcon from '@mui/icons-material/Launch';

const StyledPaper = styled(Paper)`
  padding: 2rem;
  text-align: center;
`;

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;

  & .swap-button {
    align-self: center;
    text-transform: uppercase;
  }
`;

const StyledTextField = styled(TextField)`
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  &:disabled {
    pointer-events: none;
  }
`;

const StyledIconButton = styled(IconButton)<{ swapDirection: 'xHOPR_to_wxHOPR' | 'wxHOPR_to_xHOPR' }>`
  align-self: center;
  position: absolute;
  background: linear-gradient(rgba(0, 0, 178, 1), rgba(0, 0, 80, 1));
  top: 48px;
  z-index: 2;

  & svg {
    color: #fff;
    transition: transform 0.4s ease;
    transform: ${(props) => (props.swapDirection === 'xHOPR_to_wxHOPR' ? 'rotate(0)' : 'rotate(180deg)')};
  }

  &:disabled {
    background: #e0e0e0;
    & svg {
      color: #a6a6a6;
    }
  }
`;

const MaxButton = styled(MuiButton)`
  background-color: #ffffa0;
  border-radius: 2px;
  border: none;
  color: #444;
  font-weight: 600;
  padding: 0.2rem 1rem;

  &:disabled {
    background-color: #e0e0e0;
    color: #a6a6a6;
  }
`;

const GnosisLink = styled.a`
  display: inline-flex;
  gap: 2px;
  text-decoration: underline;

  & svg {
    align-self: flex-end;
    height: 16px;
    width: 16px;
  }
`;

type NumberLiteral = `${number}`;

type TransactionLinkProps = {
  isSuccess: boolean;
  hash: `0x${string}` | undefined;
  swapDirection: 'xHOPR_to_wxHOPR' | 'wxHOPR_to_xHOPR';
};

function TransactionLink({
  isSuccess,
  hash,
  swapDirection,
}: TransactionLinkProps) {
  if (!isSuccess) return null;

  return (
    <span>
      Check your {swapDirection === 'xHOPR_to_wxHOPR' ? 'xHOPR to wxHOPR ' : 'wxHOPR to xHOPR '}
      <GnosisLink
        href={`https://gnosisscan.io/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        transaction
        <LaunchIcon />
      </GnosisLink>
    </span>
  );
}

function WrapperPage() {
  const [xhoprValue, set_xhoprValue] = useState('');
  const [wxhoprValue, set_wxhoprValue] = useState('');
  const [swapDirection, set_swapDirection] = useState<'xHOPR_to_wxHOPR' | 'wxHOPR_to_xHOPR'>('xHOPR_to_wxHOPR');
  const { address } = useAccount();

  const xhoprSmartContractAddress = '0xD057604A14982FE8D88c5fC25Aac3267eA142a08';
  const wxhoprSmartContractAddress = '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1';
  const hoprWrapperSmartContractAddress = '0x097707143e01318734535676cfe2e5cF8b656ae8';

  // Fetch balance data
  const { data: xHOPR_balance } = useBalance({
    address,
    token: xhoprSmartContractAddress,
    watch: true,
  });
  const { data: wxHOPR_balance } = useBalance({
    address,
    token: wxhoprSmartContractAddress,
    watch: true,
  });

  // Prepare contract write configurations
  const { config: xHOPR_to_wxHOPR_config } = usePrepareContractWrite({
    address: xhoprSmartContractAddress,
    abi: wrapperAbi,
    functionName: 'transferAndCall',
    args: [hoprWrapperSmartContractAddress, parseUnits(xhoprValue as NumberLiteral, 18), '0x'],
  });

  const { config: wxHOPR_to_xHOPR_config } = usePrepareContractWrite({
    address: wxhoprSmartContractAddress,
    abi: wrapperAbi,
    functionName: 'transfer',
    args: [hoprWrapperSmartContractAddress, parseUnits(wxhoprValue as NumberLiteral, 18)],
  });

  // Perform contract writes and retrieve data.
  const {
    data: xHOPR_to_wxHOPR_data,
    isLoading: is_xHOPR_to_wxHOPR_loading,
    isSuccess: is_xHOPR_to_wxHOPR_success,
    write: write_xHOPR_to_wxHOPR,
  } = useContractWrite(xHOPR_to_wxHOPR_config);

  const {
    data: wxHOPR_to_xHOPR_data,
    isLoading: is_wxHOPR_to_xHOPR_loading,
    isSuccess: is_wxHOPR_to_xHOPR_success,
    write: write_wxHOPR_to_xHOPR,
  } = useContractWrite(wxHOPR_to_xHOPR_config);

  const handleSwap = () => {
    if (swapDirection === 'xHOPR_to_wxHOPR') {
      set_swapDirection('wxHOPR_to_xHOPR');
    } else {
      set_swapDirection('xHOPR_to_wxHOPR');
    }
  };

  const handleClick = () => {
    if (swapDirection === 'xHOPR_to_wxHOPR') {
      write_xHOPR_to_wxHOPR?.();
    } else {
      write_wxHOPR_to_xHOPR?.();
    }
  };

  const updateBalances = () => {
    if (address && xHOPR_balance && wxHOPR_balance) {
      set_xhoprValue(xHOPR_balance.formatted);
      set_wxhoprValue(wxHOPR_balance.formatted);
    }
  };

  useEffect(() => {
    if (is_xHOPR_to_wxHOPR_success || is_wxHOPR_to_xHOPR_success) {
      updateBalances();
    }
  }, [xHOPR_balance, wxHOPR_balance]);

  useEffect(() => {
    if (address) {
      updateBalances();
    } else {
      set_xhoprValue('');
      set_wxhoprValue('');
    }
  }, [address, xHOPR_balance, wxHOPR_balance]);

  // Set the maximum value for xHOPR on input field.
  const setMax_xHOPR = () => {
    if (xHOPR_balance) {
      set_xhoprValue(xHOPR_balance.formatted);
    }
  };

  const setMax_wxHOPR = () => {
    if (wxHOPR_balance) {
      set_wxhoprValue(wxHOPR_balance.formatted);
    }
  };

  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <StyledPaper>
        <h2>Wrapper</h2>
        <p>Utility to wrap (xHOPR &#8594; wxHOPR) and unwrap (wxHOPR &#8594; xHOPR) xHOPR tokens.</p>
        <WrapperContainer>
          <StyledTextField
            label="xHOPR"
            placeholder="Your xHOPR here..."
            type="number"
            value={xhoprValue}
            onChange={(e) => set_xhoprValue(e.target.value)}
            onPointerDown={() => {
              if (address) {
                set_swapDirection('xHOPR_to_wxHOPR');
                setMax_wxHOPR();
              }
            }}
            disabled={!address || swapDirection === 'wxHOPR_to_xHOPR' || !write_xHOPR_to_wxHOPR}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MaxButton
                    disabled={swapDirection === 'wxHOPR_to_xHOPR' || !write_xHOPR_to_wxHOPR}
                    onClick={setMax_xHOPR}
                  >
                    Max
                  </MaxButton>
                </InputAdornment>
              ),
              inputProps: { min: 0 },
            }}
          />
          <StyledIconButton
            onClick={handleSwap}
            disabled={!write_xHOPR_to_wxHOPR || !write_wxHOPR_to_xHOPR}
            swapDirection={swapDirection}
          >
            <ArrowDownwardIcon />
          </StyledIconButton>
          <StyledTextField
            label="wxHOPR"
            placeholder="Your wxHOPR here..."
            type="number"
            value={wxhoprValue}
            onChange={(e) => set_wxhoprValue(e.target.value)}
            onPointerDown={() => {
              if (address) {
                set_swapDirection('wxHOPR_to_xHOPR');
                setMax_xHOPR();
              }
            }}
            disabled={!address || swapDirection === 'xHOPR_to_wxHOPR' || !write_wxHOPR_to_xHOPR}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MaxButton
                    disabled={swapDirection === 'xHOPR_to_wxHOPR' || !write_wxHOPR_to_xHOPR}
                    onClick={setMax_wxHOPR}
                  >
                    Max
                  </MaxButton>
                </InputAdornment>
              ),
              inputProps: {
                min: 0,
                max: wxHOPR_balance,
              },
            }}
          />
          <Button
            className="swap-button"
            disabled={
              (swapDirection === 'xHOPR_to_wxHOPR' && !write_xHOPR_to_wxHOPR) ||
              (swapDirection === 'wxHOPR_to_xHOPR' && !write_wxHOPR_to_xHOPR)
            }
            onClick={handleClick}
          >
            Swap
          </Button>
          {(is_xHOPR_to_wxHOPR_loading || is_wxHOPR_to_xHOPR_loading) && <span>Check your Wallet...</span>}
          {address && (
            <>
              <TransactionLink
                isSuccess={is_xHOPR_to_wxHOPR_success}
                hash={xHOPR_to_wxHOPR_data?.hash}
                swapDirection={'xHOPR_to_wxHOPR'}
              />
              <TransactionLink
                isSuccess={is_wxHOPR_to_xHOPR_success}
                hash={wxHOPR_to_xHOPR_data?.hash}
                swapDirection={'wxHOPR_to_xHOPR'}
              />
            </>
          )}
        </WrapperContainer>
      </StyledPaper>
    </Section>
  );
}

export default WrapperPage;
