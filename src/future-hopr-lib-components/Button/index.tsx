import { forwardRef, Ref } from 'react';
import styled from '@emotion/styled';
import MuiButton, { ButtonProps } from '@mui/material/Button';

type StyledButtonProps = ButtonProps & {
  imageOnly?: boolean;
  size70?: boolean;
  standardWidth?: boolean;
  fade?: boolean;
  target?: string;
};

const StyledButton = styled(MuiButton)<StyledButtonProps>`
  font-family: 'Source Code Pro';
  text-align: center;
  text-transform: none;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  border-radius: 20px;
  letter-spacing: 0.25px;
  height: unset;
  line-height: 1.5;
  height: 39px;

  &.btn-hopr--v2:not(.Mui-disabled) {
    color: #fff;
    background: linear-gradient(#000050, #0000b4);
    color: #ffffff;
  }
  &.btn-hopr--standardWidth {
    width: 100%;
    max-width: 222px;
  }
  &.btn-hopr--size70 {
    min-height: 70px;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.14999999105930328px;
  }
  &.btn-hopr--image-only {
    padding: 8px;
    width: 70px;
    height: 70px;
    img {
      width: 100%;
      max-width: 54px;
    }
  }
  &.btn-hopr--v2.btn-hopr--fade:not(.Mui-disabled) {
    background: linear-gradient(rgb(0 0 80 / 60%), rgb(0 0 180 / 60%));
  }
  &.white:not(.Mui-disabled) {
    background: #fff;
    color: #0000b2;
    font-weight: 700;
  }
`;

const Button = forwardRef((props: StyledButtonProps, ref: Ref<HTMLButtonElement>) => {
  const {
    imageOnly,
    size70,
    standardWidth,
    fade,
    children,
    ...rest
  } = props;

  const classNames = [
    props.className,
    'btn-hopr--v2',
    imageOnly && 'btn-hopr--image-only',
    size70 && 'btn-hopr--size70',
    standardWidth && 'btn-hopr--standardWidth',
    fade && 'btn-hopr--fade',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <StyledButton
      variant="contained"
      {...rest}
      ref={ref}
      className={classNames}
    >
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button'; // Set the display name here

export default Button;
