import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { exportToCsv } from '../../utils/helpers';
import styled from '@emotion/styled';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';
import { CreateAliasModal } from '../../components/Modal/AddAliasModal';
import { OpenOrFundChannelModal } from '../../components/Modal/OpenOrFundChannelModal';
import { SendMessageModal } from '../../components/Modal/SendMessageModal';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';

//Mui
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import GetAppIcon from '@mui/icons-material/GetApp';

const StyledTable = styled(Table)`
  td {
    overflow-wrap: anywhere;
  }
  th {
    font-weight: 600;
  }
  th,
  td {
    font-size: 12px;
  }
`;

function PeersPage() {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((store) => store.auth.loginData);
  const peers = useAppSelector((store) => store.node.peers.data);
  const peersFetching = useAppSelector((store) => store.node.peers.isFetching);
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const aliasesFetching = useAppSelector((store) => store.node.aliases.isFetching);

  useEffect(() => {
    handleRefresh();
  }, [loginData, dispatch]);

  const handleRefresh = () => {
    dispatch(
      actionsAsync.getPeersThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      }),
    );
    dispatch(
      actionsAsync.getAliasesThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      }),
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

  const handleExport = () => {
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
        'peers.csv',
      );
    }
  };

  return (
    <Section fullHeightMin>
      <SubpageTitle
        title={`PEERS (${peers?.announced?.length || '-'})`}
        refreshFunction={handleRefresh}
        reloading={peersFetching || aliasesFetching}
        actions={
          <>
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText="Export seen peers as a CSV"
              disabled={!peers?.announced || Object.keys(peers.announced).length === 0}
              onClick={handleExport}
            />
          </>
        }
      />
      <TableContainer component={Paper}>
        <StyledTable
          sx={{ minWidth: 650 }}
          aria-label="aliases table"
        >
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Peer Id</TableCell>
              <TableCell>Alias</TableCell>
              <TableCell>Elegible</TableCell>
              <TableCell>Multiaddrs</TableCell>
              <TableCell>Last seen</TableCell>
              <TableCell>Quality</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(peers?.announced ?? {}).map(([id, peer]) => (
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
                <TableCell>
                  {new Date(peer.lastSeen).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  })}
                </TableCell>
                <TableCell>{peer.quality}</TableCell>
                <TableCell>
                  <CreateAliasModal
                    handleRefresh={handleRefresh}
                    peerId={peer.peerId}
                  />
                  <OpenOrFundChannelModal
                    peerId={peer.peerId}
                    type={'open'}
                  />
                  <SendMessageModal peerId={peer.peerId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </Section>
  );
}

export default PeersPage;
