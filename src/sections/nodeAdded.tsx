import styled from '@emotion/styled';

import Section from '../future-hopr-lib-components/Section';
import { Card, Chip } from '@mui/material';
import { ReactNode } from 'react';
import Button from '../future-hopr-lib-components/Button';
import { Link } from 'react-router-dom';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  min-width: 1080px;
`;

const Content = styled.section`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  #node-graphic {
    grid-column: 1/3;
    grid-row: 1/3;
  }

  & #remaining-wxhopr-allowance {
    grid-column: 3/4;
  }

  & #earned-rewards {
    grid-column: 4/5;
  }

  & #node-strategy {
    grid-column: 3/4;
  }

  & #redeemed-tickets {
    grid-column: 4/5;
  }

  & #xdai {
    grid-column: 3/4;
  }
`;

const StyledGrayCard = styled(Card)`
  background-color: #edf2f7;
  color: #414141;
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
  }[];
  children?: ReactNode;
};

const GrayCard = ({
  id,
  title,
  value,
  currency,
  chip,
  buttons,
  children,
}: GrayCardProps) => {
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
            <Button key={button.text}>
              <Link to={button.link}>{button.text}</Link>
            </Button>
          ))}
        </ButtonGroup>
      )}
      {children}
    </StyledGrayCard>
  );
};

const NodeAdded = () => {
  return (
    <Section
      lightBlue
      center
      fullHeightMin
    >
      <StyledCard>
        <Content>
          <GrayCard id="node-graphic">Graph here0op9</GrayCard>
          <GrayCard
            id="remaining-wxhopr-allowance"
            title="Remaining wxHOPR Allowance"
          ></GrayCard>
          <GrayCard id="earned-rewards">Earned rewards</GrayCard>
          <GrayCard id="node-strategy">Node strategy</GrayCard>
          <GrayCard id="redeemed-tickets">Redeemed Tickets</GrayCard>
          <GrayCard id="xdai">xDAI</GrayCard>
        </Content>
      </StyledCard>
    </Section>
  );
};

export default NodeAdded;
