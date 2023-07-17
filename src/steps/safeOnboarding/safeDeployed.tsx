import Button from '../../future-hopr-lib-components/Button';
import Card from '../components/Card';
import { ButtonContainer, Text } from './styled';

const SafeDeployed = () => {
  return (
    <Card
      image={{
        src: '/assets/safe-success.svg',
        alt: 'Safe deployed successfully',
        height: 300,
      }}
      title="Safe Deployed"
      description="You're now part of the HOPR Ecoystem. Please add in the next step nodes to your safe"
    >
      <>
        <Text center>Are you already running a HOPR node?</Text>
        <ButtonContainer>
          <Button>Yes</Button>
          <Button>No</Button>
        </ButtonContainer>
      </>
    </Card>
  );
};

export default SafeDeployed;
