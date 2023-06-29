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

import SwapVertIcon from '@mui/icons-material/SwapVert';
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
  }
`;

const StyledIconButton = styled(IconButton)`
  align-self: center;
  position: absolute;
  background: linear-gradient(rgba(0, 0, 178, 1), rgba(0, 0, 80, 1));
  top: 48px;
  z-index: 2;

  & svg {
    color: #fff;
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
};

function TransactionLink({
  isSuccess,
  hash,
}: TransactionLinkProps) {
  if (!isSuccess) return null;

  return (
    <span>
      Check your{' '}
      <GnosisLink href={`https://gnosisscan.io/tx/${hash}`}>
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

  // Fetch balance data
  const { data: xHOPR_balance } = useBalance({
    address,
    token: '0xD057604A14982FE8D88c5fC25Aac3267eA142a08',
  });
  const { data: wxHOPR_balance } = useBalance({
    address,
    token: '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1',
  });

  // Prepare contract write configurations
  const { config: xHOPR_to_wxHOPR_config } = usePrepareContractWrite({
    address: '0xD057604A14982FE8D88c5fC25Aac3267eA142a08',
    abi: wrapperAbi,
    functionName: 'transferAndCall',
    args: ['0x097707143e01318734535676cfe2e5cF8b656ae8', parseUnits(xhoprValue as NumberLiteral, 18), '0x'],
  });

  const { config: wxHOPR_to_xHOPR_config } = usePrepareContractWrite({
    address: '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1',
    abi: wrapperAbi,
    functionName: 'transfer',
    args: ['0x097707143e01318734535676cfe2e5cF8b656ae8', parseUnits(wxhoprValue as NumberLiteral, 18)],
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

  useEffect(() => {
    if (is_xHOPR_to_wxHOPR_success || is_wxHOPR_to_xHOPR_success) {
      set_xhoprValue('');
      set_wxhoprValue('');
    }
  }, [is_xHOPR_to_wxHOPR_success, is_wxHOPR_to_xHOPR_success]);

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
      lightBlue
      center
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
            disabled={swapDirection === 'wxHOPR_to_xHOPR'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MaxButton
                    disabled={!write_xHOPR_to_wxHOPR || swapDirection === 'wxHOPR_to_xHOPR'}
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
          >
            <SwapVertIcon />
          </StyledIconButton>
          <StyledTextField
            label="wxHOPR"
            placeholder="Your wxHOPR here..."
            type="number"
            value={wxhoprValue}
            onChange={(e) => set_wxhoprValue(e.target.value)}
            disabled={swapDirection === 'xHOPR_to_wxHOPR'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <MaxButton
                    disabled={!write_wxHOPR_to_xHOPR || swapDirection === 'xHOPR_to_wxHOPR'}
                    onClick={setMax_wxHOPR}
                  >
                    Max
                  </MaxButton>
                </InputAdornment>
              ),
              inputProps: { min: 0 },
            }}
          />
          <Button
            hopr
            className="swap-button"
            disabled={!write_xHOPR_to_wxHOPR || !write_wxHOPR_to_xHOPR}
            onClick={handleClick}
          >
            Swap
          </Button>
          {(is_xHOPR_to_wxHOPR_loading || is_wxHOPR_to_xHOPR_loading) && <span>Check your Wallet...</span>}
          <TransactionLink
            isSuccess={is_xHOPR_to_wxHOPR_success}
            hash={xHOPR_to_wxHOPR_data?.hash}
          />
          <TransactionLink
            isSuccess={is_wxHOPR_to_xHOPR_success}
            hash={wxHOPR_to_xHOPR_data?.hash}
          />
        </WrapperContainer>
      </StyledPaper>
    </Section>
  );
}

export default WrapperPage;
