import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, InputAdornment } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';

type CreateAliasModalProps = {
  handleRefresh: () => void;
};

export const CreateAliasModal = ({ handleRefresh }: CreateAliasModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [error, set_error] = useState<{
    status: string | undefined;
    error: string | undefined;
  }>();
  const [success, set_success] = useState(false);
  const [modal, set_modal] = useState<{ peerId: string; alias: string }>({
    alias: '',
    peerId: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    set_modal({
      ...modal,
      [name]: value,
    });
  };

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddAlias = () => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.setAliasThunk({
          alias: modal.alias,
          peerId: modal.peerId,
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        })
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

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
      >
        <DialogTitle>Add Alias</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            name="peerId"
            placeholder="peerId"
            onChange={handleChange}
            value={modal.peerId}
          />
          <TextField
            type="text"
            name="alias"
            placeholder="alias"
            onChange={handleChange}
            value={modal.alias}
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
