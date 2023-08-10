import { useState, useEffect } from 'react';
import { DialogTitle, TextField, DialogActions, Alert } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import CloseIcon from '@mui/icons-material/Close';

// HOPR Components
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import RssFeedIcon from '@mui/icons-material/RssFeed';

type PingModalProps = {
  peerId?: string;
};

export const PingModal = (props: PingModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [error, set_error] = useState<{
    status: string | undefined;
    error: string | undefined;
  }>();
  const [success, set_success] = useState(false);
  const [peerId, set_peerId] = useState<string>(props.peerId ? props.peerId : '');
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_peerId(event.target.value);
  };

  const setPropPeerId = () => {
    if (peerId)
    set_peerId(peerId);
  };
  useEffect(setPropPeerId, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    set_peerId('');
    setPropPeerId();
  };

  const handlePing = () => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.pingNodeThunk({
          peerId,
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        }),
      )
        .unwrap()
        .then(() => {
          set_success(true);
          set_error(undefined);
        })
        .catch((e) => {
          console.log(e.error);
          set_success(false);
          set_error({
            error: e.error,
            status: e.status,
          });
        })
        .finally(() => {
          handleCloseModal();
        });
    }
  };

  return (
    <>
      <IconButton
        iconComponent={<RssFeedIcon />}
        tooltipText="Ping node"
        onClick={handleOpenModal}
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
          <button
            disabled={peerId.length === 0}
            onClick={handlePing}
          >
            Ping
          </button>
        </DialogActions>
      </SDialog>
    </>
  );
};
