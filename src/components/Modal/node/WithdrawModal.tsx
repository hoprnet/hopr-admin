import styled from '@emotion/styled';
import { HOPR_TOKEN_USED } from '../../../../config';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import {
  CircularProgress,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Button as MuiButton,
  TextField
} from '@mui/material'
import Button from '../../../future-hopr-lib-components/Button';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import IconButton from '../../../future-hopr-lib-components/Button/IconButton';

import CloseIcon from '@mui/icons-material/Close';
import WithdrawIcon from '../../../future-hopr-lib-components/Icons/Withdraw';
import LaunchIcon from '@mui/icons-material/Launch';
import { nodeActionsAsync } from '../../../store/slices/node';
import { parseEther } from 'viem';

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

type WithdrawModalProps = {
  initialCurrency?: 'HOPR' | 'NATIVE';
};

const WithdrawModal = ({ initialCurrency }: WithdrawModalProps) => {
  // hooks
  const dispatch = useAppDispatch();
  const hoprBalance = useAppSelector((state) => state.node.balances.data.hopr);
  const nativeBalance = useAppSelector((state) => state.node.balances.data.native);
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((state) => state.auth.loginData);
  // local states
  const [openModal, set_openModal] = useState(false);
  const [currency, set_currency] = useState<'HOPR' | 'NATIVE'>(initialCurrency ?? 'NATIVE');
  const [amount, set_amount] = useState<string>('');
  const [recipient, set_recipient] = useState<string>('');
  const [isLoading, set_isLoading] = useState(false);
  const [transactionHash, set_transactionHash] = useState('');

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
    if (currency === 'HOPR' && hoprBalance.formatted) {
      set_amount(hoprBalance.formatted);
    } else if (currency === 'NATIVE' && nativeBalance.formatted) {
      set_amount(nativeBalance.formatted);
    }
  };

  const handleWithdraw = async () => {
    if (recipient && amount && apiEndpoint && apiToken) {
      set_isLoading(true);
      await dispatch(
        nodeActionsAsync.withdrawThunk({
          amount: parseEther(amount).toString(),
          currency,
          ethereumAddress: recipient,
          apiEndpoint,
          apiToken,
        }),
      )
        .unwrap()
        .then((hash) => {
          set_transactionHash(hash ?? '');
        })
        .finally(() => {
          set_isLoading(false);
        });
    }
  };

  return (
    <>
      <IconButton
        iconComponent={<WithdrawIcon />}
        tooltipText="Withdraw tokens"
        onClick={handleOpenModal}
      />
      <SDialog
        open={openModal}
        onClose={handleCloseModal}
        disableScrollLock={true}
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
          <>
            <TextField
              label="Currency"
              placeholder="Currency"
              value={currency}
              onChange={(e) => {
                const { value } = e.target;
                if (value !== 'HOPR' && value !== 'NATIVE') return;
                set_currency(value);
              }}
              select
            >
              <MenuItem value={'HOPR'}>{HOPR_TOKEN_USED}</MenuItem>
              <MenuItem value={'NATIVE'}>xDai</MenuItem>
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
                    <MaxButton onClick={setMaxAmount}>Max</MaxButton>
                  </InputAdornment>
                ),
                inputProps: { min: 0 },
              }}
            />
            <TextField
              type="text"
              label="recipient"
              placeholder="0x4f5a...1728"
              value={recipient}
              onChange={(e) => set_recipient(e.target.value)}
            />
            <Button onClick={handleWithdraw}>Withdraw</Button>
            {isLoading && <CircularProgress />}
            {transactionHash && (
              <p>
                Check your transaction{' '}
                <GnosisLink
                  href={`https://gnosisscan.io/tx/${transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                  <LaunchIcon />
                </GnosisLink>
              </p>
            )}
          </>
        </Content>
      </SDialog>
    </>
  );
};

export default WithdrawModal;
