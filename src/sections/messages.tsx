import { MouseEvent, useEffect, useState } from 'react';
import { api } from '@hoprnet/hopr-sdk';
import Section from '../future-hopr-lib-components/Section';
import { useAppSelector } from '../store';
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
} from '@mui/material';

const messages = () => {
  const { messages, aliases } = useAppSelector((selector) => selector.node);
  const { apiEndpoint, apiToken } = useAppSelector(
    (selector) => selector.auth.loginData
  );

  const [message, set_message] = useState<string>('');
  const [numberOfHops, set_numberOfHops] = useState<number>(0);
  const [receiver, set_receiver] = useState<string>('');

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

  const sendMessage = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const validatedReceiver = validateReceiver(receiver);
    console.log('@message:', message);
    console.log('@numberOfHops:', numberOfHops);
    console.log('@receiver:', receiver);
    console.log('@validatedReceiver:', validatedReceiver);

    if (apiEndpoint && apiToken) {
      await api.sendMessage({
        apiToken,
        apiEndpoint,
        body: message,
        recipient: validatedReceiver,
        hops: numberOfHops,
        path: [],
      });
    }
  };

  const toggleSeenStatus = (messageIndex: number) => {
    // ! Cannot assign to read only property 'seen' of object '#<Object>'
    messages[messageIndex].seen = !messages[messageIndex].seen;
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
            {messages.map(({ seen, body, createdAt }, index) => {
              const date = new Date(createdAt).toString();
              return (
                <TableRow
                  key={index}
                  className={`message-${seen ? 'unseen' : 'seen'}`}
                >
                  <TableCell component="th" scope="row">
                    {index}
                  </TableCell>
                  <TableCell>{`${seen}`}</TableCell>
                  <Tooltip title={date}>
                    <TableCell>{body}</TableCell>
                  </Tooltip>
                  <TableCell>
                    <button onClick={() => toggleSeenStatus(index)}>
                      Mark as {seen ? 'unseen' : 'seen'}
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
            onChange={(e) => set_numberOfHops(parseInt(e.target.value))}
            inputProps={{ min: 0, max: 10, step: 1 }}
            required
          />
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
