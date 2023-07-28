import { useEffect, useState } from 'react';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import {
  Button as MuiButton,
  DialogTitle,
  InputAdornment,
  MenuItem,
  TextField
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close';
import { useBalance } from 'wagmi';
import { useAppSelector } from '../../store';
import styled from '@emotion/styled';
import Button from '../../future-hopr-lib-components/Button';

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

const xhoprSmartContractAddress = '0xD057604A14982FE8D88c5fC25Aac3267eA142a08';

type WithdraweModalProps = {
  initialCurrency?: 'xHOPR' | 'xDAI';
};

const WithdrawModal = ({ initialCurrency }: WithdraweModalProps) => {
  const [openModal, set_openModal] = useState(false);
  const [currency, set_currency] = useState<'xHOPR' | 'xDAI' | string>(initialCurrency ?? 'xHOPR');
  const [amount, set_amount] = useState<string>('');
  const [receiver, set_receiver] = useState<string>('');
  const selectedSafeAddress = useAppSelector((selector) => selector.safe.selectedSafeAddress);

  // Fetch balance data
  const { data: xDAI_balance } = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    watch: true,
  });

  const { data: xHOPR_balance } = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: xhoprSmartContractAddress,
    watch: true,
  });

  useEffect(() => {
    setMaxAmount();
  }, [currency]);

  const handleOpenModal = () => {
    set_openModal(true);
  };

  const handleCloseModal = () => {
    set_openModal(false);
  };

  const setMaxAmount = () => {
    if (currency === 'xHOPR' && xHOPR_balance) {
      set_amount(xHOPR_balance.formatted);
    } else if (currency === 'xDAI' && xDAI_balance) {
      set_amount(xDAI_balance.formatted);
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
              <Button>Withdraw</Button>
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
