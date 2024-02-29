import { useState, useEffect } from 'react';
import { DialogTitle, TextField, DialogActions, Alert } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../../store';
import { actionsAsync } from '../../../store/slices/node/actionsAsync';
import CloseIcon from '@mui/icons-material/Close';
import { sendNotification } from '../../../hooks/useWatcher/notifications';

// HOPR Components
import IconButton from '../../../future-hopr-lib-components/Button/IconButton';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import Button from '../../../future-hopr-lib-components/Button';

type PingModalProps = {
  peerId?: string;
  disabled?: boolean;
  tooltip?: JSX.Element | string;
};

export const PingModal = (props: PingModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [peerId, set_peerId] = useState<string>(props.peerId ? props.peerId : '');
  const [openModal, set_OpenModal] = useState(false);
  const [disableButton, set_disableButton] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_peerId(event.target.value);
  };

  const setPropPeerId = () => {
    if (props.peerId) set_peerId(props.peerId);
  };
  useEffect(setPropPeerId, [props.peerId]);

  const handleOpenModal = () => {
    set_OpenModal(true);
  };

  const handleCloseModal = () => {
    set_OpenModal(false);
    set_peerId('');
    setPropPeerId();
  };

  const handlePing = () => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      set_disableButton(true);
      dispatch(
        actionsAsync.pingNodeThunk({
          peerId,
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        })
      )
        .unwrap()
        .then((resp: any) => {
          const msg = `Ping of ${peerId} succeded with latency of ${resp.latency}ms`;
          console.log(msg, resp);
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
          const errMsg = `Ping of ${peerId} failed`;
          console.log(errMsg, e.error);
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
        })
        .finally(() => {
          handleCloseModal();
          set_disableButton(false);
        });
    }
  };

  return (
    <>
      <IconButton
        iconComponent={<RssFeedIcon />}
        tooltipText={
          props.tooltip ?
          props.tooltip
          :
          <span>
            PING
            <br />
            node
          </span>
        }
        onClick={handleOpenModal}
        disabled={props.disabled}
      />
      <SDialog
        open={openModal}
        onClose={handleCloseModal}
        disableScrollLock={true}
      >
        <TopBar>
          <DialogTitle>Ping node</DialogTitle>
          <SIconButton
            aria-label="close modal"
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </SIconButton>
        </TopBar>
        <SDialogContent>
          <TextField
            type="text"
            name="peerId"
            label="Peer ID"
            placeholder="16Uiu2HA..."
            onChange={handleChange}
            value={peerId}
          />
        </SDialogContent>
        <DialogActions>
          <Button
            disabled={peerId.length === 0}
            pending={disableButton}
            onClick={handlePing}
            style={{
              marginRight: '16px',
              marginBottom: '6px',
              marginTop: '-6px',
            }}
          >
            Ping
          </Button>
        </DialogActions>
      </SDialog>
    </>
  );
};
