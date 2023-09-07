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
import { OpenOrFundChannelModal } from '../../components/Modal/node/OpenOrFundChannelModal';

// Mui
import GetAppIcon from '@mui/icons-material/GetApp';

function ChannelsPage() {
  const dispatch = useAppDispatch();
  const channels = useAppSelector((store) => store.node.channels.data);
  const channelsFetching = useAppSelector((store) => store.node.channels.isFetching);
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
        `${tabLabel}-channels.csv`,
      );
    }
  };

  const headerIncoming = [
    {
      key: 'key',
      name: '#',
    },
    {
      key: 'peerAddress',
      name: 'Peer Address',
      search: true,
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
      key: 'actions',
      name: 'Actions',
      search: false,
      width: '168px',
      maxWidth: '168px',
    },
  ];

  const parsedTableDataIncoming = Object.entries(channels?.incoming ?? []).map(([, channel], key) => {
    return {
      id: channel.id,
      key: key.toString(),
      peerAddress: channel.peerAddress,
      status: channel.status,
      funds: `${utils.formatEther(channel.balance)} ${HOPR_TOKEN_USED}`,
      actions: (
        <>
          {/* we need a peer id from channels to make this work
          <PingModal /> */}
          <OpenOrFundChannelModal
            peerAddress={channel.peerAddress}
            title="Open outgoing channel"
            type={'open'}
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
        data={parsedTableDataIncoming}
        header={headerIncoming}
        search
        loading={parsedTableDataIncoming.length === 0 && channelsFetching}
      />
    </Section>
  );
}

export default ChannelsPage;
