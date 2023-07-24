import { ReactNode } from 'react';
import { useBalance } from 'wagmi';
import { useAppSelector } from '../store';
import styled from '@emotion/styled';

import Button from '../future-hopr-lib-components/Button';
import Chart from 'react-apexcharts';
import Section from '../future-hopr-lib-components/Section';
import { Card, Chip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';

import CopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  min-width: 1080px;
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
  & svg {
    width: 1rem;
    height: 1rem;
  }
`;

const Content = styled.div`
  display: grid;
  gap: 2rem;
  // for redeemed-tickets: (99px + 99px + 32px => 230px)
  grid-template-columns: 1fr 230px repeat(2, 99px) 230px 1fr;

  & #wxhopr-total-stake {
    grid-column: 1/4;
  }

  & #xdai-in-safe {
    grid-column: 4/7;
  }

  & #expected-apy {
    grid-column: 2/3;
  }

  & #redeemed-tickets {
    grid-column: 3/5;
  }

  & #earned-rewards {
    grid-column: 5/6;
  }

  & #stake-development {
    grid-column: 1/7;
  }
`;

const StyledGrayCard = styled(Card)`
  background-color: #edf2f7;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardTitle = styled.h4`
  font-weight: 700;
  margin: 0;
`;

const CardValue = styled.h5`
  font-size: 2rem;
  font-weight: 500;
  margin: 0;
`;

const CardCurrency = styled.p`
  font-size: 1rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.4;
`;

const ValueAndCurrency = styled.div`
  align-items: flex-end;
  display: flex;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledChip = styled(Chip)<{ color: string }>`
  align-self: flex-start;
  background-color: ${(props) => props.color === 'error' && '#ffcbcb'};
  background-color: ${(props) => props.color === 'success' && '#cbffd0'};
  color: ${(props) => props.color === 'error' && '#c20000'};
  color: ${(props) => props.color === 'success' && '#00c213'};
  font-weight: 700;
`;

const ChartContainer = styled.div`
  width: 100%;
`;

type GrayCardProps = {
  id: string;
  title?: string;
  value?: string;
  currency?: 'xDAI' | 'xHOPR' | 'wxHOPR';
  chip?: {
    label: string;
    color: 'success' | 'error';
  };
  buttons?: {
    text: string;
    link: string;
    disabled?: boolean;
  }[];
  children?: ReactNode;
};

const GrayCard = ({ id, title, value, currency, chip, buttons, children }: GrayCardProps) => {
  return (
    <StyledGrayCard id={id}>
      {(title || value) && (
        <CardContent>
          {title && <CardTitle>{title}</CardTitle>}
          {value && (
            <ValueAndCurrency>
              <CardValue>{value}</CardValue>
              {currency && <CardCurrency>{currency}</CardCurrency>}
            </ValueAndCurrency>
          )}
          {chip && (
            <StyledChip
              label={chip.label}
              color={chip.color}
            />
          )}
        </CardContent>
      )}
      {buttons && (
        <ButtonGroup>
          {buttons.map((button) => (
            <Button
              key={button.text}
              disabled={button.disabled}
            >
              <Link to={button.link}>{button.text}</Link>
            </Button>
          ))}
        </ButtonGroup>
      )}
      {children}
    </StyledGrayCard>
  );
};

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

const wxhoprSmartContractAddress = '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1';

const StakingScreen = () => {
  const selectedSafeAddress = useAppSelector((selector) => selector.safe.selectedSafeAddress) as `0x${string}`;

  const { data: xDAI_balance } = useBalance({
    address: selectedSafeAddress,
    watch: true,
  });
  const { data: wxHOPR_balance } = useBalance({
    address: selectedSafeAddress ?? undefined,
    token: wxhoprSmartContractAddress,
    watch: true,
  });

  return (
    <Section
      lightBlue
      center
      fullHeightMin
    >
      <StyledCard>
        {selectedSafeAddress && (
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
                <Link to={`https://gnosisscan.io/address/${selectedSafeAddress}`}>
                  <LaunchIcon />
                </Link>
              </StyledIconButton>
            </div>
          </FlexContainer>
        )}
        <Content>
          <GrayCard
            id="wxhopr-total-stake"
            title="wxHOPR Total Stake"
            value={wxHOPR_balance?.formatted || '-'}
            chip={{
              label: '+12%/24h',
              color: 'success',
            }}
            buttons={[
              {
                text: 'BUY xHOPR',
                link: '#',
                disabled: true,
              },
              {
                text: 'xHOPR → wxHOPR',
                link: '/develop/wrapper',
              },
              {
                text: 'STAKE wxHOPR',
                link: '#',
                disabled: true,
              },
            ]}
          />
          <GrayCard
            id="xdai-in-safe"
            title="xDAI in Safe"
            value={xDAI_balance?.formatted || '-'}
            buttons={[
              {
                text: 'FUND SAFE',
                link: '#',
                disabled: true,
              },
              {
                text: 'SEND TO NODE',
                link: '#',
                disabled: true,
              },
            ]}
          />
          <GrayCard
            id="expected-apy"
            title="Expected APY"
            value="2 %"
          />
          <GrayCard
            id="redeemed-tickets"
            title="Redeemed Tickets"
            value="1,329"
            chip={{
              label: '+9%/24h',
              color: 'success',
            }}
          />
          <GrayCard
            id="earned-rewards"
            title="Earned rewards"
            value="12,736"
            currency="wxHOPR"
            chip={{
              label: '-5%/24h',
              color: 'error',
            }}
          />
          <GrayCard id="stake-development">
            <ColumnChart />
          </GrayCard>
        </Content>
      </StyledCard>
    </Section>
  );
};

export default StakingScreen;
