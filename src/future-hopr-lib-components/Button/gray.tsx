import styled from '@emotion/styled';
import MuiButton, { ButtonProps } from '@mui/material/Button';

const SButton = styled(MuiButton)`
  background: #ffffff;
  border-radius: 42.3px;
  font-family: 'Source Code Pro';
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
  line-height: 45px;
  padding: 0.2rem 1.25rem;

  text-align: center;
  letter-spacing: 0.25px;

  color: #414141;

  &.unifiedSize {
    width: 100%;
    max-width: 222px;
  }

  &:hover {
    background-color: #dfdfdf;
    color: #414141;
  }
`;

export default function Button(props: ButtonProps) {
  return (
    <SButton
      className={props.className}
      {...props}
    >
      {props.children}
    </SButton>
  );
}
