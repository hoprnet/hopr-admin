import * as React from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from '../../store';
import Drawer from '@mui/material/Drawer';
import styled from '@emotion/styled';
import Toolbar from '@mui/material/Toolbar';
import { ethers } from 'ethers';
import { useBalance } from 'wagmi';
import { utils } from 'ethers';

const drawerWidth = 232;

interface Props {}

const Container = styled(Box)`
  display: none;
  @media screen and (min-width: 600px) {
    display: flex;
  }
`;

const AppBarFiller = styled(Toolbar)`
  min-height: 59px !important;
`;

const SDrawer = styled(Drawer)`
  .MuiDrawer-paper {
    box-sizing: border-box;
    width: 233px;
    font-size: 13px;
    overflow-x: hidden;
  }
  &.node{
    .MuiDrawer-paper {
      background: #ffffa0;
    }
  }
  &.web3{
    .MuiDrawer-paper {
      background: #edfbff;
      border: 0;
    }
  }
`;

const Title = styled.div`
  font-weight: 700;
`;

const Data = styled.div`
  margin-bottom: 24px;
`;

const Web3Container = styled.div`
  background-color: #cadeff;
  border-radius: 1rem;
  display: flex;
  gap: 1rem;
  min-height: 80px;
  min-width: 185px;
  padding: 1rem;
  font-size: 10px;
  margin-right: 8px;
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

const IconContainer = styled.div`
  height: 1rem;
  width: 1rem;
`;

const Icons = styled(FlexColumn)`
  margin-top: 2rem;
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
`;

const Balance = styled(FlexColumn)`
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

const Wallet = styled(Balance)``;

export default function InfoBar(props: Props) {
  const {
    balances,
    peers,
    info,
    channels,
  } = useAppSelector((state) => state.node);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress);
  const account = useAppSelector((selector) => selector.web3.account) as `0x${string}`;
  const web3Connected = useAppSelector((selector) => selector.web3.status.connected);
  const nodeConnected = useAppSelector((store) => store.auth.status.connected);
  const wxhoprSmartContractAddress = '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1';
  const xhoprSmartContractAddress = '0xD057604A14982FE8D88c5fC25Aac3267eA142a08';

  const { data: xDAI_balance } = useBalance({
    address: account,
    watch: true,
  });
  const { data: wxHOPR_balance } = useBalance({
    address: account,
    token: wxhoprSmartContractAddress,
    watch: true,
  });
  const { data: xHOPR_balance } = useBalance({
    address: account,
    token: xhoprSmartContractAddress,
    watch: true,
  });

  const safeXdaiBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    watch: true,
  }).data?.formatted;
  const safeWxHoprBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: wxhoprSmartContractAddress,
    watch: true,
  }).data?.formatted;
  const safexHoprBalance = useBalance({
    address: selectedSafeAddress as `0x${string}`,
    token: xhoprSmartContractAddress,
    watch: true,
  }).data?.formatted;

  const truncateBalance3Decimals = (value: string | undefined) => {
    if (typeof value !== 'undefined' && value.includes('.')) {
      const [before, after] = value.split('.');
      return `${before}.${after.substring(0, 2)}`;
    }
    return value;
  };

  const web3Drawer = (
    <>
      <br/>
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
                <p>{truncateBalance3Decimals(safeWxHoprBalance) ?? 0}</p>
                <p>{truncateBalance3Decimals(safexHoprBalance) ?? 0}</p>
                <p>{truncateBalance3Decimals(safeXdaiBalance) ?? 0}</p>
              </Safe>
            </>
          )}
        </SafeContainer>
        <div>
          <InfoTitle>Wallet</InfoTitle>
          <Wallet>
            <p>{truncateBalance3Decimals(wxHOPR_balance?.formatted) ?? 0}</p>
            <p>{truncateBalance3Decimals(xHOPR_balance?.formatted) ?? 0}</p>
            <p>{truncateBalance3Decimals(xDAI_balance?.formatted) ?? 0}</p>
          </Wallet>
        </div>
      </Web3Container>
    </>
  );

  const nodeDrawer = (
    <div>
      <Title>Status</Title>
      <Data>{info?.connectivityStatus}</Data>

      <Title>xDai balance</Title>
      <Data>{balances?.native && utils.formatEther(balances.native)}</Data>

      <Title>mHOPR balance</Title>
      <Data>{balances?.hopr && utils.formatEther(balances.hopr)}</Data>

      <Title>Peers seen in the network</Title>
      <Data>{peers?.announced?.length || '-'}</Data>

      <Title>Outgoing Chanels</Title>
      <Data>{channels?.outgoing?.length || '-'}</Data>

      <Title>Incoming Chanels</Title>
      <Data>{channels?.incoming?.length || '-'}</Data>
    </div>
  );

  return (
    <Container sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <SDrawer
          variant="permanent"
          anchor={'right'}
          open
          className={`${web3Connected ? 'web3' : ''} ${nodeConnected ? 'node' : ''}`}
        >
          <AppBarFiller />
          {web3Connected && web3Drawer}
          {nodeConnected && !web3Connected && nodeDrawer}
        </SDrawer>
      </Box>
    </Container>
  );
}
