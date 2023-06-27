import styled from '@emotion/styled';
import Section from '../future-hopr-lib-components/Section';
import Typography from '../future-hopr-lib-components/Typography';
import Button from '../future-hopr-lib-components/Button/gray';

const Title = styled(Typography)`
  color: #ffffff;
  font-size: 60px;
  line-height: 4rem;
  max-width: 16ch;
  text-transform: uppercase;
`;

const Paragraph = styled(Typography)`
  color: #ffffff;
  max-width: 80ch;
`;

function SafeStakingPage() {
  return (
    <Section
      darkGradient
      fullHeightMin
      center
    >
      <Title
        type="h2"
        center
      >
        Node running: now faster and safer than ever
      </Title>
      <Paragraph center>
        Blindtext. Decentralized approaches to digital services, finance and data transfer will usher in a new era of
        freedom, fairness and user choice.
      </Paragraph>
      <Button>Connect wallet</Button>
    </Section>
  );
}

export default SafeStakingPage;
