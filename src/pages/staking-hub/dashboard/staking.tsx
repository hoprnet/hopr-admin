import { ReactNode, useState } from 'react';
import { useAppSelector } from '../../../store';
import styled from '@emotion/styled';
import { rounder } from '../../../utils/functions';

import Chart from 'react-apexcharts';
import { Card, Chip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';

import BuyXHopr from '../../../components/Modal/staking-hub/BuyXHopr';
import { GrayCard } from '../../../future-hopr-lib-components/Cards/GrayCard';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;

  .safe-and-module-addresses {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const FlexContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

const SafeAddress = styled.p`
  font-weight: 700;
  margin: 0;
  overflow-wrap: anywhere;
`;

const StyledIconButton = styled(IconButton)`
  width: 26px;
  height: 26px;
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Content = styled.div`
  display: grid;
  flex-direction: column;
  gap: 2rem;
  grid-template-columns: repeat(2, 1fr);

  #wxhopr-total-stake {
    grid-column: 1;
  }

  #xdai-in-safe {
    grid-column: 2;
  }

  #redeemed-tickets {
    grid-column: 1;
  }

  #redeemed-tickets {
    grid-column: 1;
  }

  #earned-rewards {
    grid-column: 2;
  }

  #remaining-wxhopr-allowance {
    grid-column: 1;
  }

  @media screen and (max-width: 1350px) {
    grid-template-columns: repeat(1, 1fr);
    #xdai-in-safe {
      grid-column: 1;
    }
    #earned-rewards {
      grid-column: 1;
    }
  }
`;

const ChartContainer = styled.div`
  width: 100%;
`;

const ColumnChart = () => {
  // Dummy data, modify this to make the graph look cool.
  const options = {
    chart: { id: 'column-chart' },
    xaxis: { categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998] },
  };
  const series = [
    {
      name: 'Stake development',
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ];
  return (
    <ChartContainer>
      <Chart
        options={options}
        series={series}
        type="bar"
        height="300"
      />
    </ChartContainer>
  );
};

const StakingScreen = () => {
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress) as `0x${string}`;
  const moduleAddress = useAppSelector((store) => store.safe.selectedSafe.data.moduleAddress) as `0x${string}`;
  const safeBalance = useAppSelector((store) => store.safe.balance.data);
  const wxHoprAllowance = useAppSelector((store) => store.stakingHub.safeInfo.data.allowance.wxHoprAllowance);
  const [openBuyModal, set_openBuyModal] = useState(false);

  return (
    <Container>
      {selectedSafeAddress && (
        <div className="safe-and-module-addresses">
          <FlexContainer>
            <SafeAddress>Safe address: {selectedSafeAddress}</SafeAddress>
            <div>
              <StyledIconButton
                size="small"
                onClick={() => navigator.clipboard.writeText(selectedSafeAddress)}
              >
                <CopyIcon />
              </StyledIconButton>
              <StyledIconButton size="small">
                <Link
                  to={`https://gnosisscan.io/address/${selectedSafeAddress}`}
                  target="_blank"
                >
                  <LaunchIcon />
                </Link>
              </StyledIconButton>
            </div>
          </FlexContainer>
          <FlexContainer style={{}}>
            <SafeAddress>Module address: {moduleAddress}</SafeAddress>
            <div>
              <StyledIconButton
                size="small"
                onClick={() => navigator.clipboard.writeText(moduleAddress)}
              >
                <CopyIcon />
              </StyledIconButton>
              <StyledIconButton size="small">
                <Link
                  to={`https://gnosisscan.io/address/${moduleAddress}`}
                  target="_blank"
                >
                  <LaunchIcon />
                </Link>
              </StyledIconButton>
            </div>
          </FlexContainer>
        </div>
      )}
      <Content>
        <GrayCard
          id="wxhopr-total-stake"
          title="wxHOPR Total Stake"
          value={rounder(safeBalance.wxHopr.formatted, 6) ?? '-'}
          valueTooltip={safeBalance.wxHopr.formatted || '-'}
          currency={'wxHOPR'}
          // chip={{
          //   label: '+%/24h',
          //   color: 'success',
          // }}
          buttons={[
            {
              text: 'Buy xHOPR',
              onClick: () => {
                set_openBuyModal(true);
              },
            },
            {
              text: 'Wrap xHOPR',
              link: '/staking/wrapper',
            },
            {
              text: 'Deposit',
              link: '/staking/stake-wxHOPR',
            },
            {
              text: 'Withdraw',
              link: '/staking/withdraw?token=wxhopr',
            },
          ]}
        />
        <GrayCard
          id="xdai-in-safe"
          title="xDAI in Safe"
          value={rounder(safeBalance.xDai.formatted, 6) ?? '-'}
          valueTooltip={safeBalance.xDai.formatted || '-'}
          currency={'xDAI'}
          buttons={[
            {
              text: 'Buy xDAI',
              onClick: () => {
                set_openBuyModal(true);
              },
            },
            {
              text: 'Deposit',
              link: '/staking/stake-xDAI',
            },
            {
              text: 'Withdraw',
              link: '/staking/withdraw?token=xdai',
            },
          ]}
        />
        {/* <GrayCard
          id="redeemed-tickets"
          title="Redeemed Tickets"
          value="-"
        // chip={{
        //   label: '+%/24h',
        //   color: 'success',
        // }}
        />
        <GrayCard
          id="earned-rewards"
          title="Earned rewards"
          value="-"
          currency="wxHOPR"
        // chip={{
        //   label: '-%/24h',
        //   color: 'error',
        // }}
        /> */}
        <GrayCard
          id="remaining-wxhopr-allowance"
          title="Remaining wxHOPR Allowance
          to Channels"
          value={wxHoprAllowance ? rounder(wxHoprAllowance) : '-'}
          valueTooltip={wxHoprAllowance || '-'}
          currency="wxHOPR"
          buttons={[
            {
              text: 'Adjust',
              link: '/staking/set-allowance',
            },
          ]}
        />
        <BuyXHopr
          open={openBuyModal}
          onClose={() => set_openBuyModal(false)}
        />
      </Content>
    </Container>
  );
};

export default StakingScreen;
