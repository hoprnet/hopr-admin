import { useState } from 'react';
import styled from '@emotion/styled';
import Section from '../future-hopr-lib-components/Section';
import Typography from '../future-hopr-lib-components/Typography';
import Button from '../future-hopr-lib-components/Button/gray';
import ConnectWeb3 from '../components/ConnectWeb3';
import { useAppSelector } from '../store';

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
  const [openWeb3Modal, set_openWeb3Modal] = useState(false);
  const status = useAppSelector((store) => store.web3.status);

  const handleOnClose = () => {
    set_openWeb3Modal(false);
  };

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
      <ConnectWeb3
        open={openWeb3Modal}
        onClose={handleOnClose}
      />
      <Button
        onClick={() => set_openWeb3Modal(true)}
        disabled={status.connected}
      >
        Connect wallet
      </Button>
    </Section>
  );
}

export default SafeStakingPage;
