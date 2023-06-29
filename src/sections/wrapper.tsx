import { IconButton, Paper, TextField } from '@mui/material';
import Section from '../future-hopr-lib-components/Section';
import styled from '@emotion/styled';
import Button from '../future-hopr-lib-components/Button';

import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useState } from 'react';

const StyledPaper = styled(Paper)`
  &.MuiPaper-root {
    padding: 2rem;
    text-align: center;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;

  & button {
    align-self: center;
    text-transform: uppercase;
  }
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  background: linear-gradient(rgba(0, 0, 178, 1), rgba(0, 0, 80, 1));
  top: 48px;
  z-index: 2;
  & svg {
    color: #fff;
  }
`;

function WrapperPage() {
  const [xhoprValue, set_xHOPRValue] = useState('');
  const [wxhoprValue, set_wxHOPRValue] = useState('');

  // TODO:
  const handleSwapClick = () => {
    // const tempValue = xhoprValue;
    // set_wxHOPRValue(xhoprValue);
    // set_xHOPRValue('');
  };
  return (
    <Section
      lightBlue
      center
    >
      <StyledPaper>
        <h2>Wrapper</h2>
        <p>Utility to wrap (xHOPR &#8594; wxHOPR) and unwrap (wxHOPR &#8594; xHOPR) xHOPR tokens.</p>
        <FlexContainer>
          <TextField
            label="xHOPR"
            placeholder="750"
            type="number"
            value={xhoprValue}
            onChange={(e) => set_xHOPRValue(e.target.value)}
          />
          <StyledIconButton>
            <SwapVertIcon />
          </StyledIconButton>
          <TextField
            label="wxHOPR"
            placeholder="750"
            type="number"
            value={wxhoprValue}
            onChange={(e) => set_wxHOPRValue(e.target.value)}
          />
          <Button
            hopr
            onClick={handleSwapClick}
          >
            Swap
          </Button>
        </FlexContainer>
      </StyledPaper>
    </Section>
  );
}

export default WrapperPage;
