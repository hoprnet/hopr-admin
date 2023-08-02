import * as React from 'react';
import Box from '@mui/material/Box';
import { useAppDispatch, useAppSelector } from '../../store';
import Drawer from '@mui/material/Drawer';
import styled from '@emotion/styled';
import Toolbar from '@mui/material/Toolbar';
import { utils } from 'ethers';
import WithdrawModal from '../../sections/safeWithdrawCamilo';

const drawerWidth = 160;

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
    width: 161px;
    background: #ffffa0;
    font-size: 13px;
  }
`;

const Title = styled.div`
  font-weight: 700;
`;

const Data = styled.div`
  margin-bottom: 24px;
`;

export default function InfoBar(props: Props) {
  const {
    balances,
    peers,
    info,
    channels,
  } = useAppSelector((state) => state.node);

  const drawer = (
    <div>
      <AppBarFiller />
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
        >
          {drawer}
        </SDrawer>
      </Box>
    </Container>
  );
}
