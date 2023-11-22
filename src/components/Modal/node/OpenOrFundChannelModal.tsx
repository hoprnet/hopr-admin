import { DialogActions, DialogTitle, InputAdornment, TextField } from '@mui/material';
import { ethers } from 'ethers';
import { useState } from 'react';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../../store';
import { actionsAsync } from '../../../store/slices/node/actionsAsync';
import { sendNotification } from '../../../hooks/useWatcher/notifications';
import { HOPR_TOKEN_USED } from '../../../../config';

// HOPR Components
import IconButton from '../../../future-hopr-lib-components/Button/IconButton';
import AddChannelIcon from '../../../future-hopr-lib-components/Icons/AddChannel';
import FundChannelIcon from '../../../future-hopr-lib-components/Icons/FundChannel';
import Button from '../../../future-hopr-lib-components/Button';

// Mui
import CloseIcon from '@mui/icons-material/Close';
import HubIcon from '@mui/icons-material/Hub';

type OpenOrFundChannelModalProps = {
  peerAddress?: string;
  modalBtnText?: string | JSX.Element;
  actionBtnText?: string;
  title?: string;
  type?: 'open' | 'fund';
  disabled?: boolean;
};

export const OpenOrFundChannelModal = ({
  title,
  modalBtnText,
  actionBtnText,
  type,
  ...props
}: OpenOrFundChannelModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((store) => store.auth.loginData);
  const [openChannelModal, set_openChannelModal] = useState(false);
  const [amount, set_amount] = useState('');
  const [peerAddress, set_peerAddress] = useState(props.peerAddress ? props.peerAddress : '');

  const handleOpenChannelDialog = () => {
    set_openChannelModal(true);
  };

  const handleCloseModal = () => {
    set_openChannelModal(false);
    set_amount('');
    set_peerAddress(props.peerAddress ? props.peerAddress : '');
  };

  const handleAction = async () => {
    const handleOpenChannel = async (weiValue: string, peerAddress: string) => {
      await dispatch(
        actionsAsync.openChannelThunk({
          apiEndpoint: loginData.apiEndpoint!,
          apiToken: loginData.apiToken!,
          amount: weiValue,
          peerAddress: peerAddress,
          timeout: 60e3,
        }),
      )
        .unwrap()
        .then(() => {
          const msg = `Channel to ${peerAddress} is ${type === 'open' ? 'opened' : 'funded'}`;
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: msg,
              url: null,
              timeout: null,
            },
            toastPayload: { message: msg },
            dispatch,
          });
        })
        .catch((e) => {
          let errMsg = `Channel to ${peerAddress} failed to be ${type === 'open' ? 'opened' : 'funded'}`;
          if (e.status) errMsg = errMsg + `\n${e.status}`;
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: errMsg,
              url: null,
              timeout: null,
            },
            toastPayload: { message: errMsg },
            dispatch,
          });
        });
    };

    handleCloseModal();
    const parsedOutgoing = parseFloat(amount ?? '0') >= 0 ? amount ?? '0' : '0';
    const weiValue = ethers.utils.parseEther(parsedOutgoing).toString();
    await handleOpenChannel(weiValue, peerAddress);
    dispatch(
      actionsAsync.getChannelsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      }),
    );
  };

  const icon = () => {
    switch (type) {
    case 'open':
      return <AddChannelIcon />;
    case 'fund':
      return <FundChannelIcon />;
    default:
      return <HubIcon />;
    }
  };

  return (
    <>
      <IconButton
        iconComponent={icon()}
        disabled={type === 'fund' || props.disabled}
        tooltipText={
          type === 'fund' ? (
            <span>
              FUND
              <br />
              function not avalible yet
            </span>
          ) : modalBtnText ? (
            modalBtnText
          ) : (
            <span>
              OPEN
              <br />
              outgoing channel
            </span>
          )
        }
        onClick={handleOpenChannelDialog}
      />
      <SDialog
        open={openChannelModal}
        onClose={handleCloseModal}
        disableScrollLock={true}
      >
        <TopBar>
          <DialogTitle>{title ? title : 'Open Outgoing Channel'}</DialogTitle>
          <SIconButton
            aria-label="close modal"
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </SIconButton>
        </TopBar>
        <SDialogContent>
          <TextField
            label="Node Address"
            value={peerAddress}
            placeholder="0x4f5a...1728"
            onChange={(e) => set_peerAddress(e.target.value)}
            sx={{ mt: '6px' }}
          />
          <TextField
            label="Amount"
            type="string"
            placeholder="Amount"
            value={amount}
            onChange={(e) => set_amount(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">{HOPR_TOKEN_USED}</InputAdornment> }}
            sx={{ mt: '6px' }}
          />
        </SDialogContent>
        <DialogActions>
          <Button
            onClick={handleAction}
            disabled={!amount || parseFloat(amount) <= 0 || !peerAddress}
            style={{
              marginRight: '16px',
              marginBottom: '6px',
              marginTop: '-6px',
            }}
          >
            {actionBtnText ? actionBtnText : 'Open Channel'}
          </Button>
        </DialogActions>
      </SDialog>
    </>
  );
};
