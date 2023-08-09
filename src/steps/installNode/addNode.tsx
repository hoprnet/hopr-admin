import styled from '@emotion/styled';
import Section from '../../future-hopr-lib-components/Section';
import Button from '../../future-hopr-lib-components/Button';
import GrayButton from '../../future-hopr-lib-components/Button/gray';
import Card from '../../components/Card';
import { useNavigate } from 'react-router-dom';

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

const AddNode = () => {
  const navigate = useNavigate();
  return (
    <Section
      center
      fullHeightMin
      lightBlue
    >
      <Card
        image={{ src: '/assets/add-node.svg' }}
        title="Add node"
        description="Please enter in the next step nodes to your safe."
      >
        <ButtonContainer>
          <StyledGrayButton onClick={() => navigate(-1)}>Back</StyledGrayButton>
          <Button href="/steps/node-address">Enter node addresses</Button>
          <Button href="/steps/select-node-type">Install/Order node</Button>
        </ButtonContainer>
      </Card>
    </Section>
  );
};

export default AddNode;
