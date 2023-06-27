import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import {
  DialogTitle,
  TextField,
  DialogActions,
  InputAdornment
} from '@mui/material'
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { ethers } from 'ethers';
import CloseIcon from '@mui/icons-material/Close';

type OpenChannelModalProps = {
  handleRefresh: () => void;
  peerId?: string;
  channelId?: string;
  modalBtnText?: string;
  actionBtnText?: string;
  title?: string;
};

export const OpenChannelModal = ({
  handleRefresh, channelId, title, modalBtnText, actionBtnText, ...props
}: OpenChannelModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [openChannelModal, set_openChannelModal] = useState(false);
  const [amount, set_amount] = useState('');
  const [peerId, set_peerId] = useState(props.peerId ? props.peerId : '');

  const handleOpenChannelDialog = () => {
    set_openChannelModal(true);
  };

  const handleCloseModal = () => {
    set_openChannelModal(false);
    set_amount('');
    set_peerId(props.peerId ? props.peerId : '');
  };

  const handleAction = () => {
    const handleOpenChannel = (amount: string, peerId: string) => {
      // Close Modal after starting to open channel
      handleCloseModal();
  
      const weiValue = ethers.utils.parseEther(amount).toString();
      dispatch(
        actionsAsync.openChannelThunk({
          apiEndpoint: loginData.apiEndpoint!,
          apiToken: loginData.apiToken!,
          amount: weiValue,
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
  
    const handleFundChannels = (amount: string, peerId: string, channelId: string) => {
      handleCloseModal();
  
      const parsedOutgoing = parseFloat(amount ?? '0') >= 0 ? amount ?? '0' : '0';
      const weiValue = ethers.utils.parseEther(parsedOutgoing).toString();
      dispatch(
        actionsAsync.fundChannelsThunk({
          apiEndpoint: loginData.apiEndpoint!,
          apiToken: loginData.apiToken!,
          peerId: peerId,
          incomingAmount: '0',
          outgoingAmount: weiValue,
          timeout: 60e3,
        }),
      ).unwrap()
        .then(() => {
          handleRefresh();
        });
    };

    if(channelId) { handleFundChannels(amount, peerId, channelId); }
    else { handleOpenChannel(amount, peerId); }
  }

  return (
    <>
      <button onClick={handleOpenChannelDialog}>{modalBtnText ? modalBtnText : 'Open Channel'}</button>
      <SDialog
        open={openChannelModal}
        onClose={handleCloseModal}
      >
        <TopBar>
          <DialogTitle>
           {title ? title : 'Open Outgoing Channel'}
          </DialogTitle>
          <SIconButton
            aria-label="close modal"
            onClick={handleCloseModal}
          >
            <CloseIcon/>
          </SIconButton>
        </TopBar>
        <SDialogContent>
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
        </SDialogContent>
        <DialogActions>
          <button onClick={handleCloseModal}>Cancel</button>
          <button
            onClick={handleAction}
            disabled={!amount || parseFloat(amount) <= 0 || !peerId}
          >
            { actionBtnText ? actionBtnText : 'Open Channel'}
          </button>
        </DialogActions>
      </SDialog>
    </>
  );
};
