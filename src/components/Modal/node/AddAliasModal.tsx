import { useState, useEffect } from 'react';
import { DialogTitle, TextField, DialogActions, Alert } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../../store';
import { actionsAsync } from '../../../store/slices/node/actionsAsync';
import { appActions } from '../../../store/slices/app';
import CloseIcon from '@mui/icons-material/Close';
import { sendNotification } from '../../../hooks/useWatcher/notifications';

// HOPR Components
import IconButton from '../../../future-hopr-lib-components/Button/IconButton';
import AddAliasIcon from '../../../future-hopr-lib-components/Icons/AddAlias';
import Button from '../../../future-hopr-lib-components/Button';

type CreateAliasModalProps = {
  handleRefresh: () => void;
  peerId?: string;
  disabled?: boolean;
};

export const CreateAliasModal = (props: CreateAliasModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((store) => store.auth.loginData);
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const [alias, set_alias] = useState<string>('');
  const [peerId, set_peerId] = useState<string>(props.peerId ? props.peerId : '');
  const [duplicateAlias, set_duplicateAlias] = useState(false);
  const [openModal, setOpenModal] = useState(false);


  const setPropPeerId = () => {
    if (props.peerId) set_peerId(props.peerId);
  };
  useEffect(setPropPeerId, [props.peerId]);

  const handleChangePeerId = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_peerId(event.target.value);
  };

  const handleChangeAlias = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (aliases && Object.keys(aliases).includes(event.target.value)) {
      set_duplicateAlias(true);
    } else {
      set_duplicateAlias(false);
    }
    set_alias(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    set_duplicateAlias(false);
    setOpenModal(false);
    set_peerId(props.peerId ? props.peerId : '');
    set_alias('');
  };

  const handleAddAlias = () => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.setAliasThunk({
          alias: alias,
          peerId: peerId,
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        })
      )
        .unwrap()
        .then(() => {
          props.handleRefresh();
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: `Alias ${alias} added to ${peerId}`,
              url: null,
              timeout: null,
            },
            toastPayload: { message: `Alias ${alias} added to ${peerId}` },
            dispatch,
          });
        })
        .catch((e) => {
          console.log(`Alias ${alias} failed to add.`, e.error);
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: `Alias ${alias} failed to add.`,
              url: null,
              timeout: null,
            },
            toastPayload: { message: `Alias ${alias} failed to add.`, type: 'error' },
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
        tooltipText={
          <span>
            ADD
            <br />
            new alias
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
            onChange={handleChangePeerId}
            value={peerId}
          />
          <TextField
            type="text"
            name="alias"
            label="Alias"
            placeholder="Alias"
            onChange={handleChangeAlias}
            value={alias}
            error={duplicateAlias}
            helperText={duplicateAlias ? 'This is a duplicate alias!' : ''}
            style={{ minHeight: '79px' }}
          />
        </SDialogContent>
        <DialogActions>
          <Button
           // disabled={alias.length === 0 || peerId.length === 0 || duplicateAlias}
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
