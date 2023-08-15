import { useAppDispatch, useAppSelector } from '../../store';

// Mui
import { Paper, Tooltip } from '@mui/material';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { useEffect } from 'react';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { TableExtended } from '../../future-hopr-lib-components/Table/columed-data';
import { SubpageTitle } from '../../components/SubpageTitle';

function InfoPage() {
  const dispatch = useAppDispatch();
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((store) => store.auth.loginData);
  const balances = useAppSelector((store) => store.node.balances.data);
  const balancesFetching = useAppSelector((store) => store.node.balances.isFetching);
  const addresses = useAppSelector((store) => store.node.addresses.data);
  const addressesFetching = useAppSelector((store) => store.node.addresses.isFetching);
  const channels = useAppSelector((store) => store.node.channels.data);
  const channelsFetching = useAppSelector((store) => store.node.channels.isFetching);
  const version = useAppSelector((store) => store.node.version.data);
  const versionFetching = useAppSelector((store) => store.node.version.isFetching);
  const info = useAppSelector((store) => store.node.info.data);
  const infoFetching = useAppSelector((store) => store.node.info.isFetching);
  const peers = useAppSelector((store) => store.node.peers.data);
  const peersFetching = useAppSelector((store) => store.node.peers.isFetching);
  const aliases = useAppSelector((store) => store.node.aliases.data);
  const aliasesFetching = useAppSelector((store) => store.node.aliases.isFetching);
  const statistics = useAppSelector((store) => store.node.statistics.data);
  const statisticsFetching = useAppSelector((store) => store.node.statistics.isFetching);

  useEffect(() => {
    fetchInfoData();
  }, [apiEndpoint, apiToken]);

  const fetchInfoData = () => {
    if (apiEndpoint && apiToken) {
      dispatch(
        actionsAsync.getBalancesThunk({
          apiEndpoint,
          apiToken,
        }),
      );
      dispatch(
        actionsAsync.getChannelsThunk({
          apiEndpoint,
          apiToken,
        }),
      );
      dispatch(
        actionsAsync.getAddressesThunk({
          apiEndpoint,
          apiToken,
        }),
      );
      dispatch(
        actionsAsync.getVersionThunk({
          apiEndpoint,
          apiToken,
        }),
      );
      dispatch(
        actionsAsync.getInfoThunk({
          apiEndpoint,
          apiToken,
        }),
      );
      dispatch(
        actionsAsync.getPeersThunk({
          apiEndpoint,
          apiToken,
        }),
      );
      dispatch(
        actionsAsync.getAliasesThunk({
          apiEndpoint,
          apiToken,
        }),
      );
      dispatch(
        actionsAsync.getStatisticsThunk({
          apiEndpoint,
          apiToken,
        }),
      );
    }
  };

  // This will allow us to improve readability on the reloading prop for SubpageTitle
  const isFetchingAnyData = [
    balancesFetching,
    addressesFetching,
    channelsFetching,
    versionFetching,
    infoFetching,
    peersFetching,
    aliasesFetching,
    statisticsFetching,
  ].includes(true);

  // check if user is logged in
  if (!apiEndpoint || !apiToken) {
    return (
      <Section
        className="Section--selectNode"
        id="Section--selectNode"
        yellow
        fullHeightMin
      >
        Login to node
      </Section>
    );
  }

  return (
    <Section
      className="Section--selectNode"
      id="Section--selectNode"
      fullHeightMin
      yellow
    >
      <SubpageTitle
        title="INFO"
        refreshFunction={fetchInfoData}
        reloading={isFetchingAnyData}
      />
      <Paper
        style={{
          padding: '24px',
          width: 'calc( 100% - 48px )',
        }}
      >
        <TableExtended
          title="Software"
          style={{ marginBottom: '42px' }}
        >
          <tbody>
            <tr>
              <Tooltip title="The version of HOPR your node is running.">
                <th>Version</th>
              </Tooltip>
              <td>{version?.replaceAll('"', '')}</td>
            </tr>
            <tr>
              <Tooltip title="The environment your node is running in.">
                <th>Environment</th>
              </Tooltip>
              <td>{info?.environment}</td>
            </tr>
          </tbody>
        </TableExtended>

        <TableExtended
          title="Network"
          style={{ marginBottom: '42px' }}
        >
          <tbody>
            <tr>
              <Tooltip title="Whether or not your node is eligible to connect to the Monte Rosa network.">
                <th>Eligible</th>
              </Tooltip>
              <td>{info?.isEligible ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
              <Tooltip title="The blockchain network your node is using for on-chain transactions.">
                <th>Blockchain Network</th>
              </Tooltip>
              <td>{info?.network}</td>
            </tr>
            <tr>
              <Tooltip
                title={
                  <span>
                    {[
                      'Unknown: Node has just been started recently',
                      <br />,
                      'Red: No connection',
                      <br />,
                      'Orange: low-quality connection',
                      <br />,
                      'Yellow/Green: High-quality node',
                    ]}
                  </span>
                }
              >
                <th>Connectivity status</th>
              </Tooltip>
              <td>{info?.connectivityStatus}</td>
            </tr>
            <tr>
              <Tooltip title="The address your node announces to make itself reachable for other nodes.">
                <th>Announced address</th>
              </Tooltip>
              <td>{info?.announcedAddress}</td>
            </tr>
            <tr>
              <Tooltip title="The address your node uses to listen for incoming connections.">
                <th>Listening address</th>
              </Tooltip>
              <td>{info?.listeningAddress}</td>
            </tr>
          </tbody>
        </TableExtended>

        <TableExtended
          title="Balances"
          style={{ marginBottom: '42px' }}
        >
          <tbody>
            <tr>
              <Tooltip title="The amount of xDAI stored on your node">
                <th>Native</th>
              </Tooltip>
              <td>{balances.native?.formatted} xDai</td>
            </tr>
            <tr>
              <Tooltip title="The amount of wxHOPR tokens stored on your node">
                <th>Hopr</th>
              </Tooltip>
              <td>{balances.hopr?.formatted} wxHOPR</td>
            </tr>
          </tbody>
        </TableExtended>

        <TableExtended
          title="Addresses"
          style={{ marginBottom: '42px' }}
        >
          <tbody>
            <tr>
              <Tooltip title="Your node's HOPR address, used by other node's to identify your node and send it messages (equivalent to a public key). ">
                <th>HOPR Address</th>
              </Tooltip>
              <td>{addresses?.hopr}</td>
            </tr>
            <tr>
              <Tooltip title="Your node's Ethereum address, this is where you send your node tokens/funds.">
                <th>Node Eth Address</th>
              </Tooltip>
              <td>{addresses?.native}</td>
            </tr>
            <tr>
              <Tooltip title="The contract address of the HOPR token.">
                <th>hoprToken</th>
              </Tooltip>
              <td>{info?.hoprToken}</td>
            </tr>
            <tr>
              <Tooltip title="The contract address of the hoprChannels smart contract.">
                <th>hoprChannels</th>
              </Tooltip>
              <td>{info?.hoprChannels}</td>
            </tr>
          </tbody>
        </TableExtended>

        <TableExtended
          title="Channels"
          style={{ marginBottom: '42px' }}
        >
          <tbody>
            <tr>
              <Tooltip title="The number of incoming channels connected to your node.">
                <th>Incoming</th>
              </Tooltip>
              <td>{channels?.incoming.filter((channel) => channel.status === 'Open').length}</td>
            </tr>
            <tr>
              <Tooltip title="The number of outgoing channels connected to your node.">
                <th>Outgoing</th>
              </Tooltip>
              <td>{channels?.outgoing.filter((channel) => channel.status === 'Open').length}</td>
            </tr>
          </tbody>
        </TableExtended>

        <TableExtended
          title="Nodes on the network"
          style={{ marginBottom: '42px' }}
        >
          <tbody>
            <tr>
              <Tooltip title="The number of announced nodes on the network visible to your node.">
                <th>Announced</th>
              </Tooltip>
              <td>{peers?.announced.length}</td>
            </tr>
            <tr>
              <Tooltip title="The number of nodes on the network your node can reach.">
                <th>Connected</th>
              </Tooltip>
              <td>{peers?.connected.length}</td>
            </tr>
          </tbody>
        </TableExtended>
        <TableExtended
          title="Tickets"
          style={{ marginBottom: '42px' }}
        >
          <tbody>
            <tr>
              <Tooltip title="The number of tickets earned by another node in a channel connected to you which have yet to be redeemed.">
                <th>Pending</th>
              </Tooltip>
              <td>{statistics?.pending}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets earned by your node that have yet to be redeemed.">
                <th>Unredeemed</th>
              </Tooltip>
              <td>{statistics?.unredeemed}</td>
            </tr>
            <tr>
              <Tooltip title="The value of all your unredeemed tickets in HOPR tokens.">
                <th>Unredeemed value</th>
              </Tooltip>
              <td>{statistics?.unredeemedValue}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets redeemed by your node.">
                <th>Redeemed</th>
              </Tooltip>
              <td>{statistics?.redeemed}</td>
            </tr>
            <tr>
              <Tooltip title="The value of all your redeemed tickets.">
                <th>Redeemed value</th>
              </Tooltip>
              <td>{statistics?.redeemedValue}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets which were empty.">
                <th>Losing tickets</th>
              </Tooltip>
              <td>{statistics?.losingTickets}</td>
            </tr>
            <tr>
              <Tooltip title="The percentage of tickets earned by your node that were winning.">
                <th>Win proportion</th>
              </Tooltip>
              <td>{statistics?.winProportion}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets lost due to channels closing without ticket redemption.">
                <th>Neglected</th>
              </Tooltip>
              <td>{statistics?.neglected}</td>
            </tr>
            <tr>
              <Tooltip title="The number of tickets which were rejected by the network due to suspicious activity or lack of eligibility.">
                <th>Rejected</th>
              </Tooltip>
              <td>{statistics?.rejected}</td>
            </tr>
            <tr>
              <Tooltip title="The value of your rejected tickets in HOPR tokens.">
                <th>Rejected value</th>
              </Tooltip>
              <td>{statistics?.rejectedValue}</td>
            </tr>
          </tbody>
        </TableExtended>
        <TableExtended
          title="Aliases"
          style={{ marginBottom: '42px' }}
        >
          <tbody>
            <tr>
              <th>Count</th>
              <td>{Object.keys(aliases ?? {}).length}</td>
            </tr>
          </tbody>
        </TableExtended>
      </Paper>
    </Section>
  );
}

export default InfoPage;
