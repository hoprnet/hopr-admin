import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../../utils/helpers';
import { utils } from 'ethers';
import { sendNotification } from '../../hooks/useWatcher/notifications';
import { HOPR_TOKEN_USED } from '../../../config';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import CloseChannelIcon from '../../future-hopr-lib-components/Icons/CloseChannel';
import TablePro from '../../future-hopr-lib-components/Table/table-pro';

// Modals
import { OpenMultipleChannelsModal } from '../../components/Modal/node/OpenMultipleChannelsModal';
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
  const channelsOutgoingObject = useAppSelector((store) => store.node.channels.parsed.outgoing);
  const channelsFetching = useAppSelector((store) => store.node.channels.isFetching);
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const currentApiEndpoint = useAppSelector((store) => store.node.apiEndpoint);
  const nodeAddressToPeerIdLink = useAppSelector((store) => store.node.links.nodeAddressToPeerId);
  const peerIdToAliasLink = useAppSelector((store) => store.node.links.peerIdToAlias);
  const tabLabel = 'outgoing';
  const channelsData = channels?.outgoing;

  const [queryParams, set_queryParams] = useState('');

  const navigate = useNavigate();

  const handleHash = () => {
    navigate(`?${queryParams}#outgoing`, { replace: true });
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
    if (!loginData.apiEndpoint || !loginData.apiToken) return;
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
  };

  const getPeerIdFromPeerAddress = (nodeAddress: string): string => {
    const peerId = nodeAddressToPeerIdLink[nodeAddress];
    return peerId!;
  };

  const getAliasByPeerAddress = (nodeAddress: string): string => {
    const peerId = getPeerIdFromPeerAddress(nodeAddress);
    if (nodeAddress === '0x6f9b56d7e8d4efaf0b9364f52972a1984a76e68b') {
      console.log('getPeerIdFromPeerAddress', peerId);
    }
    if (aliases && peerId && peerIdToAliasLink[peerId]) return `${peerIdToAliasLink[peerId]} (${nodeAddress})`;
    return nodeAddress;
  };

  const handleExport = () => {
    if (channelsData) {
      exportToCsv(
        Object.entries(channelsData).map(([, channel]) => ({
          channelId: channel.id,
          nodeAddress: channel.peerAddress,
          status: channel.status,
          dedicatedFunds: channel.balance,
        })),
        `${tabLabel}-channels.csv`
      );
    }
  };

  const handleCloseChannels = (channelId: string) => {
    const usedApiEndpoint = loginData.apiEndpoint;
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
        if (usedApiEndpoint === currentApiEndpoint) {
          const msg = `Closing of outgoing channel ${channelId} failed`;
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

  const header = [
    {
      key: 'id',
      name: '#',
    },
    {
      key: 'peerAddress',
      name: 'Node Address',
      search: true,
      tooltip: true,
      copy: true,
      maxWidth: '168px',
    },
    {
      key: 'status',
      name: 'Status',
      search: true,
      tooltip: true,
      maxWidth: '80px',
    },
    {
      key: 'funds',
      name: 'Dedicated Funds',
      tooltip: true,
      maxWidth: '80px',
    },
    {
      key: 'actions',
      name: 'Actions',
      search: false,
      width: '188px',
      maxWidth: '188px',
    },
  ];

  const parsedTableData = Object.keys(channelsOutgoingObject)
    .map((id, index) => {
      if (
        !channelsOutgoingObject[id].peerAddress ||
        !channelsOutgoingObject[id].balance ||
        !channelsOutgoingObject[id].status
      )
        return;
      const peerId = getPeerIdFromPeerAddress(channelsOutgoingObject[id].peerAddress as string);

      return {
        id: index.toString(),
        key: id,
        peerAddress: getAliasByPeerAddress(channelsOutgoingObject[id].peerAddress as string),
        status: channelsOutgoingObject[id].status as string,
        funds: `${utils.formatEther(channelsOutgoingObject[id].balance as string)} ${HOPR_TOKEN_USED}`,
        actions: (
          <>
            <PingModal
              peerId={peerId}
              disabled={!peerId}
              tooltip={
                !peerId ? (
                  <span>
                    DISABLED
                    <br />
                    Unable to find
                    <br />
                    peerId
                  </span>
                ) : undefined
              }
            />
            <CreateAliasModal
              handleRefresh={handleRefresh}
              peerId={peerId}
              disabled={!peerId}
              tooltip={
                !peerId ? (
                  <span>
                    DISABLED
                    <br />
                    Unable to find
                    <br />
                    peerId
                  </span>
                ) : undefined
              }
            />
            <FundChannelModal channelId={id} />
            <IconButton
              iconComponent={<CloseChannelIcon />}
              pending={channelsOutgoingObject[id]?.isClosing}
              tooltipText={
                <span>
                  CLOSE
                  <br />
                  outgoing channel
                </span>
              }
              onClick={() => handleCloseChannels(id)}
            />
            <SendMessageModal
              peerId={peerId}
              disabled={!peerId}
              tooltip={
                !peerId ? (
                  <span>
                    DISABLED
                    <br />
                    Unable to find
                    <br />
                    peerId
                  </span>
                ) : undefined
              }
            />
          </>
        ),
      };
    })
    .filter((elem) => elem !== undefined) as {
    id: string;
    key: string;
    peerAddress: string;
    status: 'Open' | 'PendingToClose' | 'Closed';
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
        title={`OUTGOING CHANNELS (${channelsData ? channelsData.length : '-'})`}
        refreshFunction={handleRefresh}
        reloading={channelsFetching}
        actions={
          <>
            <OpenChannelModal />
            <OpenMultipleChannelsModal />
            <FundChannelModal />
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
        id={'node-channels-out-table'}
        header={header}
        search
        loading={parsedTableData.length === 0 && channelsFetching}
      />
    </Section>
  );
}

export default ChannelsPage;
