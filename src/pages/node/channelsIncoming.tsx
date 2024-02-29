import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../../utils/helpers';
import { utils } from 'ethers';
import { HOPR_TOKEN_USED } from '../../../config';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import TablePro from '../../future-hopr-lib-components/Table/table-pro';

// Modals
import { PingModal } from '../../components/Modal/node/PingModal';
import { OpenChannelModal } from '../../components/Modal/node/OpenChannelModal';
import { CreateAliasModal } from '../../components/Modal/node//AddAliasModal';
import { SendMessageModal } from '../../components/Modal/node/SendMessageModal';

// Mui
import GetAppIcon from '@mui/icons-material/GetApp';


function ChannelsPage() {
  const dispatch = useAppDispatch();
  const channels = useAppSelector((store) => store.node.channels.data);
  const channelsIncomingObject = useAppSelector((store) => store.node.channels.parsed.incoming);
  const nodeAddressToOutgoingChannel =  useAppSelector((store) => store.node.links.nodeAddressToOutgoingChannel);
  const channelsFetching = useAppSelector((store) => store.node.channels.isFetching);
  const aliases = useAppSelector((store) => store.node.aliases.data)
  const peers = useAppSelector((store) => store.node.peers.data)
  const loginData = useAppSelector((store) => store.auth.loginData);

  const tabLabel = 'incoming';
  const channelsData = channels?.incoming;

  const [queryParams, set_queryParams] = useState('');

  const navigate = useNavigate();

  const handleHash = () => {
    navigate(`?${queryParams}#incoming`, { replace: true });
  };

  useEffect(() => {
    if (loginData.apiEndpoint && loginData.apiToken) {
      const queryParams = new URLSearchParams({
        apiToken: loginData.apiToken,
        apiEndpoint: loginData.apiEndpoint,
      }).toString();
      set_queryParams(queryParams);
    }
  }, [loginData.apiToken, loginData.apiEndpoint]);

  useEffect(() => {
    handleHash();
    handleRefresh();
  }, [queryParams]);

  const handleRefresh = () => {
    if(!loginData.apiEndpoint || !loginData.apiToken) return;

    dispatch(
      actionsAsync.getChannelsThunk({
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
    dispatch(
      actionsAsync.getPeersThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );
    dispatch(
      actionsAsync.getTicketsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );

  };

  const getAliasByPeerAddress = (peerAddress: string): string => {

    const peerId = peers?.announced.find(peer => peer.peerAddress === peerAddress)?.peerId;

    if (!peerId) {
      return peerAddress;
    }

    if (aliases) {
      for (const [alias, id] of Object.entries(aliases)) {
        if (id === peerId) {
          return alias;
        }
      }
    }

    return peerAddress
  }


  const getPeerIdFromPeerAddress = (peerAddress: string): string | undefined => {
    const peerId = peers?.announced.find(peer => peer.peerAddress === peerAddress)?.peerId;
    return peerId;
  }

  const handleExport = () => {
    if (channelsData) {
      exportToCsv(
        Object.entries(channelsData).map(([, channel]) => ({
          channelId: channel.id,
          nodeAddress: channel.peerAddress,
          status: channel.status,
          dedicatedFunds: channel.balance,
        })),
        `${tabLabel}-channels.csv`,
      );
    }
  };

  const headerIncoming = [
    {
      key: 'id',
      name: '#',
    },
    {
      key: 'peerAddress',
      name: 'Node Address',
      search: true,
      copy: true,
      maxWidth: '568px',
      tooltip: true,
    },
    {
      key: 'status',
      name: 'Status',
      maxWidth: '368px',
      tooltip: true,
    },
    {
      key: 'funds',
      name: 'Dedicated Funds',
      maxWidth: '68px',
      tooltip: true,
    },
    {
      key: 'tickets',
      name: 'Tickets',
      maxWidth: '60px',
    },
    {
      key: 'actions',
      name: 'Actions',
      search: false,
      width: '168px',
      maxWidth: '168px',
    },
  ];

  const parsedTableData = Object.keys(channelsIncomingObject).map((id, index) => {
    if(!channelsIncomingObject[id].peerAddress || !channelsIncomingObject[id].balance || !channelsIncomingObject[id].status) return;
    // @ts-ignore: check was done in line above
    const outgoingChannelOpened = !!(channelsIncomingObject[id].peerAddress && !!nodeAddressToOutgoingChannel[channelsIncomingObject[id].peerAddress]);
    const peerId = getPeerIdFromPeerAddress(channelsIncomingObject[id].peerAddress as string);

    return {
      id: index.toString(),
      key: id,
      peerAddress: getAliasByPeerAddress(channelsIncomingObject[id].peerAddress as string),
      status: channelsIncomingObject[id].status,
      funds: `${utils.formatEther(channelsIncomingObject[id].balance as string)} ${HOPR_TOKEN_USED}`,
      tickets: channelsIncomingObject[id].tickets.toString(),
      actions: (
        <>
          <PingModal
            peerId={peerId}
            disabled={!peerId}
            tooltip={!peerId ? <span>DISABLED<br/>Unable to find<br/>peerId</span> : undefined }
          />
          <CreateAliasModal
            handleRefresh={handleRefresh}
            peerId={peerId}
            disabled={!peerId}
            tooltip={!peerId ? <span>DISABLED<br/>Unable to find<br/>peerId</span> : undefined }
          />
          <OpenChannelModal
            peerAddress={channelsIncomingObject[id].peerAddress}
            disabled={outgoingChannelOpened}
            tooltip={outgoingChannelOpened ? <span>Outgoing channel<br/>already opened</span> : undefined }
          />
          <SendMessageModal
            peerId={peerId}
            disabled={!peerId}
            tooltip={!peerId ? <span>DISABLED<br/>Unable to find<br/>peerId</span> : undefined }
          />
        </>
      ),
    };
  }).filter(elem => elem !== undefined) as {
    id: string;
    key: string;
    peerAddress: string;
    status: "Open" | "PendingToClose" | "Closed" ;
    tickets: string;
    funds: string;
    actions: JSX.Element;
  }[];

  return (
    <Section
      className="Channels--aliases"
      id="Channels--aliases"
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title={`INCOMING CHANNELS`}
        refreshFunction={handleRefresh}
        reloading={channelsFetching}
        actions={
          <>
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText={
                <span>
                  EXPORT
                  <br />
                  {tabLabel} channels as a CSV
                </span>
              }
              disabled={!channelsData || Object.keys(channelsData).length === 0}
              onClick={handleExport}
            />
          </>
        }
      />
      <TablePro
        data={parsedTableData}
        header={headerIncoming}
        search
        loading={parsedTableData.length === 0 && channelsFetching}
      />
    </Section>
  );
}

export default ChannelsPage;
