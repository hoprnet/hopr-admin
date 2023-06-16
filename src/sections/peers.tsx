import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from '@mui/material';
import { useEffect } from 'react';
import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { exportToCsv } from '../utils/helpers';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

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

  const splitString = (addresses: string): string[] => {
    const splitParts = addresses.split('/');
    const formattedAddress = [];

    for (let i = 1; i < splitParts.length; i += 2) {
      formattedAddress.push(`/${splitParts[i]}/${splitParts[i + 1]}`);
    }

    return formattedAddress;
  };

  return (
    <Section>
      <h2>
        Peers seen in the network ({peers?.announced?.length || 0}){' '}
        <button onClick={handleRefresh}>Refresh</button>
      </h2>
      <button
        disabled={
          !peers?.announced || Object.keys(peers.announced).length === 0
        }
        onClick={() => {
          if (peers?.announced) {
            exportToCsv(
              peers.announced.map((peer) => ({
                peerId: peer.peerId,
                quality: peer.quality,
                multiAddr: peer.multiAddr,
                heartbeats: peer.heartbeats,
                lastSeen: peer.lastSeen,
                backoff: peer.backoff,
                isNew: peer.isNew,
              })),
              'peers.csv'
            );
          }
        }}
      >
        export
      </button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="aliases table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ fontSize: '12px' }}>Id</StyledTableCell>
              <StyledTableCell>Peer Id</StyledTableCell>
              <StyledTableCell>Alias</StyledTableCell>
              <StyledTableCell>Elegible</StyledTableCell>
              <StyledTableCell>Multiaddrs</StyledTableCell>
              <StyledTableCell>Last seen</StyledTableCell>
              <StyledTableCell>Quality</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(peers?.announced ?? {}).map(([id, peer]) => (
              <TableRow key={id}>
                <StyledTableCell component="th" scope="row">
                  {id}
                </StyledTableCell>
                <StyledTableCell>{peer.peerId}</StyledTableCell>
                <StyledTableCell>
                  {getAliasByPeerId(peer.peerId)}
                </StyledTableCell>
                <StyledTableCell>
                  {peers?.connected
                    .some(
                      (connectedPeer) => connectedPeer.peerId === peer.peerId
                    )
                    .toString()}
                </StyledTableCell>
                <StyledTableCell>
                  {splitString(peer.multiAddr).map((address) => (
                    <>
                      {address}
                      <br />
                    </>
                  ))}
                </StyledTableCell>
                <StyledTableCell>
                  {new Date(peer.lastSeen).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  })}
                </StyledTableCell>
                <StyledTableCell>{peer.quality}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Section>
  );
}

export default PeersPage;
