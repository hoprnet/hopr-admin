import { useState, useEffect } from 'react';
import { DialogTitle, TextField, DialogActions, Alert } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { appActions } from '../../store/slices/app';
import CloseIcon from '@mui/icons-material/Close';
import { sendNotification } from '../../hooks/useWatcher/notifications';

// HOPR Components
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import AddAliasIcon from '../../future-hopr-lib-components/Icons/AddAlias';
import Button from '../../future-hopr-lib-components/Button';

type CreateAliasModalProps = {
  handleRefresh: () => void;
  peerId?: string;
};

export const CreateAliasModal = (props: CreateAliasModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((store) => store.auth.loginData);
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const [modal, set_modal] = useState<{ peerId: string; alias: string }>({
    alias: '',
    peerId: props.peerId ? props.peerId : '',
  });
  const [duplicateAlias, set_duplicateAlias] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
    } = event.target;
    duplicateAlias && set_duplicateAlias(false);
    set_modal({
      ...modal,
      [name]: value,
    });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    set_duplicateAlias(false);
    setOpenModal(false);
    set_modal({
      peerId: props.peerId ? props.peerId : '',
      alias: '',
    });
  };

  const handleAddAlias = () => {
    if (aliases && Object.keys(aliases).includes(modal.alias)) {
      set_duplicateAlias(true);
      return;
    }
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.setAliasThunk({
          alias: modal.alias,
          peerId: modal.peerId,
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        }),
      )
        .unwrap()
        .then(() => {
          props.handleRefresh();
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: `Alias ${modal.alias} added to ${modal.peerId}`,
              url: null,
              timeout: null,
            },
            toastPayload: { message: `Alias ${modal.alias} added to ${modal.peerId}` },
            dispatch,
          });
        })
        .catch((e) => {
          console.log(`Alias ${modal.alias} failed to add.`, e.error);
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: `Alias ${modal.alias} failed to add.`,
              url: null,
              timeout: null,
            },
            toastPayload: { message: `Alias ${modal.alias} failed to add.` },
            dispatch,
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
        iconComponent={<AddAliasIcon />}
        tooltipText="Add new alias"
        onClick={handleOpenModal}
      />
      <SDialog
        open={openModal}
        onClose={handleCloseModal}
        disableScrollLock={true}
      >
        <TopBar>
          <DialogTitle>Add Alias</DialogTitle>
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
            value={modal.peerId}
          />
          <TextField
            type="text"
            name="alias"
            label="Alias"
            placeholder="Alias"
            onChange={handleChange}
            value={modal.alias}
            error={duplicateAlias}
            helperText={duplicateAlias ? 'This is a duplicate alias!' : ''}
            style={{ minHeight: '79px' }}
          />
        </SDialogContent>
        <DialogActions>
          <Button
            disabled={modal.alias.length === 0 || modal.peerId.length === 0}
            onClick={handleAddAlias}
            style={{
              marginRight: '16px',
              marginBottom: '6px',
              marginTop: '-6px',
            }}
          >
            Add
          </Button>
        </DialogActions>
      </SDialog>
    </>
  );
};
