// BAD FILE: TO FIX
import { useEffect, useState } from 'react';
import { useBalance, usePrepareSendTransaction, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { useAppSelector } from '../../store';
import { 
  xHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
  wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS 
} from '../../../config';
import styled from '@emotion/styled';

import {
  CircularProgress,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Button as MuiButton,
  TextField
} from '@mui/material'
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import Button from '../../future-hopr-lib-components/Button';

import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';

const Content = styled(SDialogContent)`
  gap: 1rem;

  & button {
    align-self: center;
    padding-inline: 2rem;
  }
`;

const TextFieldWithoutArrows = styled(TextField)`
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

type WithdraweModalProps = {
  initialCurrency?: 'wxHOPR' | 'xHOPR' | 'xDAI';
};

const WithdrawModal = ({ initialCurrency }: WithdraweModalProps) => {
  const [openModal, set_openModal] = useState(false);
  const [currency, set_currency] = useState<'wxHOPR' | 'xHOPR' | 'xDAI' | string>(initialCurrency ?? 'wxHOPR');
  const [amount, set_amount] = useState<string>('');
  const [receiver, set_receiver] = useState<string>('');
  const selectedSafeAddress = useAppSelector((selector) => selector.safe.selectedSafeAddress);

  // TODO: Missing safe tx proposal.
  const { config } = usePrepareSendTransaction({
    account: selectedSafeAddress as `0x${string}`,
    to: receiver,
    value: parseEther(amount),
  });

  const {
    data,
    isLoading,
    isSuccess,
    sendTransaction,
  } = useSendTransaction(config);

  // Fetch balance data
  const { data: xDAI_balance } = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    watch: true,
  });

  const { data: xHOPR_balance } = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: xHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  });

  const { data: wxHOPR_balance } = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS,
    watch: true,
  });

  useEffect(() => {
    setMaxAmount();
  }, [currency]);

  useEffect(() => {
    if (isSuccess) {
      setMaxAmount();
    }
  }, [isSuccess]);

  const handleOpenModal = () => {
    set_openModal(true);
  };

  const handleCloseModal = () => {
    set_openModal(false);
  };

  const setMaxAmount = () => {
    if (currency === 'xHOPR' && xHOPR_balance) {
      set_amount(xHOPR_balance.formatted);
    } else if (currency === 'wxHOPR' && wxHOPR_balance) {
      set_amount(wxHOPR_balance.formatted);
    } else if (currency === 'xDAI' && xDAI_balance) {
      set_amount(xDAI_balance.formatted);
    }
  };

  const handleWithdraw = () => {
    if (receiver && amount) {
      sendTransaction?.();
    }
  };

  return (
    <>
      <button onClick={handleOpenModal}>Withdraw</button>
      <SDialog
        open={openModal}
        onClose={handleCloseModal}
      >
        <TopBar>
          <DialogTitle>Withdraw tokens</DialogTitle>
          <SIconButton
            aria-label="close modal"
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </SIconButton>
        </TopBar>
        <Content>
          {selectedSafeAddress ? (
            <>
              <TextField
                label="Currency"
                placeholder="Currency"
                value={currency}
                onChange={(e) => set_currency(e.target.value)}
                select
              >
                <MenuItem value={'xHOPR'}>xHOPR</MenuItem>
                <MenuItem value={'xDAI'}>xDAI</MenuItem>
              </TextField>
              <TextFieldWithoutArrows
                type="number"
                label="Amount"
                placeholder="Amount"
                value={amount}
                onChange={(e) => set_amount(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <MaxButton
                        // disabled={!write_xHOPR_to_wxHOPR}
                        onClick={setMaxAmount}
                      >
                        Max
                      </MaxButton>
                    </InputAdornment>
                  ),
                  inputProps: { min: 0 },
                }}
              />
              <TextField
                type="text"
                label="Receiver"
                placeholder="0x4f5a...1728"
                value={receiver}
                onChange={(e) => set_receiver(e.target.value)}
              />
              <Button onClick={handleWithdraw}>Withdraw</Button>
              {isLoading && <CircularProgress />}
              {isSuccess && (
                <p>
                  Check your transaction{' '}
                  <GnosisLink
                    href={`https://gnosisscan.io/tx/${data?.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    here
                    <LaunchIcon />
                  </GnosisLink>
                </p>
              )}
            </>
          ) : (
            <p>Connect your SAFE</p>
          )}
        </Content>
      </SDialog>
    </>
  );
};

export default WithdrawModal;
