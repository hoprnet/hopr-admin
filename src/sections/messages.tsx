import { MouseEvent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { api } from '@hoprnet/hopr-sdk';
import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';

// mui
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { nodeActions } from '../store/slices/node';

// HOPR components
import Checkbox from '../future-hopr-lib-components/Toggles/Checkbox';
import { EventType } from '@testing-library/react';

const PathOrHops = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

const StatusContainer = styled.div`
  height: 32px;
`;

const messages = () => {
  const { messages, aliases } = useAppSelector((selector) => selector.node);
  const { apiEndpoint, apiToken } = useAppSelector(
    (selector) => selector.auth.loginData
  );
  const dispatch = useAppDispatch();

  const [message, set_message] = useState<string>('');
  const [numberOfHops, set_numberOfHops] = useState<number | ''>('');
  const [path, set_path] = useState<string>('');
  const [automaticPath, set_automaticPath] = useState<boolean>(true);
  const [sendMode, set_sendMode] = useState<
    'path' | 'automaticPath' | 'numberOfHops'
  >('automaticPath');
  const [receiver, set_receiver] = useState<string>(
    '16Uiu2HAmGeGVWvTr8bQseCarpp1FMiDnCPbFmutuzLvE9cTYntS3'
  );
  const [loader, set_loader] = useState<boolean>(false);
  const [status, set_status] = useState<string>('');

  const maxLength = 500;
  const remainingChars = maxLength - message.length;

  useEffect(() => {
    console.log({ path, automaticPath, numberOfHops });
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

  const isAlias = (alias: string) => {
    if (aliases) {
      return !!aliases[alias];
    } else return false;
  };

  const validateReceiver = (receiver: string) => {
    if (isAlias(receiver)) {
      if (aliases) {
        return aliases[receiver];
      } else return receiver;
    } else return receiver;
  };

  const handleSendMessage = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!(apiEndpoint && apiToken)) return;
    set_status('');
    set_loader(true);
    const validatedReceiver = validateReceiver(receiver);

    let object = {
      apiToken,
      apiEndpoint,
      body: message,
      recipient: validatedReceiver,
    };
    console.log('@message:', object);
    let resp;
    try {
      resp = await api.sendMessage(object);
      console.log('@message resp:', resp);
      if (typeof resp === 'string') set_status('Message sent');
    } catch (err: any) {
      console.log('@message err:', err);
      set_status(err.error);
    }
    set_loader(false);
  };

  const handlePath = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_sendMode('path');
    set_path(event.target.value);
  };

  const handleNumberOfHops = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_sendMode('numberOfHops');
    set_numberOfHops(
      parseInt(event.target.value) || parseInt(event.target.value) === 0
        ? parseInt(event.target.value)
        : ''
    );
  };

  const handleAutomaticPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    set_sendMode('automaticPath');
    set_automaticPath(event.target.checked);
  };

  return (
    <Section yellow>
      <h2>Send Message</h2>
      <form style={{ width: '100%' }}>
        <Stack spacing={3}>
          <TextField
            label="Reciever"
            placeholder="16Uiu2..."
            multiline
            maxRows={4}
            value={receiver}
            onChange={(e) => set_receiver(e.target.value)}
            required
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
          />
          <PathOrHops>
            <Checkbox
              label="Automatic path"
              value={automaticPath}
              onChange={handleAutomaticPath}
            />
            <span>or</span>
            <TextField
              style={{ width: '180px' }}
              type="number"
              label="Number of Hops"
              placeholder="1"
              value={numberOfHops}
              onChange={handleNumberOfHops}
              inputProps={{ min: 0, max: 10, step: 1 }}
              disabled={automaticPath}
            />
            <span>or</span>
            <TextField
              style={{ width: '100%' }}
              label="Path"
              placeholder="16Uiu2...9cTYntS3, 16Uiu2...9cDFSAa"
              value={path}
              onChange={handlePath}
              disabled={automaticPath}
            />
          </PathOrHops>
          <button type="submit" onClick={handleSendMessage}>
            Send
          </button>
          <StatusContainer>
            {loader && <CircularProgress />}
            {status}
          </StatusContainer>
        </Stack>
      </form>
      <h2>Messages</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="aliases table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>seen</TableCell>
              <TableCell>message</TableCell>
              <TableCell>actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message, index) => {
              const date = new Date(message.createdAt).toString();
              return (
                <TableRow
                  key={message.id}
                  className={`message-${message.seen ? 'unseen' : 'seen'}`}
                >
                  <TableCell component="th" scope="row">
                    {index}
                  </TableCell>
                  <TableCell>{`${message.seen}`}</TableCell>
                  <Tooltip title={date}>
                    <TableCell>{message.body}</TableCell>
                  </Tooltip>
                  <TableCell>
                    <button
                      onClick={() =>
                        dispatch(nodeActions.toggleMessageSeen(message))
                      }
                    >
                      Mark as {message.seen ? 'unseen' : 'seen'}
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
};

export default messages;
