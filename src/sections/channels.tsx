import {
  Box,
  Tabs,
  Tab,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Table,
  TableHead,
  Paper,
} from '@mui/material';
import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import { useEffect, useRef, useState } from 'react';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { useNavigate, useLocation } from 'react-router-dom';
import { exportToCsv } from '../utils/helpers';
import CircularProgress from '@mui/material/CircularProgress';

function ChannelsPage() {
  const dispatch = useAppDispatch();
  const channels = useAppSelector((selector) => selector.sdk.channels);
  const aliases = useAppSelector((selector) => selector.sdk.aliases);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [tabIndex, setTabIndex] = useState(0);
  const [fundingValues, setFundingValues] = useState<
    Record<string, { incoming: string; outgoing: string }>
  >({});
  const [fundingStates, setFundingStates] = useState<
    Record<
      string,
      {
        funding: boolean;
        fundingSuccess: boolean;
        fundingErrors: {
          status: string | undefined;
          error: string | undefined;
        }[];
      }
    >
  >({});

  const [closingStates, setClosingStates] = useState<
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

  const location = useLocation();
  const navigate = useNavigate();

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    newTabIndex: number
  ) => {
    setTabIndex(newTabIndex);
    handleHash(newTabIndex);
  };

  const handleHash = (newTabIndex: number) => {
    const newHash = newTabIndex === 0 ? 'incoming' : 'outgoing';
    navigate(`#${newHash}`, { replace: true });
  };

  useEffect(() => {
    handleRefresh();
    navigate(`#incoming`, { replace: true });
  }, [loginData]);

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
    for (const [alias, id] of Object.entries(aliases!)) {
      if (id === peerId) {
        return alias;
      }
    }
    return peerId; // Return the peerId if alias not found for the given peerId
  };

  const exportToCsvButton = () => {
    const tabLabel = tabIndex === 0 ? 'incoming' : 'outgoing';
    const channelsData =
      tabIndex === 0 ? channels?.incoming : channels?.outgoing;

    return (
      <button
        disabled={!channelsData || Object.keys(channelsData).length === 0}
        onClick={() => {
          if (channelsData) {
            exportToCsv(
              Object.entries(channelsData).map(([id, channel], key) => ({
                channelId: channel.channelId,
                peerId: channel.peerId,
                status: channel.status,
                dedicatedFunds: channel.balance,
              })),
              `${tabLabel}-channels.csv`
            );
          }
        }}
      >
        export
      </button>
    );
  };

  const handleCloseChannels = (
    direction: 'incoming' | 'outgoing',
    peerId: string,
    channelId: string
  ) => {
    setClosingStates((prevStates) => ({
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
      })
    )
      .unwrap()
      .then(() => {
        setClosingStates((prevStates) => ({
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
        setClosingStates((prevStates) => ({
          ...prevStates,
          [channelId]: {
            closing: false,
            closeSuccess: false,
            closeErrors: [
              ...prevStates[channelId]?.closeErrors,
              {
                error: e.error,
                status: e.status,
              },
            ],
          },
        }));
      });
  };

  const fundChannel = (channelId: string, peerId: string) => {
    return (
      <>
        <div>
          Incoming:
          <input
            type="number"
            value={fundingValues[channelId]?.incoming ?? '0'}
            onChange={(e) => {
              setFundingValues((prevValues) => ({
                ...prevValues,
                [channelId]: {
                  ...prevValues[channelId],
                  incoming: e.target.value,
                },
              }));
            }}
          />
        </div>
        <div>
          Outgoing:
          <input
            type="number"
            value={fundingValues[channelId]?.outgoing ?? '0'}
            onChange={(e) => {
              setFundingValues((prevValues) => ({
                ...prevValues,
                [channelId]: {
                  ...prevValues[channelId],
                  outgoing: e.target.value,
                },
              }));
            }}
          />
        </div>
        <button onClick={() => handleFundChannels(peerId, channelId)}>
          Fund
        </button>
        {fundingStates[channelId]?.funding && <CircularProgress />}
        {fundingStates[channelId]?.fundingSuccess && <div>Funding Success</div>}
        {fundingStates[channelId]?.fundingErrors.map((error, index) => (
          <div key={index}>{error.error}</div>
        ))}
      </>
    );
  };

  const handleFundChannels = (peerId: string, channelId: string) => {
    setFundingStates((prevStates) => ({
      ...prevStates,
      [channelId]: {
        funding: true,
        fundingSuccess: false,
        fundingErrors: [],
      },
    }));

    const parsedIncoming =
      parseFloat(fundingValues[channelId]?.incoming ?? '0') >= 0
        ? fundingValues[channelId]?.incoming ?? '0'
        : '0';

    const parsedOutgoing =
      parseFloat(fundingValues[channelId]?.outgoing ?? '0') >= 0
        ? fundingValues[channelId]?.outgoing ?? '0'
        : '0';

    dispatch(
      actionsAsync.fundChannelsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
        peerId: peerId,
        incomingAmount: parsedIncoming,
        outgoingAmount: parsedOutgoing,
      })
    )
      .unwrap()
      .then(() => {
        setFundingStates((prevStates) => ({
          ...prevStates,
          [channelId]: {
            funding: false,
            fundingSuccess: true,
            fundingErrors: [],
          },
        }));
        handleRefresh();
      })
      .catch((e) => {
        setFundingStates((prevStates) => ({
          ...prevStates,
          [channelId]: {
            funding: false,
            fundingSuccess: false,
            fundingErrors: [
              ...prevStates[channelId]?.fundingErrors,
              {
                error: e.error,
                status: e.status,
              },
            ],
          },
        }));
      })
      .finally(() => {
        setFundingValues((prevValues) => ({
          ...prevValues,
          [channelId]: {
            incoming: '0',
            outgoing: '0',
          },
        }));
      });
  };

  return (
    <Section className="Channels--aliases" id="Channels--aliases" yellow>
      <h2>
        Channels
        <button onClick={handleRefresh}>Refresh</button>
      </h2>
      <Box sx={{ borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Incoming" />
          <Tab label="Outgoing" />
        </Tabs>
      </Box>
      {exportToCsvButton()}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="aliases table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>peerId</TableCell>
              <TableCell>status</TableCell>
              <TableCell>dedicated funds</TableCell>
              <TableCell>actions</TableCell>
            </TableRow>
          </TableHead>
          {tabIndex === 0 && (
            <TableBody>
              {Object.entries(channels?.incoming ?? []).map(
                ([id, channel], key) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      {key}
                    </TableCell>
                    <TableCell>{getAliasByPeerId(channel.peerId)}</TableCell>
                    <TableCell>{channel.status}</TableCell>
                    <TableCell>{channel.balance}</TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          handleCloseChannels(
                            'incoming',
                            channel.peerId,
                            channel.channelId
                          )
                        }
                      >
                        Close
                      </button>
                      {closingStates[channel.channelId]?.closing && (
                        <CircularProgress />
                      )}
                      {closingStates[channel.channelId]?.closeSuccess && (
                        <div>Close Success</div>
                      )}
                      {closingStates[channel.channelId]?.closeErrors.map(
                        (error, index) => (
                          <div key={index}>{error.error}</div>
                        )
                      )}
                      <hr />
                      {fundChannel(channel.channelId, channel.peerId)}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          )}
          {tabIndex === 1 && (
            <TableBody>
              {Object.entries(channels?.outgoing ?? []).map(
                ([id, channel], key) => (
                  <TableRow key={key}>
                    <TableCell component="th" scope="row">
                      {key}
                    </TableCell>
                    <TableCell>{getAliasByPeerId(channel.peerId)}</TableCell>
                    <TableCell>{channel.status}</TableCell>
                    <TableCell>{channel.balance}</TableCell>
                    <TableCell>
                      <button
                        onClick={() =>
                          handleCloseChannels(
                            'outgoing',
                            channel.peerId,
                            channel.channelId
                          )
                        }
                      >
                        Close
                      </button>
                      {closingStates[channel.channelId]?.closing && (
                        <CircularProgress />
                      )}
                      {closingStates[channel.channelId]?.closeSuccess && (
                        <div>Close Success</div>
                      )}
                      {closingStates[channel.channelId]?.closeErrors.map(
                        (error, index) => (
                          <div key={index}>{error.error}</div>
                        )
                      )}
                      <hr />
                      {fundChannel(channel.channelId, channel.peerId)}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>
    </Section>
  );
}

export default ChannelsPage;
