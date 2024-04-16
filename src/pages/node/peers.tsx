import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { exportToCsv } from '../../utils/helpers';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';
import { CreateAliasModal } from '../../components/Modal/node//AddAliasModal';
import { OpenChannelModal } from '../../components/Modal/node/OpenChannelModal';
import { FundChannelModal } from '../../components/Modal/node/FundChannelModal';
import { SendMessageModal } from '../../components/Modal/node/SendMessageModal';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import TablePro from '../../future-hopr-lib-components/Table/table-pro';
import ProgressBar from '../../future-hopr-lib-components/Progressbar';

//  Modals
import { PingModal } from '../../components/Modal/node/PingModal';

//Mui
import GetAppIcon from '@mui/icons-material/GetApp';


function PeersPage() {
  const dispatch = useAppDispatch();
  const loginData = useAppSelector((store) => store.auth.loginData);
  const peers = useAppSelector((store) => store.node.peers.data);
  const peersFetching = useAppSelector((store) => store.node.peers.isFetching);
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const aliasesFetching = useAppSelector((store) => store.node.aliases.isFetching);
  const nodeAddressToOutgoingChannelLink = useAppSelector((store) => store.node.links.nodeAddressToOutgoingChannel);
  const peerIdToAliasLink = useAppSelector((store) => store.node.links.peerIdToAlias);

  useEffect(() => {
    handleRefresh();
  }, [loginData, dispatch]);

  const handleRefresh = () => {
    if(!loginData.apiEndpoint) return;

    dispatch(
      actionsAsync.getPeersThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken ? loginData.apiToken : '',
      })
    );
    dispatch(
      actionsAsync.getAliasesThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken ? loginData.apiToken : '',
      })
    );
  };

  const getAliasByPeerId = (peerId: string): string => {
    if(aliases && peerId && peerIdToAliasLink[peerId]) return `${peerIdToAliasLink[peerId]} (${peerId})`
    return peerId;
  }

  const handleExport = () => {
    if (peers?.connected) {
      exportToCsv(
        peers.connected.map((peer) => ({
          peerId: peer.peerId,
          nodeAddress: peer.peerAddress,
          quality: peer.quality,
          multiaddr: peer.multiaddr,
          heartbeats: peer.heartbeats,
          lastSeen: peer.lastSeen,
          backoff: peer.backoff,
          isNew: peer.isNew,
        })),
        'peers.csv'
      );
    }
  };

  const header = [
    {
      key: 'number',
      name: '#',
    },
    {
      key: 'peerId',
      name: 'Peer Id',
      search: true,
      tooltip: true,
      copy: true,
      maxWidth: '160px',
    },
    {
      key: 'peerAddress',
      name: 'Node Address',
      search: true,
      tooltip: true,
      copy: true,
      maxWidth: '160px',
    },
    {
      key: 'lastSeen',
      name: 'Last seen',
      tooltip: true,
      maxWidth: '60px',
    },
    {
      key: 'quality',
      name: 'Quality',
      maxWidth: '20px',
    },
    {
      key: 'actions',
      name: 'Actions',
      search: false,
      width: '168px',
      maxWidth: '168px',
    },
  ];

  const parsedTableData = Object.entries(peers?.connected ?? {}).map(([id, peer]) => {
    return {
      id: id,
      number: id,
      peerId: getAliasByPeerId(peer.peerId),
      peerAddress: peer.peerAddress,
      quality: <ProgressBar
        value={peer.quality}
      />,
      lastSeen: peer.lastSeen > 0 ? new Date(peer.lastSeen).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      })
      :
      'Not seen',
      actions: (
        <>
          <PingModal peerId={peer.peerId} />
          <CreateAliasModal
            handleRefresh={handleRefresh}
            peerId={peer.peerId}
          />
          {
            nodeAddressToOutgoingChannelLink[peer.peerAddress] ?
            <FundChannelModal
              channelId={nodeAddressToOutgoingChannelLink[peer.peerAddress]}
            />
            :
            <OpenChannelModal
              peerAddress={peer.peerAddress}
            />
          }

          <SendMessageModal peerId={peer.peerId} />
        </>
      ),
    };
  });

  return (
    <Section
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title={`PEERS (${peers?.connected?.length || '-'})`}
        refreshFunction={handleRefresh}
        reloading={peersFetching || aliasesFetching}
        actions={
          <>
            <PingModal />
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText={
                <span>
                  EXPORT
                  <br />
                  seen peers as a CSV
                </span>
              }
              disabled={!peers?.connected || Object.keys(peers.connected).length === 0}
              onClick={handleExport}
            />
          </>
        }
      />
      <TablePro
        data={parsedTableData}
        search={true}
        header={header}
        id={'node-peers-table'}
      />
    </Section>
  );
}

export default PeersPage;
