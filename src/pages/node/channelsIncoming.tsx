import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../../utils/helpers';
import { utils } from 'ethers';
import { HOPR_TOKEN_USED } from '../../../config';
import { sendNotification } from '../../hooks/useWatcher/notifications';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import TablePro from '../../future-hopr-lib-components/Table/table-pro';
import CloseChannelIcon from '../../future-hopr-lib-components/Icons/CloseChannel';

// Modals
import { PingModal } from '../../components/Modal/node/PingModal';
import { OpenChannelModal } from '../../components/Modal/node/OpenChannelModal';
import { FundChannelModal } from '../../components/Modal/node/FundChannelModal';
import { CreateAliasModal } from '../../components/Modal/node//AddAliasModal';
import { SendMessageModal } from '../../components/Modal/node/SendMessageModal';

// Mui
import GetAppIcon from '@mui/icons-material/GetApp';


function ChannelsPage() {
  const dispatch = useAppDispatch();
  const channels = useAppSelector((store) => store.node.channels.data);
  const channelsIncomingObject = useAppSelector((store) => store.node.channels.parsed.incoming);
  const channelsFetching = useAppSelector((store) => store.node.channels.isFetching);
  const aliases = useAppSelector((store) => store.node.aliases.data)
  const currentApiEndpoint = useAppSelector((store) => store.node.apiEndpoint);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const nodeAddressToPeerIdLink = useAppSelector((store) => store.node.links.nodeAddressToPeerId);
  const nodeAddressToOutgoingChannelLink = useAppSelector((store) => store.node.links.nodeAddressToOutgoingChannel);
  const tickets = useAppSelector((store) => store.node.metricsParsed.tickets.incoming);
  const peerIdToAliasLink = useAppSelector((store) => store.node.links.peerIdToAlias);
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
      actionsAsync.getPrometheusMetricsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
      })
    );
  };

  const getPeerIdFromPeerAddress = (nodeAddress: string): string => {
    const peerId = nodeAddressToPeerIdLink[nodeAddress];
    return peerId!;
  }

  const getAliasByPeerAddress = (nodeAddress: string): string => {
    const peerId = getPeerIdFromPeerAddress(nodeAddress);
    if (nodeAddress === '0x6f9b56d7e8d4efaf0b9364f52972a1984a76e68b') {
      console.log('getPeerIdFromPeerAddress' , peerId)
    }
    if(aliases && peerId && peerIdToAliasLink[peerId]) return `${peerIdToAliasLink[peerId]} (${nodeAddress})`
    return nodeAddress;
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
      search: true,
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
      maxWidth: '140px',
      tooltipHeader: <>(unredeemed : redeemed)<br/>tickets per channel<br/>in wxHOPR. <br/><br/>Value is reset on node restart.</>
    },
    {
      key: 'actions',
      name: 'Actions',
      search: false,
      width: '188px',
      maxWidth: '188px',
    },
  ];

  const handleCloseChannel = (channelId: string) => {
    const usedApiEndpoint = loginData.apiEndpoint;
    console.log('handleCloseChannel', channelId)
    dispatch(
      actionsAsync.closeChannelThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
        channelId: channelId,
      })
    )
      .unwrap()
      .then(() => {
        handleRefresh();
      })
      .catch((e) => {
        console.error('handleCloseChannel', e)
        if(usedApiEndpoint === currentApiEndpoint) {
          const msg = `Closing of incomming channel ${channelId} failed`;
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: msg,
              url: null,
              timeout: null,
            },
            toastPayload: { message: msg },
            dispatch,
          });
        }
      });
  };

  const parsedTableData = Object.keys(channelsIncomingObject).map((id, index) => {
    if(!channelsIncomingObject[id].peerAddress || !channelsIncomingObject[id].balance || !channelsIncomingObject[id].status) return;
    // @ts-ignore: check was done in line above
    const outgoingChannelOpened = !!(channelsIncomingObject[id].peerAddress && !!nodeAddressToOutgoingChannelLink[channelsIncomingObject[id].peerAddress]);
    const peerId = getPeerIdFromPeerAddress(channelsIncomingObject[id].peerAddress as string);

    const ticketsPerChannel = `${tickets?.unredeemed[id]?.formatted ? tickets.unredeemed[id].formatted : '0'} : ${tickets?.redeemed[id]?.formatted ? tickets.redeemed[id].formatted : '0'}`

    return {
      id: (index+1).toString(),
      key: id,
      peerAddress: getAliasByPeerAddress(channelsIncomingObject[id].peerAddress as string),
      status: channelsIncomingObject[id].status,
      funds: `${utils.formatEther(channelsIncomingObject[id].balance as string)} ${HOPR_TOKEN_USED}`,
      tickets: ticketsPerChannel,
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
          {
            outgoingChannelOpened ?
            <FundChannelModal
              channelId={id}
            />
            :
            <OpenChannelModal
              peerAddress={channelsIncomingObject[id].peerAddress}
            />
          }
          <IconButton
            iconComponent={<CloseChannelIcon />}
            pending={channelsIncomingObject[id]?.isClosing}
            tooltipText={
              <span>
                CLOSE
                <br />
                incoming channel
              </span>
            }
            onClick={() => handleCloseChannel(id)}
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
        title={`INCOMING CHANNELS (${channelsData ? channelsData.length : '-'})`}
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
        id={'node-channels-in-table'}
        header={headerIncoming}
        search
        loading={parsedTableData.length === 0 && channelsFetching}
      />
    </Section>
  );
}

export default ChannelsPage;
