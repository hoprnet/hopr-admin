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
import { OpenOrFundChannelModal } from '../../components/Modal/node/OpenOrFundChannelModal';
import { OpenMultipleChannelsModal } from '../../components/Modal/node/OpenMultipleChannelsModal';

// Mui
import GetAppIcon from '@mui/icons-material/GetApp';

function ChannelsPage() {
  const dispatch = useAppDispatch();
  const channels = useAppSelector((store) => store.node.channels.data);
  const channelsFetching = useAppSelector((store) => store.node.channels.isFetching);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const [closingStates, set_closingStates] = useState<
    Record<
      string,
      {
        closing: boolean;
        closeSuccess: boolean;
        closeErrors: {
          status: string | undefined;
          error: string | undefined;
        }[];
      }
    >
  >({});
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
  };

  // TODO: update to getAliasByPeerAddress
  // const getAliasByPeerId = (peerId: string): string => {
  //   if (aliases) {
  //     for (const [alias, id] of Object.entries(aliases)) {
  //       if (id === peerId) {
  //         return alias;
  //       }
  //     }
  //   }
  //   return peerId; // Return the peerId if alias not found for the given peerId
  // };

  const handleExport = () => {
    if (channelsData) {
      exportToCsv(
        Object.entries(channelsData).map(([, channel]) => ({
          channelId: channel.id,
          peerAddress: channel.peerAddress,
          status: channel.status,
          dedicatedFunds: channel.balance,
        })),
        `${tabLabel}-channels.csv`
      );
    }
  };

  const handleCloseChannels = (channelId: string) => {
    set_closingStates((prevStates) => ({
      ...prevStates,
      [channelId]: {
        closing: true,
        closeSuccess: false,
        closeErrors: [],
      },
    }));

    dispatch(
      actionsAsync.closeChannelThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
        channelId: channelId,
      })
    )
      .unwrap()
      .then(() => {
        set_closingStates((prevStates) => ({
          ...prevStates,
          [channelId]: {
            closing: false,
            closeSuccess: true,
            closeErrors: [],
          },
        }));
        handleRefresh();
        const msg = `Closing of ${channelId} succeded`;
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
      })
      .catch((e) => {
        set_closingStates((prevStates) => ({
          ...prevStates,
          [channelId]: {
            closing: false,
            closeSuccess: false,
            closeErrors: [
              ...(prevStates[channelId]?.closeErrors || []),
              {
                error: e.error,
                status: e.status,
              },
            ],
          },
        }));
        const msg = `Closing of ${channelId} failed`;
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
      });
  };

  const header = [
    {
      key: 'key',
      name: '#',
    },
    {
      key: 'peerAddress',
      name: 'Peer Address',
      search: true,
      tooltip: true,
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
      width: '168px',
      maxWidth: '168px',
    },
  ];

  const parsedTableData = Object.entries(channels?.outgoing ?? []).map(([, channel], key) => {
    return {
      id: channel.id,
      key: key.toString(),
      peerAddress: channel.peerAddress,
      status: channel.status,
      funds: `${utils.formatEther(channel.balance)} ${HOPR_TOKEN_USED}`,
      actions: (
        <>
          {/* we need a way to get peer id to ping from channel */}
          {/* <PingModal peerId={channel.peerId} /> */}
          <OpenOrFundChannelModal
            peerAddress={channel.peerAddress}
            title="Fund outgoing channel"
            modalBtnText={
              <span>
                FUND
                <br />
                outgoing channel
              </span>
            }
            actionBtnText="Fund outgoing channel"
            type="fund"
          />
          <IconButton
            iconComponent={<CloseChannelIcon />}
            pending={closingStates[channel.id]?.closing}
            tooltipText={
              <span>
                CLOSE
                <br />
                outgoing channel
              </span>
            }
            onClick={() => handleCloseChannels(channel.id)}
          />
        </>
      ),
    };
  });

  return (
    <Section
      className="Channels--aliases"
      id="Channels--aliases"
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title={`OUTGOING CHANNELS`}
        refreshFunction={handleRefresh}
        reloading={channelsFetching}
        actions={
          <>
            <OpenOrFundChannelModal type={'open'} />
            <OpenMultipleChannelsModal />
            <OpenOrFundChannelModal
              type={'fund'}
              title="Fund outgoing channel"
              modalBtnText={
                <span>
                  FUND
                  <br />
                  outgoing channel
                </span>
              }
              actionBtnText="Fund outgoing channel"
            />
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
        header={header}
        search
        loading={parsedTableData.length === 0 && channelsFetching}
      />
    </Section>
  );
}

export default ChannelsPage;
