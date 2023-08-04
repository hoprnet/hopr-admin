import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../../utils/helpers';
import { utils } from 'ethers';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { SubpageTitle } from '../../components/SubpageTitle';
import { OpenOrFundChannelModal } from '../../components/Modal/OpenOrFundChannelModal';
import IconButton from '../../future-hopr-lib-components/Button/IconButton';
import CloseChannelIcon from '../../future-hopr-lib-components/Icons/CloseChannel';

// Mui
import {
  Box,
  Tabs,
  Tab,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Paper
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import GetAppIcon from '@mui/icons-material/GetApp';


function ChannelsPage() {
  const dispatch = useAppDispatch();
  const channels = useAppSelector((selector) => selector.node.channels);
  const aliases = useAppSelector((selector) => selector.node.aliases);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [tabIndex, set_tabIndex] = useState(0);
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
  const tabLabel = tabIndex === 0 ? 'outgoing' : 'incoming';
  const channelsData = tabIndex === 0 ? channels?.outgoing : channels?.incoming;

  const [queryParams, set_queryParams] = useState('');

  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newTabIndex: number) => {
    set_tabIndex(newTabIndex);
    handleHash(newTabIndex);
  };

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
          channelId: channel.channelId,
          peerId: channel.peerId,
          status: channel.status,
          dedicatedFunds: channel.balance,
        })),
        `${tabLabel}-channels.csv`,
      );
    }
  };

  const handleCloseChannels = (direction: 'incoming' | 'outgoing', peerId: string, channelId: string) => {
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
        direction: direction,
        peerId: peerId,
      }),
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
      });
  };

  return (
    <Section
      className="Channels--aliases"
      id="Channels--aliases"
      yellow
      fullHeightMin
    >
      <SubpageTitle
        title={`Channels`}
        refreshFunction={handleRefresh}
        actions={
          <>
            <OpenOrFundChannelModal 
              type={'open'} 
            />
            <OpenOrFundChannelModal 
              type={'fund'} 
              title="Fund outgoing channel"
              modalBtnText="Fund outgoing channel"
              actionBtnText="Fund outgoing channel"
            />
            <IconButton
              iconComponent={<GetAppIcon />}
              tooltipText={`Export ${tabLabel} channels as a CSV`}
              disabled={!channelsData || Object.keys(channelsData).length === 0}
              onClick={handleExport}
            />
          </>
        }
      />
      <Box sx={{ borderColor: 'divider' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
        >
          <Tab label="Outgoing" />
          <Tab label="Incoming" />
        </Tabs>
      </Box>

      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="aliases table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Peer Id</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Dedicated Funds</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          {tabIndex === 1 && (
            <TableBody>
              {Object.entries(channels?.incoming ?? []).map(([, channel], key) => (
                <TableRow key={key}>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {key}
                  </TableCell>
                  <TableCell>{getAliasByPeerId(channel.peerId)}</TableCell>
                  <TableCell>{channel.status}</TableCell>
                  <TableCell>{utils.formatEther(channel.balance)} mHOPR</TableCell>
                  <TableCell>
                    <OpenOrFundChannelModal
                      peerId={channel.peerId}
                      title="Open outgoing channel"
                      type={'open'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
          {tabIndex === 0 && (
            <TableBody>
              {Object.entries(channels?.outgoing ?? []).map(([, channel], key) => (
                <TableRow key={key}>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    {key}
                  </TableCell>
                  <TableCell>{getAliasByPeerId(channel.peerId)}</TableCell>
                  <TableCell>{channel.status}</TableCell>
                  <TableCell>{utils.formatEther(channel.balance)} mHOPR</TableCell>
                  <TableCell>
                    <OpenOrFundChannelModal
                      peerId={channel.peerId}
                      title="Fund outgoing channel"
                      modalBtnText="Fund outgoing channel"
                      actionBtnText="Fund outgoing channel"
                      type="fund"
                      channelId={channel.channelId}
                    />
                    <IconButton
                      iconComponent={<CloseChannelIcon />}
                      tooltipText={`Close outgoing channel`}
                      onClick={() => handleCloseChannels('outgoing', channel.peerId, channel.channelId)}
                    />
                    {closingStates[channel.channelId]?.closing && <CircularProgress />}
                    {closingStates[channel.channelId]?.closeSuccess && <div>Close Success</div>}
                    {closingStates[channel.channelId]?.closeErrors.map((error, index) => (
                      <div key={index}>{error.error}</div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Section>
  );
}

export default ChannelsPage;
