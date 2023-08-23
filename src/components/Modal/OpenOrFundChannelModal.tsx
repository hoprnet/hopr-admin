import { DialogActions, DialogTitle, InputAdornment, TextField } from '@mui/material';
import { ethers } from 'ethers';
import { useState } from 'react';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { sendNotification } from '../../hooks/useWatcher/notifications';
import { HOPR_TOKEN_USED } from '../../../config';

// HOPR Components
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import AddChannelIcon from '../../future-hopr-lib-components/Icons/AddChannel';
import FundChannelIcon from '../../future-hopr-lib-components/Icons/FundChannel';
import Button from '../../future-hopr-lib-components/Button';

// Mui
import CloseIcon from '@mui/icons-material/Close';
import HubIcon from '@mui/icons-material/Hub';

type OpenOrFundChannelModalProps = {
  peerId?: string;
  channelId?: string;
  modalBtnText?: string;
  actionBtnText?: string;
  title?: string;
  type?: 'open' | 'fund';
};

export const OpenOrFundChannelModal = ({
  channelId,
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
  const [peerId, set_peerId] = useState(props.peerId ? props.peerId : '');

  const handleOpenChannelDialog = () => {
    set_openChannelModal(true);
  };

  const handleCloseModal = () => {
    set_openChannelModal(false);
    set_amount('');
    set_peerId(props.peerId ? props.peerId : '');
  };

  const handleAction = async () => {
    const handleOpenChannel = async (weiValue: string, peerId: string) => {
      await dispatch(
        actionsAsync.openChannelThunk({
          apiEndpoint: loginData.apiEndpoint!,
          apiToken: loginData.apiToken!,
          amount: weiValue,
          peerId: peerId,
          timeout: 60e3,
        }),
      )
        .unwrap()
        .then(() => {
          const msg = `Channel to ${peerId} is ${type === 'open' ? 'opened' : 'funded'}`;
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
          let errMsg = `Channel to ${peerId} failed to be ${type === 'open' ? 'opened' : 'funded'}`;
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

    const handleFundChannels = async (weiValue: string, peerId: string, channelId: string) => {
      await dispatch(
        actionsAsync.fundChannelsThunk({
          apiEndpoint: loginData.apiEndpoint!,
          apiToken: loginData.apiToken!,
          peerId: peerId,
          incomingAmount: '0',
          outgoingAmount: weiValue,
          timeout: 60e3,
        }),
      )
        .unwrap()
        .catch((e) => {
          console.log(e.error);
        });
    };

    handleCloseModal();
    const parsedOutgoing = parseFloat(amount ?? '0') >= 0 ? amount ?? '0' : '0';
    const weiValue = ethers.utils.parseEther(parsedOutgoing).toString();
    if (channelId) {
      await handleFundChannels(weiValue, peerId, channelId);
    } else {
      await handleOpenChannel(weiValue, peerId);
    }
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
        tooltipText={modalBtnText ? modalBtnText : 'Open outgoing channel'}
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
            label="Peer ID"
            value={peerId}
            placeholder="16Uiu2HA..."
            onChange={(e) => set_peerId(e.target.value)}
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
            disabled={!amount || parseFloat(amount) <= 0 || !peerId}
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
