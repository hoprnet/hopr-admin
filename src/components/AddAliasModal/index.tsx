import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';

type CreateAliasModalProps = {
  handleRefresh: () => void;
};

export const CreateAliasModal = ({ handleRefresh }: CreateAliasModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const aliases = useAppSelector((selector) => selector.node.aliases);
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

  const handleCloseAlert = () => {
    set_duplicateAlias(false);
  };

  const handleOpenAlert = () => {
    set_duplicateAlias(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name, value, 
    } = event.target;
    set_modal({
      ...modal,
      [name]: value,
    });
  };

  const [openModal, setOpenModal] = useState(false);

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
    set_modal({
      peerId: '',
      alias: '',
    });
    setOpenModal(false);
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
      <button onClick={handleOpenModal}>Add New Alias</button>
      {duplicateAlias && (
        <Alert
          severity="warning"
          onClose={handleCloseAlert}
        >
          This is a duplicate alias!
        </Alert>
      )}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
      >
        <DialogTitle>Add Alias</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            name="peerId"
            label="Peer ID"
            placeholder="16Uiu2HA..."
            onChange={handleChange}
            value={modal.peerId}
            sx={{ mt: '6px' }}
          />
          <TextField
            type="text"
            name="alias"
            label="Alias"
            placeholder="Alias"
            onChange={handleChange}
            value={modal.alias}
            sx={{ mt: '6px' }}
          />
          <DialogActions>
            <button
              disabled={modal.alias.length === 0 || modal.peerId.length === 0}
              onClick={handleAddAlias}
            >
              Add
            </button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};
