import styled from '@emotion/styled';
import Section from '../../future-hopr-lib-components/Section';
import { Paper } from '@mui/material';
import Button from '../../future-hopr-lib-components/Button';
import GrayButton from '../../future-hopr-lib-components/Button/gray';

const StyledPaper = styled(Paper)`
  padding: 2rem;
  text-align: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & button {
    align-self: center;
    text-transform: uppercase;
  }
`;

const AddNodeImage = styled.img`
  align-self: center;
  height: 200px;
  width: 200px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
`;

const AddNode = () => {
  return (
    <>
      <Section
        lightBlue
        center
      >
        <StyledPaper>
          <Container>
            <AddNodeImage src="/assets/add-node.svg" />
            <h2>Add Node</h2>
            <p>Please enter in the next step nodes to your safe.</p>
            <ButtonContainer>
              <StyledGrayButton>Back</StyledGrayButton>
              <Button>Enter node addresses</Button>
              <Button>Install/Order node</Button>
            </ButtonContainer>
          </Container>
        </StyledPaper>
      </Section>
    </>
  );
};

export default AddNode;
