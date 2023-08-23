import { ReactNode } from 'react';
import { useAppSelector } from '../../store';
import styled from '@emotion/styled';

import Button from '../../future-hopr-lib-components/Button';
import Section from '../../future-hopr-lib-components/Section';
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

  & #no-node-added {
    grid-column: 1/7;
  }

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
`;

const StyledStakingCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  padding: 1rem;

  &.gray {
    background-color: #edf2f7;
  }

  &.blueGradient {
    background: linear-gradient(#000050, #0000b4);
    color: #fff;
  }
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

const AddNodeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AddNodeTitle = styled.h3`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
`;

const AddNodeText = styled.p`
  font-weight: 700;
  margin: 0;
`;

const AddNodeLink = styled.a`
  color: #b4f0ff;
  text-decoration: underline;
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

type StakingCardProps = {
  id: string;
  variantColor?: 'gray' | 'blueGradient';
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
    className?: string;
    disabled?: boolean;
  }[];
  children?: ReactNode;
};

const StakingCard = ({
  id,
  variantColor = 'gray',
  title,
  value,
  currency,
  chip,
  buttons,
  children,
}: StakingCardProps) => {
  return (
    <StyledStakingCard
      id={id}
      className={`staking-card ${variantColor}`}
    >
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
      {children && <div>{children}</div>}
      {buttons && (
        <ButtonGroup>
          {buttons.map((button) => (
            <Button
              key={button.text}
              disabled={button.disabled}
              className={button.className}
            >
              <Link to={button.link}>{button.text}</Link>
            </Button>
          ))}
        </ButtonGroup>
      )}
    </StyledStakingCard>
  );
};

const NoNodeAdded = () => {
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data) as `0x${string}`;
  const safeBalance = useAppSelector((store) => store.safe.balance.data);

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
          <StakingCard
            id="no-node-added"
            variantColor="blueGradient"
            buttons={[
              {
                text: 'ADD NODES',
                link: '#',
                className: 'white',
              },
            ]}
          >
            <AddNodeContent>
              <AddNodeTitle>Add nodes to your safe</AddNodeTitle>
              <AddNodeText>
                Only then you can start staking <AddNodeLink href="#">Read more</AddNodeLink>
              </AddNodeText>
            </AddNodeContent>
          </StakingCard>
          <StakingCard
            id="wxhopr-total-stake"
            title="wxHOPR Total Stake"
            value={safeBalance.wxHopr.formatted || '-'}
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
          <StakingCard
            id="xdai-in-safe"
            title="xDAI in Safe"
            value={safeBalance.xDai.formatted || '-'}
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
          <StakingCard
            id="expected-apy"
            title="Expected APY"
            value="2 %"
          />
          <StakingCard
            id="redeemed-tickets"
            title="Redeemed Tickets"
            value="1,329"
            chip={{
              label: '+9%/24h',
              color: 'success',
            }}
          />
          <StakingCard
            id="earned-rewards"
            title="Earned rewards"
            value="12,736"
            currency="wxHOPR"
            chip={{
              label: '-5%/24h',
              color: 'error',
            }}
          />
        </Content>
      </StyledCard>
    </Section>
  );
};

export default NoNodeAdded;
