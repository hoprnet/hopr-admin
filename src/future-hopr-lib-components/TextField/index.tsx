import MuiTextField, { TextFieldProps } from '@mui/material/TextField';
import styled from '@emotion/styled';

const STextField = styled(MuiTextField)`
  font-family: 'Source Code Pro', monospace;
  width: 100%;
  margin-bottom: 8px;
  background: white;
  * {
    font-family: 'Source Code Pro', monospace !important;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input {
    -moz-appearance: textfield;
  }
  @media (max-width: 320px) {
    .MuiInputAdornment-root {
      display: none;
    }
  }
`;

const TextField: React.FC<TextFieldProps> = (props) => {
  return (
    <STextField
      {...props}
      variant="outlined"
    />
  );
};

export default TextField;
