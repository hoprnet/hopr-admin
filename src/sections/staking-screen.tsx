import { ReactNode } from 'react';
import styled from '@emotion/styled';

import Section from '../future-hopr-lib-components/Section';
import { useAppSelector } from '../store';
import { Card, Chip } from '@mui/material';

const StyledCard = styled(Card)`
  padding: 2rem;
  min-width: 1080px;
`;

const Content = styled.div`
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr 1fr 1fr;
`;

const StyledGrayCard = styled(Card)`
  background-color: #edf2f7;
  padding: 1rem;
`;

const StyledChip = styled(Chip)<{ color: string }>`
  background-color: ${(props) => props.color === 'success' && '#cbffd0'};
  background-color: ${(props) => props.color === 'error' && '#FFCBCB'};
  color: ${(props) => props.color === 'success' && '#00C213'};
  color: ${(props) => props.color === 'error' && '#C20000'};
`;

type GrayCardProps = {
  id: string;
  title?: string;
  value?: string;
  chip?: {
    label: string;
    color: 'success' | 'error';
  };
  children?: ReactNode;
};

const GrayCard = ({
  id,
  title,
  value,
  chip,
  children,
}: GrayCardProps) => {
  return (
    <StyledGrayCard id={id}>
      {title && <p>{title}</p>}
      {value && <p>{value}</p>}
      {chip && (
        <StyledChip
          label={chip.label}
          color={chip.color}
        />
      )}
      {children}
    </StyledGrayCard>
  );
};

const StakingScreen = () => {
  const selectedSafeAddress = useAppSelector((selector) => selector.safe.selectedSafeAddress);
  return (
    <Section
      lightBlue
      center
      fullHeightMin
    >
      <StyledCard>
        {selectedSafeAddress ? <p>Safe address: {selectedSafeAddress}</p> : <p>Create a Safe</p>}
        <Content>
          <GrayCard
            id="wxhopr-total-stake"
            title="wxHOPR Total Stake"
            value="28,120,578.05"
            chip={{
              label: '+12%/24h',
              color: 'success',
            }}
          />
          <GrayCard
            id="xdai-in-safe"
            title="xDAI in Safe"
            value="1,329"
          />
          <GrayCard
            id="expected-apy"
            title="Expected APY"
            value="2%"
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
            value="12,736 wxHOPR"
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

export default StakingScreen;
