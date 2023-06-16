import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import { actionsAsync } from '../store/slices/node/actionsAsync';

function PeersPage() {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const peers = useAppSelector((selector) => selector.node.peers);
  const aliases = useAppSelector((selector) => selector.node.aliases);

  useEffect(() => {
    handleRefresh();
  }, [loginData, dispatch]);

  const handleRefresh = () => {
    dispatch(
      actionsAsync.getPeersThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );
    dispatch(
      actionsAsync.getAliasesThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );
  };

  const getAliasByPeerId = (peerId: string): string => {
    for (const [alias, id] of Object.entries(aliases!)) {
      if (id === peerId) {
        return alias;
      }
    }
    return ''; // Return 'N/A' if alias not found for the given peerId
  };

  return (
    <Section>
      <h2>
        Peers seen in the network ({peers?.announced?.length || 0}) <button onClick={handleRefresh}>Refresh</button>
      </h2>

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="aliases table"
        >
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>peerId</TableCell>
              <TableCell>alias</TableCell>
              <TableCell>Elegible</TableCell>
              <TableCell>Multiaddrs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(peers?.announced ?? {}).map(([id, peer], key) => (
              <TableRow key={id}>
                <TableCell
                  component="th"
                  scope="row"
                >
                  {id}
                </TableCell>
                <TableCell>{peer.peerId}</TableCell>
                <TableCell>{getAliasByPeerId(peer.peerId)}</TableCell>
                <TableCell>
                  {peers?.connected.some((connectedPeer) => connectedPeer.peerId === peer.peerId).toString()}
                </TableCell>
                <TableCell>{peer.multiAddr}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
}

export default PeersPage;
