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
import { OpenOrFundChannelModal } from '../../components/Modal/node/OpenOrFundChannelModal';

// Mui
import GetAppIcon from '@mui/icons-material/GetApp';

function ChannelsPage() {
  const dispatch = useAppDispatch();
  const channels = useAppSelector((store) => store.node.channels.data);
  const channelsFetching = useAppSelector((store) => store.node.channels.isFetching);
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const loginData = useAppSelector((store) => store.auth.loginData);
  const [tabIndex, set_tabIndex] = useState(0);
  const tabLabel = tabIndex === 0 ? 'outgoing' : 'incoming';
  const channelsData = tabIndex === 0 ? channels?.outgoing : channels?.incoming;

  const [queryParams, set_queryParams] = useState('');

  const navigate = useNavigate();

  const handleHash = (newTabIndex: number) => {
    const newHash = newTabIndex === 0 ? 'outgoing' : 'incoming';
    navigate(`?${queryParams}#${newHash}`, { replace: true });
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
    const currentHash = window.location.hash;
    const defaultHash = currentHash === '#incoming' || currentHash === '#outgoing' ? currentHash : '#outgoing';

    const defaultTabIndex = defaultHash === '#outgoing' ? 0 : 1;
    set_tabIndex(defaultTabIndex);
    handleHash(defaultTabIndex);

    handleRefresh();
  }, [queryParams]);

  useEffect(() => {}, [tabIndex]);

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

  const getAliasByPeerId = (peerId: string): string => {
    if (aliases) {
      for (const [alias, id] of Object.entries(aliases)) {
        if (id === peerId) {
          return alias;
        }
      }
    }
    return peerId; // Return the peerId if alias not found for the given peerId
  };

  const handleExport = () => {
    if (channelsData) {
      exportToCsv(
        Object.entries(channelsData).map(([, channel]) => ({
          channelId: channel.id,
          peerId: channel.peerId,
          status: channel.status,
          dedicatedFunds: channel.balance,
        })),
        `${tabLabel}-channels.csv`
      );
    }
  };

  const headerIncomming = [
    {
      key: 'key',
      name: '#',
    },
    {
      key: 'peerId',
      name: 'Peer Id',
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

  const parsedTableDataIncomming = Object.entries(channels?.incoming ?? []).map(([, channel], key) => {
    return {
      id: channel.id,
      key: key.toString(),
      peerId: getAliasByPeerId(channel.peerId),
      status: channel.status,
      funds: `${utils.formatEther(channel.balance)} ${HOPR_TOKEN_USED}`,
      actions: (
        <>
          <PingModal peerId={channel.peerId} />
          <OpenOrFundChannelModal
            // peerAddress={channel.peerId} // FIXME: peerId should be peerAddress here
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
              tooltipText={`Export ${tabLabel} channels as a CSV`}
              disabled={!channelsData || Object.keys(channelsData).length === 0}
              onClick={handleExport}
            />
          </>
        }
      />
      <TablePro
        data={parsedTableDataIncomming}
        header={headerIncomming}
        search
        loading={parsedTableDataIncomming.length === 0 && channelsFetching}
      />
    </Section>
  );
}

export default ChannelsPage;
