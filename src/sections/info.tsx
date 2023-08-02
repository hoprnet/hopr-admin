import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../store';
import { utils } from 'ethers';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import { useEffect } from 'react';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { TableExtended } from '../future-hopr-lib-components/Table/columed-data';
import { SubpageTitle } from '../components/SubpageTitle';

function InfoPage() {
  const dispatch = useAppDispatch();
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((selector) => selector.auth.loginData);
  const balances = useAppSelector((selector) => selector.node.balances.data);
  const balancesFetching = useAppSelector((selector) => selector.node.balances.isFetching);
  const addresses = useAppSelector((selector) => selector.node.addresses);
  const channels = useAppSelector((selector) => selector.node.channels);
  const version = useAppSelector((selector) => selector.node.version);
  const info = useAppSelector((selector) => selector.node.info);
  const peers = useAppSelector((selector) => selector.node.peers);
  const aliases = useAppSelector((selector) => selector.node.aliases);
  const statistics = useAppSelector((selector) => selector.node.statistics);

  useEffect(() => {
    fetchInfoData();
  }, []);

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
      yellow
      fullHeightMin
    >
      <SubpageTitle
        title="Info"
        refreshFunction={fetchInfoData}
        reloading={balancesFetching}
      />
      <TableExtended
        title="Software"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Version</th>
            <td>{version.data?.replaceAll('"', '')}</td>
          </tr>
          <tr>
            <th>Environment</th>
            <td>{info.data?.environment}</td>
          </tr>
        </tbody>
      </TableExtended>

      <TableExtended
        title="Network"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Eligible</th>
            <td>{info.data?.isEligible ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Network</th>
            <td>{info.data?.network}</td>
          </tr>
          <tr>
            <th>Connectivity status</th>
            <td>{info.data?.connectivityStatus}</td>
          </tr>
          <tr>
            <th>Announced address</th>
            <td>{info.data?.announcedAddress}</td>
          </tr>
          <tr>
            <th>Listening address</th>
            <td>{info.data?.listeningAddress}</td>
          </tr>
        </tbody>
      </TableExtended>

      <TableExtended
        title="Balances"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Native</th>
            <td>{balances.native && utils.formatEther(balances.native)} xDai</td>
          </tr>
          <tr>
            <th>Hopr</th>
            <td>{balances.hopr && utils.formatEther(balances.hopr)} wxHOPR</td>
          </tr>
        </tbody>
      </TableExtended>

      <TableExtended
        title="Addresses"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>PeerId</th>
            <td>{addresses.data?.hopr}</td>
          </tr>
          <tr>
            <th>Native</th>
            <td>{addresses.data?.native}</td>
          </tr>
          <tr>
            <th>hoprToken</th>
            <td>{info.data?.hoprToken}</td>
          </tr>
          <tr>
            <th>hoprChannels</th>
            <td>{info.data?.hoprChannels}</td>
          </tr>
        </tbody>
      </TableExtended>

      <TableExtended
        title="Channels"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Incoming</th>
            <td>{channels.data?.incoming.filter((channel) => channel.status === 'Open').length}</td>
          </tr>
          <tr>
            <th>Outgoing</th>
            <td>{channels.data?.outgoing.filter((channel) => channel.status === 'Open').length}</td>
          </tr>
        </tbody>
      </TableExtended>

      <TableExtended
        title="Peers on the network"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Announced</th>
            <td>{peers.data?.announced.length}</td>
          </tr>
          <tr>
            <th>Connected</th>
            <td>{peers.data?.connected.length}</td>
          </tr>
        </tbody>
      </TableExtended>
      <TableExtended
        title="Tickets"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Pending count</th>
            <td>{statistics.data?.pending}</td>
          </tr>
          <tr>
            <th>Unredeemed count</th>
            <td>{statistics.data?.unredeemed}</td>
          </tr>
          <tr>
            <th>Unredeemed value</th>
            <td>{statistics.data?.unredeemedValue}</td>
          </tr>
          <tr>
            <th>Redeemed count</th>
            <td>{statistics.data?.redeemed}</td>
          </tr>
          <tr>
            <th>Redeemed value</th>
            <td>{statistics.data?.redeemedValue}</td>
          </tr>
          <tr>
            <th>Losing tickets count</th>
            <td>{statistics.data?.losingTickets}</td>
          </tr>
          <tr>
            <th>Win proportion</th>
            <td>{statistics.data?.winProportion}</td>
          </tr>
          <tr>
            <th>Neglected count</th>
            <td>{statistics.data?.neglected}</td>
          </tr>
          <tr>
            <th>Rejected count</th>
            <td>{statistics.data?.rejected}</td>
          </tr>
          <tr>
            <th>Rejected value</th>
            <td>{statistics.data?.rejectedValue}</td>
          </tr>
        </tbody>
      </TableExtended>
      <TableExtended
        title="Aliases"
        style={{ marginBottom: '32px' }}
      >
        <tbody>
          <tr>
            <th>Count</th>
            <td>{Object.keys(aliases.data ?? {}).length}</td>
          </tr>
        </tbody>
      </TableExtended>
    </Section>
  );
}

export default InfoPage;
