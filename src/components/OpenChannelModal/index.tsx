import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputAdornment
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { ethers } from 'ethers';

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
    set_amount('');
    set_peerId('');
  };

  const handleOpenChannel = (amount: string, peerId: string) => {
    // Close Modal after starting to open channel
    handleCloseChannelDialog();

    dispatch(
      actionsAsync.openChannelThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
        amount: amount,
        peerId: peerId,
        timeout: 60e3,
      }),
    )
      .unwrap()
      .then(() => {
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
            InputProps={{ endAdornment: <InputAdornment position="end">mHOPR</InputAdornment> }}
            sx={{ mt: '6px' }}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={handleCloseChannelDialog}>Cancel</button>
          <button
            onClick={() => handleOpenChannel(ethers.utils.parseEther(amount).toString(), peerId)}
            disabled={!amount || parseFloat(amount) <= 0 || !peerId}
          >
            Open Channel
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};
