import { api } from '@hoprnet/hopr-sdk';
import Section from '../future-hopr-lib-components/Section';
import { useAppSelector } from '../store';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const messages = () => {
  // TODO: Change .sdk to .node
  const { messages } = useAppSelector((selector) => selector.sdk);
  const { apiEndpoint, apiToken } = useAppSelector(
    (selector) => selector.auth.loginData
  );
  console.log('@messages:', messages);

  if (!apiToken) {
    return <Section yellow>Login</Section>;
  }

  const sendMessage = async (body: string, recipient: string) => {
    if (apiEndpoint && apiToken) {
      await api.sendMessage({
        apiToken,
        apiEndpoint,
        body,
        recipient,
        hops: 1,
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
            {Object.entries(messages ?? {}).map(([seen, body], key) => (
              <TableRow key={key}>
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell>{seen}</TableCell>
                <TableCell>{body.body}</TableCell>
                <TableCell>
                  <button onClick={() => console.log('seen :)')}>seen</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <button
        onClick={() =>
          sendMessage(
            'Hello lucho',
            '16Uiu2HAkvNLCqvcVhmJXz3raeb8UWmGMFNS1cQKkYhncXV5G2RrC'
          )
        }
      >
        Send message
      </button>
    </Section>
  );
};

export default messages;
