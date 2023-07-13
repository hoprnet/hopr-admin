import { Card, CardContent } from '@mui/material';
import Section from '../future-hopr-lib-components/Section';
import { useAppSelector } from '../store';
import styled from '@emotion/styled';

const StyledCard = styled(Card)`
  padding: 2rem;
  max-width: 1080px;
`;

const StakingScreen = () => {
  const account = useAppSelector((selector) => selector.web3.account);
  return (
    <Section
      lightBlue
      center
      fullHeightMin
    >
      <StyledCard>
        <p>Safe address: {account}</p>
        <p>Staking screen</p>
      </StyledCard>
    </Section>
  );
};

export default StakingScreen;
