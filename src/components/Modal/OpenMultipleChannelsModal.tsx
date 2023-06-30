import { useRef, useState } from 'react';
import { DialogTitle, DialogActions, InputAdornment } from '@mui/material';
import { SDialog, SDialogContent, SIconButton, TopBar } from '../../future-hopr-lib-components/Modal/styled';
import STextField from '../../future-hopr-lib-components/TextField';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import CloseIcon from '@mui/icons-material/Close';
import { ethers } from 'ethers';

type OpenMultipleChannelsModalProps = {};

export const OpenMultipleChannelsModal = () => {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [openChannelModal, set_openMultipleChannelsModal] = useState(false);
  const [amount, set_amount] = useState('');
  const [peerIds, set_peerIds] = useState<string[]>([]);

  const handleRefresh = () => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      dispatch(
        actionsAsync.getChannelsThunk({
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
        }),
      );
    }
  };

  const handleOpenMultipleChannelsDialog = () => {
    set_openMultipleChannelsModal(true);
  };

  const handleCloseModal = () => {
    set_openMultipleChannelsModal(false);
    set_amount('');
    set_peerIds([]);
  };

  const handleAction = async () => {
    if (peerIds && loginData.apiEndpoint && loginData.apiToken) {
      const parsedOutgoing = parseFloat(amount ?? '0') >= 0 ? amount ?? '0' : '0';
      const weiValue = ethers.utils.parseEther(parsedOutgoing).toString();
      dispatch(
        actionsAsync.openMultipleChannelsThunk({
          peerIds: peerIds,
          amount: weiValue,
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken,
          timeout: 60e3 * 7, // 7 minutes... This method can take really long
        }),
      )
        .unwrap()
        .then(handleRefresh)
        .catch((e) => {
          console.log(e.error);
        })
        .finally(() => {
          handleCloseModal();
        });
    }
  };

  return (
    <>
      <button onClick={handleOpenMultipleChannelsDialog}>{'Open Multiple Channels'}</button>
      <SDialog
        open={openChannelModal}
        onClose={handleCloseModal}
      >
        <TopBar>
          <DialogTitle>{'Open Multiple Channels'}</DialogTitle>
          <SIconButton
            aria-label="close modal"
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </SIconButton>
        </TopBar>
        <SDialogContent>
          <CSVUploader />
          <STextField
            label="Peer Ids"
            type="string"
            placeholder="16Uiu2HA...,16Uiu2HA...,16Uiu2HA...,16Uiu2HA..."
            value={peerIds.join(',\n')}
            multiline
            rows={8}
            disabled={true}
            sx={{}}
          />
          <STextField
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
            disabled={!amount || parseFloat(amount) <= 0 || !peerIds}
          >
            {'Open Channels'}
          </button>
        </DialogActions>
      </SDialog>
    </>
  );

  /**
   * Component for uploading and parsing CSV data.
   */
  function CSVUploader() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Handles the file upload event.
     * @param event The file upload event.
     */
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const contents = e.target?.result;
        if (typeof contents === 'string') {
          parseCSV(contents);
        }
      };

      if (file) {
        reader.readAsText(file);
      }
    };

    const parseCSV = (csvContent: string) => {
      const lines = csvContent.split('\n');
      const parsedData: string[] = [];

      // gets all keys, csv holds the headers on the first line
      const header = lines[0].split(',');
      const expectedObjectKeys = header.map((key) => key.trim());

      // find the index of the "peerId" header
      const peerIdIndex = expectedObjectKeys.findIndex((key) => key === 'peerId');

      // loop through each line, get the peerId value and add it to parsedData
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length > 1 && peerIdIndex !== -1) {
          const peerId = values[peerIdIndex]?.trim();
          if (peerId) {
            parsedData.push(peerId);
          }
        }
      }

      // after parsing, run the callback function
      set_peerIds(parsedData);

      // Reset the file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    const handleImportClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div>
        <button onClick={handleImportClick}>Open Multiple Channels</button>
        {/* hidden import */}
        <input
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileUpload}
          placeholder="import"
        />
      </div>
    );
  }
};
