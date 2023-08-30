import { Button as MuiButton, TextField } from '@mui/material';

import styled from '@emotion/styled';
import Button from '../../../../future-hopr-lib-components/Button';
import GrayButton from '../../../../future-hopr-lib-components/Button/gray';

export const Lowercase = styled.span`
  text-transform: lowercase;
`;

export const Container = styled.div<{ column?: boolean }>`
  align-items: ${(props) => (props.column ? 'flex-start' : 'center')};
  display: flex;
  flex-direction: ${(props) => props.column && 'column'};
  justify-content: space-between;
  padding-bottom: 1rem;
  gap: 1rem;
  min-height: 39px;
`;

export const FlexContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

export const AddButton = styled(MuiButton)`
  align-self: flex-start;
  color: #0000b4;
  font-weight: 700;
`;

export const StyledTextField = styled(TextField)`
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
`;

export const StyledForm = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 1rem;
  &.underline{
    border-bottom: 1px solid #414141;
  }

`;

export const StyledInstructions = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px;
`;

export const Subtitle = styled.h3`
  color: #414141;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  letter-spacing: 0.35px;
  text-transform: uppercase;
  margin: 0;
`;

export const Text = styled.p<{ center?: boolean }>`
  text-align: ${(props) => props.center && 'center'};
  font-weight: 500;
  color: #414141;
  margin: 0;
`;

export const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  gap: 1rem;
`;

export const StyledGrayButton = styled(GrayButton)`
  border: 1px solid black;
  height: 39px;
`;

export const StyledDescription = styled.p`
  color: #414141;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0.35px;
`;

export const StyledInputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 380px;
`;

export const StyledCoinLabel = styled.p`
  color: #414141;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 60px;
  letter-spacing: 0.35px;
  width: 60px;
`;

export const MaxButton = styled(Button)`
  text-transform: uppercase;
  margin-left: auto;
`;

export const StyledError = styled.p`
  margin: 0;
  word-break: break-all;
`;
