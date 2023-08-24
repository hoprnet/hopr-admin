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
import Tooltip from '../../future-hopr-lib-components/Tooltip/tooltip-fixed-width';
import TablePro from '../../future-hopr-lib-components/Table/table-pro';

//  Modals
import { PingModal } from '../../components/Modal/PingModal';

//Mui
import GetAppIcon from '@mui/icons-material/GetApp';

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

  const header = [
    {
      key: 'number',
      name: '#',
    },
    {
      key: 'alias',
      name: 'Alias',
      search: true,
      maxWidth: '60px',
    },
    {
      key: 'peerId',
      name: 'Peer Id',
      search: true,
      tooltip: true,
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
      maxWidth: '30px',
    },
    {
      key: 'actions',
      name: 'Actions',
      search: false,
      width: '168px',
      maxWidth: '168px',
    },
  ];

  const parsedTableData = Object.entries(peers?.announced ?? {}).map(([id, peer]) => {
    return {
      number: id,
      alias: aliases && getAliasByPeerId(peer.peerId),
      peerId: peer.peerId,
      quality: peer.quality.toFixed(2),
      lastSeen: new Date(peer.lastSeen).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
      actions: (
        <>
          <PingModal peerId={peer.peerId} />
          <CreateAliasModal
            handleRefresh={handleRefresh}
            peerId={peer.peerId}
          />
          <OpenOrFundChannelModal
            peerId={peer.peerId}
            type={'open'}
          />
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
        title={`PEERS (${peers?.announced?.length || '-'})`}
        refreshFunction={handleRefresh}
        reloading={peersFetching || aliasesFetching}
        actions={
          <>
            <PingModal />
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText="Export seen peers as a CSV"
              disabled={!peers?.announced || Object.keys(peers.announced).length === 0}
              onClick={handleExport}
            />
          </>
        }
      />
      <TablePro
        data={parsedTableData}
        search={true}
        header={header}
      />
    </Section>
  );
}

export default PeersPage;
