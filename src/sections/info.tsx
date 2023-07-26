import styled from '@emotion/styled';
import { useAppDispatch, useAppSelector } from '../store';

// HOPR Components
import Section from '../future-hopr-lib-components/Section';
import { useEffect } from 'react';
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { TableExtended } from '../future-hopr-lib-components/Table/columed-data';

import { utils } from 'ethers';


const InfoBrick = styled.div`
  min-width: 240px;
  background-color: white;
  border-radius: 16px;
  border: solid 1px #00005091;
  box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12);
  padding: 16px;
  .title {
    color: #010188;
    padding-bottom: 8px;
    border-bottom: solid 1px #00005091;
  }
`

const Title = styled.div`

`


function InfoPage() {
  const dispatch = useAppDispatch();
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((selector) => selector.auth.loginData);
  const balances = useAppSelector((selector) => selector.node.balances);
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
      <h2>
        Info <button onClick={fetchInfoData}>refresh</button>{' '}
      </h2>
        <TableExtended
          title='Software'
          style={{marginBottom: '32px'}}
        >
          <tbody>
            <tr>
              <th>Version</th>
              <td>{version?.replaceAll('"','')}</td>
            </tr>
            <tr>
              <th>Environment</th>
              <td>{info?.environment}</td>
            </tr>
          </tbody>
        </TableExtended>

        <TableExtended
          title='Network'
          style={{marginBottom: '32px'}}
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
          title='Balances'
          style={{marginBottom: '32px'}}
        >
          <tbody>
            <tr>
              <th>Native</th>
              <td>{balances?.native && utils.formatEther(balances.native)} xDai</td>
            </tr>
            <tr>
              <th>Hopr</th>
              <td>{balances?.hopr && utils.formatEther(balances.hopr)} wxHOPR</td>
            </tr>
          </tbody>
        </TableExtended>

        <TableExtended
          title='Addresses'
          style={{marginBottom: '32px'}}
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
          title='Channels'
          style={{marginBottom: '32px'}}
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
          title='Peers on the network'
          style={{marginBottom: '32px'}}
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
          title='Tickets'
          style={{marginBottom: '32px'}}
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
              <th>Neglected  count</th>
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
          title='Aliases'
          style={{marginBottom: '32px'}}
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
