import React from 'react';
import styled from "@emotion/styled";
import MuiButton from "@mui/material/Button";
import PropTypes from 'prop-types';

const SButton = styled(MuiButton)`
  font-family: Source Code Pro;
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
    color: #FFF;
    background: linear-gradient(#000050, #0000b4);
    color: #FFFFFF;
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
`

const Button = React.forwardRef((props, ref) => {
    const {hopr, imageOnly, size70, loading, standardWidth, fade, ...rest} = props;

    return (
        <SButton
            variant={'contained'}
            {...rest}
            ref={ref}
            className={[
              props.className,
              'btn-hopr--v2',
              props.imageOnly && 'btn-hopr--image-only',
              props.size70 && 'btn-hopr--size70',
              props.standardWidth && 'btn-hopr--standardWidth',
              props.fade && 'btn-hopr--fade',
            ].join(' ')}
        >
            {props.children}
        </SButton>
    )
})

Button.defaultProps = {
    hopr: false,
    imageOnly:  false,
    size70:  false,
}

// Button.propTypes = {
//     hopr: PropTypes.bool,
//     imageOnly:  PropTypes.bool,
//     size70:  PropTypes.bool,
// };

export default Button;