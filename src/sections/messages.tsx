import { MouseEvent, useEffect, useState } from 'react';
import { api } from '@hoprnet/hopr-sdk';
import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import {
  MenuItem,
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
} from '@mui/material';
import { nodeActions } from '../store/slices/node';

const messages = () => {
  const { messages, aliases } = useAppSelector((selector) => selector.node);
  const { apiEndpoint, apiToken } = useAppSelector(
    (selector) => selector.auth.loginData
  );
  const dispatch = useAppDispatch();

  const [message, set_message] = useState<string>('');
  const [numberOfHops, set_numberOfHops] = useState<number>(1);
  const [receiver, set_receiver] = useState<string>('');
  const [path, set_path] = useState<string>('');

  const maxLength = 500;
  const remainingChars = maxLength - message.length;

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

  const getPathValue = (path: string) => {
    if (path === '[]') {
      return [];
    } else if (path === 'undefined') {
      return undefined;
    } else return;
  };

  const sendMessage = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const validatedReceiver = validateReceiver(receiver);

    const pathValue = getPathValue(path);

    console.log('@message:', message);
    console.log('@numberOfHops:', numberOfHops);
    console.log('@path:', path);
    console.log('@pathValue:', pathValue);
    console.log('@receiver:', receiver);
    console.log('@validatedReceiver:', validatedReceiver);

    if (apiEndpoint && apiToken) {
      await api.sendMessage({
        apiToken,
        apiEndpoint,
        body: message,
        recipient: validatedReceiver,
        hops: numberOfHops,
        path: pathValue,
      });
    }
  };

  return (
    <Section yellow>
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
      <h2>Send Message</h2>
      <form>
        <Stack spacing={3}>
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
          <TextField
            type="number"
            label="Number of Hops"
            placeholder="1"
            value={numberOfHops}
            onChange={(e) => set_numberOfHops(Number(e.target.value))}
            inputProps={{ min: 0, max: 10, step: 1 }}
            required
          />
          <TextField
            select
            label="Path"
            value={path}
            required
            onChange={(e) => set_path(e.target.value)}
          >
            <MenuItem value={'[]'}>[]</MenuItem>
            <MenuItem value={'undefined'}>undefined</MenuItem>
          </TextField>
          <TextField
            label="Reciever"
            placeholder="16Uiu2..."
            multiline
            maxRows={4}
            value={receiver}
            onChange={(e) => set_receiver(e.target.value)}
            required
          />
          <button type="submit" onClick={(e) => sendMessage(e)}>
            Send
          </button>
        </Stack>
      </form>
    </Section>
  );
};

export default messages;
