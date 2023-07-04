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
import Card from './components/Card';
import Section from '../future-hopr-lib-components/Section';

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

const StyledGrayButton = styled(GrayButton)`
  outline: 2px solid #000050;
  padding-inline: 2rem;
`;

function XdaiToNode() {
  const dispatch = useAppDispatch();
  return (
    <Section
      lightBlue
      center
      fullHeightMin
    >
      <Card
        image={{
          src: '/assets/xdai-to-node.svg',
          height: 130,
          alt: 'send xdai to node image',
        }}
        title="fund your node with xdai"
      >
        <>
          <StyledForm>
            <StyledInstructions>
              <StyledText>SEND xdAI to Node</StyledText>
              <StyledDescription>
                Add-in the amount of xDAI you like to transfer from your safe to your node.
              </StyledDescription>
            </StyledInstructions>
            <StyledInputGroup>
              <TextField
                variant="outlined"
                placeholder="-"
                size="small"
                InputProps={{ inputProps: {
                  style: { textAlign: 'right' },
                  pattern: '[0-9]*',
                  inputMode: 'numeric',
                } }}
              />
              <StyledCoinLabel>xdai</StyledCoinLabel>
            </StyledInputGroup>
          </StyledForm>
          <StyledButtonGroup>
            <StyledGrayButton>back</StyledGrayButton>
            {/* <Button>confirm</Button> */}
          </StyledButtonGroup>
        </>
      </Card>
    </Section>
  );
}

export default XdaiToNode;
