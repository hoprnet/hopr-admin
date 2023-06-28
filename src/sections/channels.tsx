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
} from '@mui/material'
import Section from '../future-hopr-lib-components/Section';
import { useAppDispatch, useAppSelector } from '../store';
import { useEffect, useRef, useState } from 'react';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { useNavigate } from 'react-router-dom';
import { exportToCsv } from '../utils/helpers';
import CircularProgress from '@mui/material/CircularProgress';
import { ethers } from 'ethers';
import { OpenChannelModal } from '../components/Modal/OpenOrFundChannelModal';

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

  const [queryParams, set_queryParams] = useState('');

  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, newTabIndex: number) => {
    set_tabIndex(newTabIndex);
    handleHash(newTabIndex);
  };

  const handleHash = (newTabIndex: number) => {
    const newHash = newTabIndex === 0 ? 'incoming' : 'outgoing';
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
    const defaultHash = currentHash === '#incoming' || currentHash === '#outgoing' ? currentHash : '#incoming';

    const defaultTabIndex = defaultHash === '#outgoing' ? 1 : 0;
    set_tabIndex(defaultTabIndex);
    handleHash(defaultTabIndex);

    handleRefresh();
  }, [queryParams]);

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

  const exportToCsvButton = () => {
    const tabLabel = tabIndex === 0 ? 'incoming' : 'outgoing';
    const channelsData = tabIndex === 0 ? channels?.incoming : channels?.outgoing;

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
              `${tabLabel}-channels.csv`,
            );
          }
        }}
      >
        export
      </button>
    );
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
    >
      <h2>
        Channels
        <button onClick={handleRefresh}>Refresh</button>
      </h2>
      <Box sx={{ borderColor: 'divider' }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          centered
        >
          <Tab label="Incoming" />
          <Tab label="Outgoing" />
        </Tabs>
      </Box>
      {exportToCsvButton()}
      {tabIndex === 1 && <OpenChannelModal />}
      {tabIndex === 1 && (
        <CSVUploader
          onParse={(parsedData) => {
            console.log(JSON.stringify(parsedData)); // IT WORKS! array of strings representing peerIds
            // if (parsedData && loginData.apiEndpoint && loginData.apiToken) {
            //   dispatch(
            //     actionsAsync.openMultipleChannelsThunk({
            //       peerIds: parsedData,
            //       amount: something_amount,
            //       apiEndpoint: loginData.apiEndpoint,
            //       apiToken: loginData.apiToken,
            //     }),
            //   );
            // }
          }}
        />
      )}
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
          {tabIndex === 0 && (
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
                  <TableCell>{ethers.utils.formatEther(channel.balance)} mHOPR</TableCell>
                  <TableCell>
                    <OpenChannelModal
                      peerId={channel.peerId}
                      title="Open Outgoing Channel"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
          {tabIndex === 1 && (
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
                  <TableCell>{ethers.utils.formatEther(channel.balance)} mHOPR</TableCell>
                  <TableCell>
                    <button onClick={() => handleCloseChannels('outgoing', channel.peerId, channel.channelId)}>
                      Close
                    </button>
                    {closingStates[channel.channelId]?.closing && <CircularProgress />}
                    {closingStates[channel.channelId]?.closeSuccess && <div>Close Success</div>}
                    {closingStates[channel.channelId]?.closeErrors.map((error, index) => (
                      <div key={index}>{error.error}</div>
                    ))}
                    <hr />
                    <OpenChannelModal
                      peerId={channel.peerId}
                      title="Fund Channel"
                      modalBtnText="Fund"
                      actionBtnText="Fund"
                      channelId={channel.channelId}
                    />
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

/**
 * Represents the expected structure of the parsed data.
 */
type ParsedData = string[];

/**
 * Props for the CSVUploader component.
 */
type CSVUploaderProps = {
  /**
   * Callback function called when the CSV data is successfully parsed.
   * @param data The parsed data as an array of strings.
   */
  onParse: (data: ParsedData) => void;
};

/**
 * Component for uploading and parsing CSV data.
 */
function CSVUploader<T extends ParsedData>({ onParse }: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles the file upload event.
   * @param event The file upload event.
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const contents = e.target?.result;
      if (typeof contents === 'string') {
        parseCSV(contents);
      }
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const parseCSV = (csvContent: string) => {
    const lines = csvContent.split('\n');
    const parsedData: string[] = [];

    // gets all keys, csv holds the headers on the first line
    const header = lines[0].split(',');
    const expectedObjectKeys = header.map((key) => key.trim());

    // find the index of the "peerId" header
    const peerIdIndex = expectedObjectKeys.findIndex((key) => key === 'peerId');

    // loop through each line, get the peerId value and add it to parsedData
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length > 1 && peerIdIndex !== -1) {
        const peerId = values[peerIdIndex]?.trim();
        if (peerId) {
          parsedData.push(peerId);
        }
      }
    }

    // after parsing, run the callback function
    onParse(parsedData);

    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <button onClick={handleImportClick}>Open Multiple Channels</button>
      {/* hidden import */}
      <input
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileUpload}
        placeholder="import"
      />
    </div>
  );
}

export default ChannelsPage;
