import { useState, useEffect } from 'react';
import { DialogTitle, TextField, DialogActions, Alert } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import CloseIcon from '@mui/icons-material/Close';

// HOPR Components
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import AddAliasIcon from '../../future-hopr-lib-components/Icons/AddAlias';

type CreateAliasModalProps = {
  handleRefresh: () => void;
  peerId?: string;
};

export const CreateAliasModal = ({
  handleRefresh,
  peerId,
}: CreateAliasModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const aliases = useAppSelector((selector) => selector.node.aliases.data);
  const [error, set_error] = useState<{
    status: string | undefined;
    error: string | undefined;
  }>();
  const [success, set_success] = useState(false);
  const [modal, set_modal] = useState<{ peerId: string; alias: string }>({
    alias: '',
    peerId: '',
  });
  const [duplicateAlias, set_duplicateAlias] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleCloseAlert = () => {
    set_duplicateAlias(false);
  };

  const handleOpenAlert = () => {
    set_duplicateAlias(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
    } = event.target;
    set_modal({
      ...modal,
      [name]: value,
    });
  };
  const setPropPeerId = () => {
    if (peerId)
      set_modal({
        ...modal,
        peerId: peerId,
      });
  };
  useEffect(setPropPeerId, []);

  useEffect(() => {
    if (duplicateAlias) {
      const timer = setTimeout(() => {
        handleCloseAlert();
      }, 5e3); // 5 seconds

      return () => {
        clearTimeout(timer);
      };
    }
  }, [duplicateAlias]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    set_modal({
      peerId: '',
      alias: '',
    });
    setPropPeerId();
  };

  const handleAddAlias = () => {
    if (aliases && Object.keys(aliases).includes(modal.alias)) {
      handleOpenAlert();
      handleCloseModal();
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
          set_success(true);
          set_error(undefined);
          handleRefresh();
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
        iconComponent={<AddAliasIcon />}
        tooltipText="Add new alias"
        onClick={handleOpenModal}
      />
      {duplicateAlias && (
        <Alert
          severity="warning"
          onClose={handleCloseAlert}
        >
          This is a duplicate alias!
        </Alert>
      )}
      <SDialog
        open={openModal}
        onClose={handleCloseModal}
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
          />
        </SDialogContent>
        <DialogActions>
          <button
            disabled={modal.alias.length === 0 || modal.peerId.length === 0}
            onClick={handleAddAlias}
          >
            Add
          </button>
        </DialogActions>
      </SDialog>
    </>
  );
};
