import React, { useEffect } from 'react';
import MuiButton from '@mui/material/Button';
import styled from '@emotion/styled';

const LaunchAppBtn = styled(MuiButton)`
  text-transform: none;
  font-family: 'Source Code Pro';
  font-size: 18px;
  background: linear-gradient(#000050, #0000b4);
  height: 55px;
  &.EnterPlaygroundBtnMain {
    z-index: 100;
    position: absolute;
    top: 20px;
    right: 30px;
    transition: all 0.4s ease;
    position: fixed;
    top: 70px;
    right: 30px;
    @media screen and (max-width: 680px) {
      display: none;
    }
  }
  &.EnterPlaygroundBtnMobile {
    margin: 8px;
    margin-top: 20px;
    text-align: center;
  }
`;

const LaunchPlaygroundBtn = (props) => {
  return (
    <LaunchAppBtn
      variant="contained"
      {...props}
    >
      {props.children}
    </LaunchAppBtn>
  );
};

export default LaunchPlaygroundBtn;
