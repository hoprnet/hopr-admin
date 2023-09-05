import { useAppSelector } from '../../store';
import styled from '@emotion/styled';

interface Props {
  style?: object;
}

const Web3Container = styled.div`
  background-color: #cadeff;
  border-radius: 1rem;
  display: flex;
  gap: 8px;
  width: calc(190px + 2 * 8px);
  padding: 8px;
  font-size: 12px;
  /* margin-right: 8px; */
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;

const IconContainer = styled.div`
  height: 1rem;
  width: 1rem;
`;

const TitleColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 38px;
  width: 100%;
  max-width: 78px;
  &.node {
    max-width: 112px;
  }
`;

const IconAndText = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

const Icon = styled.img`
  display: block;
  height: 100%;
  width: 100%;
`;

const Text = styled.p`
  font-weight: 600;
`;

const DataColumn = styled.div<{ show?: boolean }>`
  visibility: ${(props) => (props.show === false ? 'hidden' : 'visible')};
  display: flex;
  flex-direction: column;
  width: 56px;
`;

const DataTitle = styled.p`
  text-transform: uppercase;
  font-weight: 600;
  margin-right: 5px;
  margin-bottom: 4px;
  margin-top: 20px;
`;

const Data = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ddeaff;
  text-align: right;
  padding: 0 8px;
  width: calc(56px - 2 * 8px);
  border-radius: 1rem 1rem 1rem 1rem;
  flex-grow: 1;
  &.nodeOnly {
    width: 66px;
  }
  p.double {
    line-height: 2;
  }
  p {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

// TODO: make batter to work with balances
const truncateBalanceto5charsWhenNoDecimals = (value: string | number | undefined | null) => {
  try {
    if (value && BigInt(value)) {
      if (BigInt(value) > BigInt(1e9)) {
        return '1e9+';
      } else if (BigInt(value) >= BigInt(1e6)) {
        // @ts-ignore
        const tmp = (parseInt(value) / 1e6).toString();
        if (tmp.includes('.')) {
          const [before, after] = tmp.split('.');
          if (before.length === 3) return before + 'm';
          return `${before}.${after.substring(0, 1)}m`;
        } else {
          if (tmp.length === 3) return `${tmp}3m`;
          return `${tmp}.0m`;
        }
      } else if (BigInt(value) > BigInt(99999)) {
        // @ts-ignore
        const tmp = (parseInt(value) / 1e3).toString();
        if (tmp.includes('.')) {
          const [before, after] = tmp.split('.');
          if (before.length === 3) return before + 'k';
          return `${before}.${after.substring(0, 1)}k`;
        } else {
          if (tmp.length === 3) return `${tmp}k`;
          return `${tmp}.0k`;
        }
      }
      return value;
    }
  } catch (e) {
    console.warn('Error while paring data to BigInt for InfoBar');
  }
  return value;
};

export default function Details(props: Props) {
  const channels = useAppSelector((store) => store.node.channels.data);
  const peers = useAppSelector((store) => store.node.peers.data);
  const balances = useAppSelector((store) => store.node.balances.data);
  const info = useAppSelector((store) => store.node.info.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const web3Connected = useAppSelector((store) => store.web3.status.connected);
  const nodeConnected = useAppSelector((store) => store.auth.status.connected);
  const walletBalance = useAppSelector((store) => store.web3.balance);
  const safeBalance = useAppSelector((store) => store.safe.balance.data);

  const web3Drawer = (
    <Web3Container style={props.style}>
      <TitleColumn className="web3">
        <IconAndText>
          <IconContainer>
            <Icon
              src="/assets/wxHoprIcon.svg"
              alt="wxHOPR Icon"
            />
          </IconContainer>
          <Text>wxHOPR</Text>
        </IconAndText>
        <IconAndText>
          <IconContainer>
            <Icon
              src="/assets/xHoprIcon.svg"
              alt="xHOPR Icon"
            />
          </IconContainer>
          <Text>xHOPR</Text>
        </IconAndText>
        <IconAndText>
          <IconContainer>
            <Icon
              src="/assets/xDaiIcon.svg"
              alt="xDai Icon"
            />
          </IconContainer>
          <Text>xDAI</Text>
        </IconAndText>
      </TitleColumn>
      <DataColumn show={!!selectedSafeAddress}>
        {selectedSafeAddress && (
          <>
            <DataTitle>Safe</DataTitle>
            <Data>
              <p>{safeBalance.wxHopr.formatted ?? '-'}</p>
              <p>{safeBalance.xHopr.formatted ?? '-'}</p>
              <p>{safeBalance.xDai.formatted ?? '-'}</p>
            </Data>
          </>
        )}
      </DataColumn>
      <DataColumn>
        <DataTitle>Wallet</DataTitle>
        <Data>
          <p>{walletBalance.wxHopr.formatted ?? '-'}</p>
          <p>{walletBalance.xHopr.formatted ?? '-'}</p>
          <p>{walletBalance.xDai.formatted ?? '-'}</p>
        </Data>
      </DataColumn>
    </Web3Container>
  );

  const nodeDrawer = (
    <Web3Container style={props.style}>
      <TitleColumn className="node">
        <IconAndText>
          <IconContainer></IconContainer>
          <Text>Status</Text>
        </IconAndText>
        <IconAndText>
          <IconContainer>
            <Icon
              src="/assets/xDaiIcon.svg"
              alt="xDai Icon"
            />
          </IconContainer>
          <Text>xDAI</Text>
        </IconAndText>
        <IconAndText>
          <IconContainer></IconContainer>
          <Text>Peers</Text>
        </IconAndText>
        <IconAndText>
          <IconContainer></IconContainer>
          <Text>Outgoing Channels</Text>
        </IconAndText>
        <IconAndText>
          <IconContainer></IconContainer>
          <Text>Incoming Channels</Text>
        </IconAndText>
      </TitleColumn>
      <DataColumn>
        <DataTitle>Node</DataTitle>
        <Data className="nodeOnly">
          <p>{info?.connectivityStatus}</p>
          <p>{balances.native?.formatted ?? '-'}</p>
          <p>{truncateBalanceto5charsWhenNoDecimals(peers?.announced?.length) || '-'}</p>
          <p className="double">{truncateBalanceto5charsWhenNoDecimals(channels?.outgoing?.length) || '-'}</p>
          <p className="double">{truncateBalanceto5charsWhenNoDecimals(channels?.incoming?.length) || '-'}</p>
        </Data>
      </DataColumn>
    </Web3Container>
  );

  return (
    <>
      {web3Connected && web3Drawer}
      {nodeConnected && !web3Connected && nodeDrawer}
    </>
  );
}
