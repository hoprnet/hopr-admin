import React, { useEffect } from 'react';
import MuiButton from '@mui/material/Button';
import styled from '@emotion/styled';

const LaunchAppBtn = styled(MuiButton)`
  text-transform: none;
  font-family: 'Source Code Pro';
  font-size: 18px;
  background: linear-gradient(#000050, #0000b4);
  &.EnterPlaygroundBtnMain {
    z-index: 100;
    position: absolute;
    top: 20px;
    right: 30px;
    transition: all 0.4s ease;
    position: fixed;
    top: 70px;
    right: 30px;
    //&.sticky{
    //  position: fixed;
    //  top: 10px;
    //}
    @media screen and (max-width: 680px) {
      display: none;
    }
    @media screen and (max-width: 1006px) {
      //&.sticky{
      //  z-index: 9;
      //  position: absolute;
      //  top: 20px;
      //}
    }
  }
  &.EnterPlaygroundBtnMobile {
    margin: 8px;
    margin-top: 20px;
    text-align: center;
  }
`;

const LaunchPlaygroundBtn = (props) => {
  // useEffect(() => {
  //   window.onscroll = function() {stickyFunction()};
  //   var header = document.getElementById("EnterPlaygroundBtn");
  //   var sticky = header.offsetTop;
  //   function stickyFunction() {
  //     if (window.pageYOffset > sticky) {
  //       header.classList.add("sticky");
  //     } else {
  //       header.classList.remove("sticky");
  //     }
  //   }
  // }, []);

  const variant = () => {
    if (props.mobile) return 'EnterPlaygroundBtnMobile';
    if (props.main) return 'EnterPlaygroundBtnMain';
    return 'EnterPlaygroundBtn';
  };

  return (
    <LaunchAppBtn
      variant="contained"
      id={variant()}
      href="https://playground.hoprnet.org"
      target="_blank"
      className={variant()}
    >
      Enter Playground
    </LaunchAppBtn>
  );
};

export default LaunchPlaygroundBtn;
