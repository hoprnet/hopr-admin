import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  InputAdornment
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store';
import { useState } from 'react';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { ethers } from 'ethers';
import CloseIcon from '@mui/icons-material/Close';

type FundChannelModalProps = {
  channelId: string;
  peerId: string;
  handleRefresh: () => void;
  text: string;
};

export const FundChannelModal = ({
  channelId,
  peerId,
  handleRefresh,
  text,
}: FundChannelModalProps) => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [openFundingPopups, set_openFundingPopups] = useState<Record<string, boolean>>({});
  const [fundingAmount, set_fundingAmount] = useState('');

  const handleOpenFundingPopup = (channelId: string) => {
    set_openFundingPopups((prevOpenPopups) => ({
      ...prevOpenPopups,
      [channelId]: true,
    }));
  };

  const closeFundingPopup = (channelId: string) => {
    set_openFundingPopups((prevOpenPopups) => ({
      ...prevOpenPopups,
      [channelId]: false,
    }));
    set_fundingAmount('');
  };

  const handleFundChannels = (peerId: string, channelId: string) => {
    const parsedOutgoing = parseFloat(fundingAmount ?? '0') >= 0 ? fundingAmount ?? '0' : '0';

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
    )
      .unwrap()
      .then(() => {
        handleRefresh();
      })
      .finally(() => {
        closeFundingPopup(channelId);
      });
  };

  const handleSubmitClick = () => {
    handleFundChannels(peerId, channelId);
    closeFundingPopup(channelId);
  };

  return (
    <>
      <button onClick={() => handleOpenFundingPopup(channelId)}>{text}</button>
      <Dialog
        open={openFundingPopups[channelId] || false}
        onClose={() => closeFundingPopup(channelId)}
      >
        <DialogTitle>
          {text}{' '}
          <CloseIcon
            onClick={() => closeFundingPopup(channelId)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          />
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Funding Amount"
            type="string"
            value={fundingAmount}
            onChange={(e) => set_fundingAmount(e.target.value)}
            InputProps={{ endAdornment: <InputAdornment position="end">mHOPR</InputAdornment> }}
            sx={{ mt: '16px' }}
          />
        </DialogContent>
        <DialogActions>
          <button onClick={() => closeFundingPopup(channelId)}>Cancel</button>
          <button
            onClick={handleSubmitClick}
            disabled={!fundingAmount || parseFloat(fundingAmount) <= 0}
          >
            Fund
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};
