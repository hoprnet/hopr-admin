import { useAppSelector } from '../../store';
import styled from '@emotion/styled';

// Mui
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import FAQ from '../Faq';
import infoDataRaw from '../Faq/info.json'; // Import your info.json data

type InfoData = {
  [routePath: string]: {
    id: number;
    title: string;
    content: string;
  }[];
};

interface Props {}

const AppBarFiller = styled(Toolbar)`
  min-height: 20px !important;
`;

const SInfoBar = styled.div`
  display: none;
  width: 233px;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  box-sizing: border-box;
  overflow-x: hidden;
  &.node {
    background: #ffffa0;
    border: 0;
  }
  &.web3 {
    background: #edfbff;
    border: 0;
  }
  @media (min-width: 740px) {
    display: block;
  }
`;

const Web3Container = styled.div`
  background-color: #cadeff;
  border-radius: 1rem;
  display: flex;
  gap: 1rem;
  min-height: 80px;
  min-width: 200px;
  padding: 1rem;
  font-size: 12px;
  margin-right: 8px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14),
    0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;

const IconContainer = styled.div`
  height: 1rem;
  width: 1rem;
`;

const Icons = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 38px;
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

const InfoTitle = styled.p`
  text-transform: uppercase;
  font-weight: 600;
  margin-right: 5px;
  margin-bottom: 4px;
  margin-top: 20px;
`;

const Balance = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #ddeaff;
  text-align: right;
  padding: 0rem 1rem;
  border-radius: 1rem 1rem 1rem 1rem;
`;

const SafeContainer = styled.div<{ show: boolean }>`
  visibility: ${(props) => (props.show ? 'visible' : 'hidden')};
  width: 56px;
`;

const Safe = styled(Balance)``;

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wallet = styled(Balance)`
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

export default function InfoBar(props: Props) {
  const channels = useAppSelector((store) => store.node.channels.data);
  const peers = useAppSelector((store) => store.node.peers.data);
  const balances = useAppSelector((store) => store.node.balances.data);
  const info = useAppSelector((store) => store.node.info.data);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const account = useAppSelector((store) => store.web3.account) as `0x${string}`;
  const web3Connected = useAppSelector((store) => store.web3.status.connected);
  const nodeConnected = useAppSelector((store) => store.auth.status.connected);
  const walletBalance = useAppSelector((store) => store.web3.balance);
  const safeBalance = useAppSelector((store) => store.safe.balance.data);
  const currentRoute = useLocation().pathname;

  const infoData: InfoData = infoDataRaw;

  const truncateBalance3Decimals = (value: string | undefined | null) => {
    if (value && value.includes('.')) {
      const [before, after] = value.split('.');
      return `${before}.${after.substring(0, 2)}`;
    }
    return value;
  };

  const pageHasFAQ = () => {
    if (infoData[currentRoute]) return true;
    return false;
  };

  const web3Drawer = (
    <>
      <br />
      <Web3Container>
        <Icons>
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
        </Icons>
        <SafeContainer show={!!selectedSafeAddress}>
          {selectedSafeAddress && (
            <>
              <InfoTitle>Safe</InfoTitle>
              <Safe>
                <p>{truncateBalance3Decimals(safeBalance.wxHopr.formatted) ?? '-'}</p>
                <p>{truncateBalance3Decimals(safeBalance.xHopr.formatted) ?? '-'}</p>
                <p>{truncateBalance3Decimals(safeBalance.xDai.formatted) ?? '-'}</p>
              </Safe>
            </>
          )}
        </SafeContainer>
        <DataContainer>
          <InfoTitle>Wallet</InfoTitle>
          <Wallet>
            <p>{truncateBalance3Decimals(walletBalance.wxHopr.formatted) ?? '-'}</p>
            <p>{truncateBalance3Decimals(walletBalance.xHopr.formatted) ?? '-'}</p>
            <p>{truncateBalance3Decimals(walletBalance.xDai.formatted) ?? '-'}</p>
          </Wallet>
        </DataContainer>
      </Web3Container>
    </>
  );

  const nodeDrawer = (
    <>
      <br />
      <Web3Container>
        <Icons>
          <IconAndText>
            <IconContainer></IconContainer>
            <Text>Status</Text>
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
          <IconAndText>
            <IconContainer></IconContainer>
            <Text>Peers</Text>
          </IconAndText>
          <IconAndText>
            <IconContainer></IconContainer>
            <Text>Outgoing Chanels</Text>
          </IconAndText>
          <IconAndText>
            <IconContainer></IconContainer>
            <Text>Incoming Chanels</Text>
          </IconAndText>
        </Icons>
        <DataContainer>
          <InfoTitle>Node</InfoTitle>
          <Wallet className="nodeOnly">
            <p>{info?.connectivityStatus}</p>
            <p>{balances.native?.formatted ?? '-'}</p>
            <p>{balances.hopr?.formatted ?? '-'}</p>
            <p>{peers?.announced?.length || '-'}</p>
            <p className="double">{channels?.outgoing?.length || '-'}</p>
            <p className="double">{channels?.incoming?.length || '-'}</p>
          </Wallet>
        </DataContainer>
      </Web3Container>
    </>
  );

  return (
    <SInfoBar className={`InfoBar ${web3Connected ? 'web3' : ''} ${nodeConnected ? 'node' : ''}`}>
      <AppBarFiller />
      {web3Connected && web3Drawer}
      {nodeConnected && !web3Connected && nodeDrawer}
      {nodeConnected && pageHasFAQ() && (
        <FAQ
          data={infoData[currentRoute]}
          label={currentRoute.split('/')[currentRoute.split('/').length - 1]}
          variant="blue"
        />
      )}
    </SInfoBar>
  );
}
