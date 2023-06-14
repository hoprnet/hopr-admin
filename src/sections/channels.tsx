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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import { useEffect, useState } from 'react';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../utils/helpers';
import CircularProgress from '@mui/material/CircularProgress';

function ChannelsPage() {
  const dispatch = useAppDispatch();
  const channels = useAppSelector((selector) => selector.node.channels);
  const aliases = useAppSelector((selector) => selector.node.aliases);
  const loginData = useAppSelector((selector) => selector.auth.loginData);
  const [tabIndex, setTabIndex] = useState(0);
  const [openFundingPopups, set_openFundingPopups] = useState<
    Record<string, boolean>
  >({});
  const [fundingAmount, set_fundingAmount] = useState('');
  const [fundingStates, set_fundingStates] = useState<
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
  const [peerId, set_peerId] = useState('');
  const [amount, set_amount] = useState('');
  const [openChannelDialog, set_openChannelDialog] = useState(false);
  const [channelOpening, set_channelOpening] = useState(false);
  const [openingErrors, set_openingErrors] = useState<
    { status: string | undefined; error: string | undefined }[]
  >([]);
  const [openingSuccess, set_openingSucess] = useState(false);

  const navigate = useNavigate();

  const handleOpenFundingPopup = (channelId: string) => {
    set_openFundingPopups((prevOpenPopups) => ({
      ...prevOpenPopups,
      [channelId]: true,
    }));
  };

  const closeFundingPopup = (channelId: string) => {
    set_openFundingPopups((prevOpenPopups) => ({
      ...prevOpenPopups,
      [channelId]: false,
    }));
    set_fundingAmount('');
  };

  const handleOpenChannelDialog = () => {
    set_openChannelDialog(true);
  };

  const handleCloseChannelDialog = () => {
    set_openChannelDialog(false);
  };

  const openChannelPopUp = () => {
    return (
      <>
        <button onClick={handleOpenChannelDialog}>Open Channel</button>
        <Dialog open={openChannelDialog} onClose={handleCloseChannelDialog}>
          <DialogTitle>Open Channel</DialogTitle>
          <DialogContent>
            <TextField
              label="Peer ID"
              value={peerId}
              onChange={(e) => set_peerId(e.target.value)}
            />
            <TextField
              label="Amount"
              value={amount}
              onChange={(e) => set_amount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <button onClick={handleCloseChannelDialog}>Cancel</button>
            <button
              onClick={() => handleOpenChannel(amount, peerId)}
              disabled={!amount || parseFloat(amount) <= 0 || !peerId}
            >
              Open Channel
            </button>
          </DialogActions>
        </Dialog>
        {channelOpening && <CircularProgress />}
        {openingSuccess && <div>Opening Channel Success</div>}
        {openingErrors.map((error, index) => (
          <div key={index}>{error.error}</div>
        ))}
      </>
    );
  };

  const handleOpenChannel = (amount: string, peerId: string) => {
    set_channelOpening(true); // Set loading state

    dispatch(
      actionsAsync.openChannelThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
        amount: amount,
        peerId: peerId,
      })
    )
      .unwrap()
      .then(() => {
        // handle success opening channel
        set_channelOpening(false);
        set_openingSucess(true);
        set_openingErrors([]);
        handleRefresh();
      })
      .catch((e) => {
        set_openingSucess(false);
        set_openingErrors([
          ...openingErrors,
          {
            error: e.error,
            status: e.status,
          },
        ]);
        set_channelOpening(false);
        //handle error on opening channel});
      });
  };

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
    if (aliases) {
      for (const [alias, id] of Object.entries(aliases)) {
        if (id === peerId) {
          return alias;
        }
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
              Object.entries(channelsData).map(([, channel]) => ({
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

  const fundChannel = (channelId: string, peerId: string) => {
    return (
      <>
        <button onClick={() => handleOpenFundingPopup(channelId)}>Fund</button>
        <Dialog
          open={openFundingPopups[channelId] || false}
          onClose={() => closeFundingPopup(channelId)}
        >
          <DialogTitle>Fund Channel</DialogTitle>
          <DialogContent>
            <TextField
              label="Funding Amount"
              type="number"
              value={fundingAmount}
              onChange={(e) => set_fundingAmount(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <button onClick={() => closeFundingPopup(channelId)}>Cancel</button>
            <button
              onClick={() => handleFundChannels(peerId, channelId)}
              disabled={!fundingAmount || parseFloat(fundingAmount) <= 0}
            >
              Fund
            </button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  const handleFundChannels = (peerId: string, channelId: string) => {
    const parsedOutgoing =
      parseFloat(fundingAmount ?? '0') >= 0 ? fundingAmount ?? '0' : '0';

    dispatch(
      actionsAsync.fundChannelsThunk({
        apiEndpoint: loginData.apiEndpoint!,
        apiToken: loginData.apiToken!,
        peerId: peerId,
        incomingAmount: '0',
        outgoingAmount: parsedOutgoing,
      })
    )
      .unwrap()
      .then(() => {
        set_fundingStates((prevStates) => ({
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
        set_fundingStates((prevStates) => ({
          ...prevStates,
          [channelId]: {
            funding: false,
            fundingSuccess: false,
            fundingErrors: [
              ...(prevStates[channelId]?.fundingErrors || []),
              {
                error: e.error,
                status: e.status,
              },
            ],
          },
        }));
      })
      .finally(() => {
        closeFundingPopup(channelId);
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
      {tabIndex === 1 && openChannelPopUp()}
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
                ([, channel], key) => (
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
                      {fundingStates[channel.channelId]?.funding && (
                        <CircularProgress />
                      )}
                      {fundingStates[channel.channelId]?.fundingSuccess && (
                        <div>Funding Success</div>
                      )}
                      {fundingStates[channel.channelId]?.fundingErrors.map(
                        (error, index) => (
                          <div key={index}>{error.error}</div>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          )}
          {tabIndex === 1 && (
            <TableBody>
              {Object.entries(channels?.outgoing ?? []).map(
                ([, channel], key) => (
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
