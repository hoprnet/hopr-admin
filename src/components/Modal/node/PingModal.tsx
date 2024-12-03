import { useState, useEffect } from 'react';
import { DialogTitle, TextField, DialogActions, Alert } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../../store';
import { actionsAsync } from '../../../store/slices/node/actionsAsync';
import CloseIcon from '@mui/icons-material/Close';
import { sendNotification } from '../../../hooks/useWatcher/notifications';
import { utils as hoprdUlils } from '@hoprnet/hopr-sdk';
const { sdkApiError } = hoprdUlils;

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
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const pinging = useAppSelector((store) => store.node.pinging);
  const peerIdToAliasLink = useAppSelector((store) => store.node.links.peerIdToAlias);
  const [peerId, set_peerId] = useState<string>(props.peerId ? props.peerId : '');
  const [openModal, set_OpenModal] = useState(false);
  const [disableButton, set_disableButton] = useState(false);

  const getAliasByPeerId = (peerId: string): string => {
    if (aliases && peerId && peerIdToAliasLink[peerId]) return `${peerIdToAliasLink[peerId]} (${peerId})`;
    return peerId;
  };

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
    if (loginData.apiEndpoint) {
      set_disableButton(true);
      dispatch(
        actionsAsync.pingNodeThunk({
          peerId,
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken ? loginData.apiToken : '',
        }),
      )
        .unwrap()
        .then((resp: any) => {
          const msg = `Ping of ${getAliasByPeerId(peerId)} succeeded with latency of ${resp.latency}ms`;
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
        .catch(async (e) => {
          const isCurrentApiEndpointTheSame = await dispatch(
            actionsAsync.isCurrentApiEndpointTheSame(loginData.apiEndpoint!),
          ).unwrap();
          if (!isCurrentApiEndpointTheSame) return;

          let errMsg = `Ping of ${getAliasByPeerId(peerId)} failed`;
          if (e instanceof sdkApiError && e.hoprdErrorPayload?.status)
            errMsg = errMsg + `.\n${e.hoprdErrorPayload.status}`;
          if (e instanceof sdkApiError && e.hoprdErrorPayload?.error)
            errMsg = errMsg + `.\n${e.hoprdErrorPayload.error}`;
          console.warn(errMsg, e);
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
          props.tooltip ? (
            props.tooltip
          ) : (
            <span>
              PING
              <br />
              node
            </span>
          )
        }
        onClick={peerId ? handlePing : handleOpenModal}
        disabled={props.disabled || pinging[peerId]}
        pending={disableButton || pinging[peerId] }
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
            placeholder="12D3Ko...Z3rz5F"
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
