import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, InputAdornment } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';

type OpenChannelModalProps = {
  handleRefresh: () => void;
};

export const OpenChannelModal = ({ handleRefresh }: OpenChannelModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [openChannelModal, set_openChannelModal] = useState(false);
  const [peerId, set_peerId] = useState('');
  const [amount, set_amount] = useState('');

  const handleOpenChannelDialog = () => {
    set_openChannelModal(true);
  };

  const handleCloseChannelDialog = () => {
    set_openChannelModal(false);
  };

  const handleOpenChannel = (amount: string, peerId: string) => {
    // Close Modal after starting to open channel
    handleCloseChannelDialog();

    console.log(
      JSON.stringify({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
        amount: amount,
        peerId: peerId,
        timeout: 60e3,
      })
    );
    dispatch(
      actionsAsync.openChannelThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
        amount: amount,
        peerId: peerId,
        timeout: 60e3,
      })
    )
      .unwrap()
      .then(() => {
        set_amount('');
        set_peerId('');
        handleRefresh();
      })
      .catch((e) => {
        console.log(e.error);
      });
  };

  return (
    <>
      <button onClick={handleOpenChannelDialog}>Open Channel</button>
      <Dialog
        open={openChannelModal}
        onClose={handleCloseChannelDialog}
      >
        <DialogTitle>Open Channel</DialogTitle>
        <DialogContent>
          <TextField
            label="Peer ID"
            value={peerId}
            placeholder="16Eiu2HAm..."
            onChange={(e) => set_peerId(e.target.value)}
          />
          <TextField
            label="Amount"
            type="string"
            value={amount}
            onChange={(e) => set_amount(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">mHOPR</InputAdornment> }}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleCloseChannelDialog}>Cancel</button>
          <button
            onClick={() => handleOpenChannel(amount, peerId)}
            disabled={!amount || parseFloat(amount) <= 0 || !peerId}
          >
            Open Channel
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};
