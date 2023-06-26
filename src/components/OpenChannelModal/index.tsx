import { useEffect, useState } from 'react';
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
import CloseIcon from '@mui/icons-material/Close';

type OpenChannelModalProps = {
  handleRefresh: () => void;
  peerId?: string;
};

export const OpenChannelModal = ({
  handleRefresh, peerId, 
}: OpenChannelModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [openChannelModal, set_openChannelModal] = useState(false);
  const [amount, set_amount] = useState('');
  const [localPeerId, set_localPeerId] = useState('');

  useEffect(() => {
    if (peerId) {
      set_localPeerId(peerId);
    }
  }, [peerId]);

  const handleOpenChannelDialog = () => {
    set_openChannelModal(true);
    console.log(localPeerId);
  };

  const handleCloseChannelDialog = () => {
    set_openChannelModal(false);
    set_amount('');
    if (peerId && localPeerId !== peerId) set_localPeerId(peerId);
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
        <DialogTitle>
          Open Channel{' '}
          <CloseIcon
            onClick={handleCloseChannelDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          />
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Peer ID"
            value={localPeerId}
            placeholder="16Uiu2HA..."
            onChange={(e) => set_localPeerId(e.target.value)}
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
            onClick={() => handleOpenChannel(ethers.utils.parseEther(amount).toString(), localPeerId)}
            disabled={!amount || parseFloat(amount) <= 0 || !localPeerId}
          >
            Open Channel
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};
