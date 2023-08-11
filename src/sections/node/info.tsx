import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../../store';

// HOPR Components
import Section from '../../future-hopr-lib-components/Section';
import { useEffect } from 'react';
import { actionsAsync } from '../../store/slices/node/actionsAsync';
import { TableExtended } from '../../future-hopr-lib-components/Table/columed-data';
import { SubpageTitle } from '../../components/SubpageTitle';
import WithdrawModal from '../../components/Modal/WithdrawModal';

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
    >
      <SubpageTitle
        title="INFO"
        refreshFunction={fetchInfoData}
        reloading={isFetchingAnyData}
      />
      <TableExtended
        title="Software"
        style={{ marginBottom: '42px' }}
      >
        <tbody>
          <tr>
            <th>Version</th>
            <td>{version?.replaceAll('"', '')}</td>
          </tr>
          <tr>
            <th>Environment</th>
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
            <th>Eligible</th>
            <td>{info?.isEligible ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <th>Network</th>
            <td>{info?.network}</td>
          </tr>
          <tr>
            <th>Connectivity status</th>
            <td>{info?.connectivityStatus}</td>
          </tr>
          <tr>
            <th>Announced address</th>
            <td>{info?.announcedAddress}</td>
          </tr>
          <tr>
            <th>Listening address</th>
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
            <th>Native</th>
            <td>
              {balances.native?.formatted} xDai <WithdrawModal initialCurrency="NATIVE" />{' '}
            </td>
          </tr>
          <tr>
            <th>Hopr</th>
            <td>
              {balances.hopr?.formatted} wxHOPR <WithdrawModal initialCurrency="HOPR" />{' '}
            </td>
          </tr>
        </tbody>
      </TableExtended>

      <TableExtended
        title="Addresses"
        style={{ marginBottom: '42px' }}
      >
        <tbody>
          <tr>
            <th>PeerId</th>
            <td>{addresses?.hopr}</td>
          </tr>
          <tr>
            <th>Native</th>
            <td>{addresses?.native}</td>
          </tr>
          <tr>
            <th>hoprToken</th>
            <td>{info?.hoprToken}</td>
          </tr>
          <tr>
            <th>hoprChannels</th>
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
            <th>Incoming</th>
            <td>{channels?.incoming.filter((channel) => channel.status === 'Open').length}</td>
          </tr>
          <tr>
            <th>Outgoing</th>
            <td>{channels?.outgoing.filter((channel) => channel.status === 'Open').length}</td>
          </tr>
        </tbody>
      </TableExtended>

      <TableExtended
        title="Peers on the network"
        style={{ marginBottom: '42px' }}
      >
        <tbody>
          <tr>
            <th>Announced</th>
            <td>{peers?.announced.length}</td>
          </tr>
          <tr>
            <th>Connected</th>
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
            <th>Pending count</th>
            <td>{statistics?.pending}</td>
          </tr>
          <tr>
            <th>Unredeemed count</th>
            <td>{statistics?.unredeemed}</td>
          </tr>
          <tr>
            <th>Unredeemed value</th>
            <td>{statistics?.unredeemedValue}</td>
          </tr>
          <tr>
            <th>Redeemed count</th>
            <td>{statistics?.redeemed}</td>
          </tr>
          <tr>
            <th>Redeemed value</th>
            <td>{statistics?.redeemedValue}</td>
          </tr>
          <tr>
            <th>Losing tickets count</th>
            <td>{statistics?.losingTickets}</td>
          </tr>
          <tr>
            <th>Win proportion</th>
            <td>{statistics?.winProportion}</td>
          </tr>
          <tr>
            <th>Neglected count</th>
            <td>{statistics?.neglected}</td>
          </tr>
          <tr>
            <th>Rejected count</th>
            <td>{statistics?.rejected}</td>
          </tr>
          <tr>
            <th>Rejected value</th>
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
    </Section>
  );
}

export default InfoPage;
