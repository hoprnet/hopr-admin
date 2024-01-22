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
`;

const FlexContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

const SafeAddress = styled.p`
  font-weight: 700;
  margin: 0;
`;

const StyledIconButton = styled(IconButton)`
  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  // for redeemed-tickets: (99px + 99px + 32px => 230px)
  grid-template-columns: 1fr 230px repeat(2, 99px) 230px 1fr;

  .line {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    width: 100%;
  }

  .half-line {
    display: flex;
    flex-wrap: wrap;
    width: calc(50% - 1rem);
  }

  #redeemed-tickets, #earned-rewards, #wxhopr-total-stake, #xdai-in-safe, #remaining-wxhopr-allowance {
    flex: 1;
  }

  #expected-apy {
    grid-column: 2/3;
  }

  #redeemed-tickets {
    grid-column: 3/5;
  }

  #earned-rewards {
    grid-column: 5/6;
  }

  #stake-development {
    grid-column: 1/7;
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
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as `0x${string}`;
  const moduleAddress = useAppSelector((store) => store.stakingHub.onboarding.moduleAddress) as `0x${string}`;
  const safeBalance = useAppSelector((store) => store.safe.balance.data);
  const wxHoprAllowance = useAppSelector((store) => store.stakingHub.safeInfo.data.allowance.wxHoprAllowance);

  const [openBuyModal, set_openBuyModal] = useState(false);

  return (
    <Container>
      {selectedSafeAddress && (
        <div>
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
                <Link to={`https://gnosisscan.io/address/${selectedSafeAddress}`}  target='_blank'>
                  <LaunchIcon />
                </Link>
              </StyledIconButton>
            </div>
          </FlexContainer>
          <FlexContainer
            style={{}}
          >
            <SafeAddress>Module address: {moduleAddress}</SafeAddress>
            <div>
              <StyledIconButton
                size="small"
                onClick={() => navigator.clipboard.writeText(moduleAddress)}
              >
                <CopyIcon />
              </StyledIconButton>
              <StyledIconButton size="small">
                <Link to={`https://gnosisscan.io/address/${moduleAddress}`}  target='_blank'>
                  <LaunchIcon />
                </Link>
              </StyledIconButton>
            </div>
          </FlexContainer>
        </div>
      )}
      <Content>
        <div className="line">
          <GrayCard
            id="wxhopr-total-stake"
            title="wxHOPR Total Stake"
            value={rounder(safeBalance.wxHopr.formatted, 6) ?? '-'}
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
        </div>
        <div className="line">
          <GrayCard
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
          />
        </div>
        <div className='half-line'>
          <GrayCard
            id="remaining-wxhopr-allowance"
            title="Remaining wxHOPR Allowance
            to Channels"
            value={wxHoprAllowance ? rounder(wxHoprAllowance) : '-'}
            currency="wxHOPR"
            buttons={[
              {
                text: 'Adjust',
                link: '/staking/set-allowance',
              },
            ]}
          />
        </div>
        <BuyXHopr
          open={openBuyModal}
          onClose={() => set_openBuyModal(false)}
        />
      </Content>
    </Container>
  );
};

export default StakingScreen;
