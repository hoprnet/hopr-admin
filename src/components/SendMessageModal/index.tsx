import { MouseEvent, useState, useEffect } from 'react';

import styled from '@emotion/styled';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Tooltip
} from '@mui/material';
import { SendMessagePayloadType } from '@hoprnet/hopr-sdk';
import Checkbox from '../../future-hopr-lib-components/Toggles/Checkbox';

const PathOrHops = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const StatusContainer = styled.div`
  height: 32px;
`;

export const SendMessageModal = () => {
  const [path, set_path] = useState<string>('');
  const [loader, set_loader] = useState<boolean>(false);
  const [status, set_status] = useState<string>('');
  const [numberOfHops, set_numberOfHops] = useState<number | ''>('');
  const [sendMode, set_sendMode] = useState<'path' | 'automaticPath' | 'numberOfHops'>('automaticPath');
  const [automaticPath, set_automaticPath] = useState<boolean>(true);
  const [message, set_message] = useState<string>('');
  const [receiver, set_receiver] = useState<string>('');
  const [openModal, set_openModal] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const maxLength = 500;
  const remainingChars = maxLength - message.length;

  const nonAutomaticPathTooltip = 'Disable `automatic path` to enable `Number of hops`';

  const {
    apiEndpoint, apiToken, 
  } = useAppSelector((selector) => selector.auth.loginData);
  const { aliases } = useAppSelector((selector) => selector.node);

  useEffect(() => {
    switch (sendMode) {
    case 'path':
      set_automaticPath(false);
      set_numberOfHops('');
      break;
    case 'numberOfHops':
      set_automaticPath(false);
      set_path('');
      break;
    default: //'automaticPath'
      set_numberOfHops('');
      set_path('');
    }
  }, [sendMode, path, automaticPath, numberOfHops]);

  const handleSendMessage = () => {
    if (!(apiEndpoint && apiToken)) return;
    set_status('');
    set_loader(true);
    const validatedReceiver = validatePeerId(receiver);

    const messagePayload: SendMessagePayloadType = {
      apiToken,
      apiEndpoint,
      body: message,
      recipient: validatedReceiver,
    };
    if (numberOfHops !== '') {
      messagePayload.hops = numberOfHops;
    } else if (path !== '') {
      const pathElements = path.replace(/(\r\n|\n|\r| )/gm, '').split(',');
      const validatedPath = pathElements.map((element) => validatePeerId(element));
      messagePayload.path = validatedPath;
    }

    console.log(JSON.stringify(messagePayload));

    dispatch(actionsAsync.sendMessageThunk(messagePayload))
      .unwrap()
      .then((res) => {
        set_status('Message sent');
        console.log(res?.body); // undefined
        console.log(res?.challenge); // undefined
      })
      .catch((e) => {
        console.log('@message err:', e);
        set_status(e.error);
      })
      .finally(() => {
        set_loader(false);
      });
  };

  const handleAutomaticPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_sendMode('automaticPath');
    set_automaticPath(event.target.checked);
  };

  const handlePath = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_sendMode('path');
    set_path(event.target.value);
  };

  const handleNumberOfHops = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_sendMode('numberOfHops');
    set_numberOfHops(
      parseInt(event.target.value) || parseInt(event.target.value) === 0 ? parseInt(event.target.value) : '',
    );
  };

  const handleOpenModal = () => {
    set_openModal(true);
  };

  const handleCloseModal = () => {
    set_sendMode('automaticPath');
    set_numberOfHops('');
    set_message('');
    set_receiver(' ');
    set_path('');
    set_openModal(false);
    set_status('');
  };

  const isAlias = (alias: string) => {
    if (aliases) {
      return !!aliases[alias];
    } else return false;
  };

  const validatePeerId = (receiver: string) => {
    if (isAlias(receiver)) {
      if (aliases) {
        return aliases[receiver];
      } else return receiver;
    } else return receiver;
  };

  return (
    <>
      <button onClick={handleOpenModal}>Send Message</button>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth={true}
      >
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <TextField
            label="Receiver"
            placeholder="16Uiu2..."
            value={receiver}
            onChange={(e) => set_receiver(e.target.value)}
            required
            fullWidth
            sx={{
              maxWidth: '480px',
              mb: '8px',
              mt: '12px',
            }}
          />
          <TextField
            label="Message"
            placeholder="Hello Node..."
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => set_message(e.target.value)}
            inputProps={{ maxLength: maxLength }}
            helperText={`${remainingChars} characters remaining`}
            required
            fullWidth
            sx={{
              maxWidth: '480px',
              mb: '8px',
            }}
          />
          <br />
          <span style={{ margin: '13px 0 -20px 0' }}>Send mode:</span>
          <PathOrHops>
            <Checkbox
              label="Automatic path"
              value={automaticPath}
              onChange={handleAutomaticPath}
            />
            or
            <Tooltip
              title={nonAutomaticPathTooltip}
              disableHoverListener={!automaticPath}
            >
              <TextField
                style={{ width: '180px' }}
                type="number"
                label="Number of Hops"
                placeholder="1"
                value={numberOfHops}
                onChange={handleNumberOfHops}
                inputProps={{
                  min: 0,
                  max: 10,
                  step: 1,
                }}
                disabled={automaticPath}
              />
            </Tooltip>
            or
            <Tooltip
              title={nonAutomaticPathTooltip}
              disableHoverListener={!automaticPath}
            >
              <TextField
                label="Path"
                placeholder="16Uiu2...9cTYntS3, 16Uiu2...9cDFSAa"
                value={path}
                onChange={handlePath}
                disabled={automaticPath}
                fullWidth
                sx={{ maxWidth: '480px' }}
              />
            </Tooltip>
          </PathOrHops>
          <button
            onClick={handleSendMessage}
            disabled={
              (!automaticPath && numberOfHops === '' && path === '') || message.length === 0 || receiver.length === 0
            }
            style={{
              width: '100%',
              marginTop: '8px',
            }}
          >
            Send
          </button>
          <StatusContainer>
            {loader && <CircularProgress />}
            {status}
          </StatusContainer>
        </DialogContent>
      </Dialog>
    </>
  );
};
