import { Store } from '../types/index';

//Stores
import { useAppDispatch, useAppSelector } from '../store';

// Libraries
import styled from '@emotion/styled';

// MUI
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

// components
import Button from '../future-hopr-lib-components/Button';
import GrayButton from '../future-hopr-lib-components/Button/gray';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-family: 'Source Code Pro';
  padding: 128px;
`;

const StyledPaper = styled(Paper)`
  margin: 2rem;
  border-radius: 10px;
`;

const StyledTitle = styled.h2`
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 60px;
  letter-spacing: 0.35px;
  text-transform: uppercase;
`;

const StyledForm = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  border-bottom: 1px solid #414141;
`;

const StyledInstructions = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
`;

const StyledText = styled.h3`
  color: var(--414141, #414141);
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-transform: uppercase;
`;

const StyledDescription = styled.p`
  color: #414141;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.35px;
`;

const StyledInputGroup = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

const StyledTextField = styled(TextField)`
  text-align: right;
`;

const StyledCoinLabel = styled.p`
  color: var(--414141, #414141);
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 60px;
  letter-spacing: 0.35px;
  text-transform: uppercase;
`;

const StyledButtonGroup = styled.div`
  margin-top: 32px;
  display: flex;
  align-items: baseline;
  gap: 1rem;
`;

const StyledButton = styled(Button)`
  padding: 10px 60px;
  border-radius: 25px;
  text-transform: uppercase;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  &.outline {
    border: 2px solid #000050;
    background-color: inherit;
    color: #000050;
  }
`;

function xdaiToNode() {
  const dispatch = useAppDispatch();
  return (
    <StyledPaper>
      <StyledContainer>
        <img src="/assets/xdai-to-node.svg" />
        <StyledTitle>fund your node with xdai</StyledTitle>
        <StyledForm>
          <StyledInstructions>
            <StyledText>SEND xdAI to Node</StyledText>
            <StyledDescription>
              Add-in the amount of xDAI you like to transfer from your safe to your node.
            </StyledDescription>
          </StyledInstructions>
          <StyledInputGroup>
            <StyledTextField
              variant="outlined"
              placeholder="-"
              size="small"
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
              }}
            />
            <StyledCoinLabel>xdai</StyledCoinLabel>
          </StyledInputGroup>
        </StyledForm>
        <StyledButtonGroup>
          <GrayButton className="outline">back</GrayButton>
          <StyledButton>confirm</StyledButton>
        </StyledButtonGroup>
      </StyledContainer>
    </StyledPaper>
  );
}

export default xdaiToNode;
