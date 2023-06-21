import React from 'react';
import styled from '@emotion/styled';
import GrayButton from '../Button/gray.jsx';
import Link from '../Typography/link';

const SBanner = styled.section`
  background: linear-gradient(#000050, #0000b4);
  display: flex;
  align-items: center;
  justify-content: center;
  //  gap: 32px;
  padding-right: 8px;
  padding-left: 8px;
  padding: 7px;
  @media (max-width: 600px) {
    button {
      font-size: 14px;
    }
  }
  @media (max-width: 440px) {
    flex-direction: column;
    // gap: 5px;
  }
  a {
    color: white;
  }
`;

const Text = styled.div`
  font-family: 'Source Code Pro';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.25px;
  color: #ffffff;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 14px;
    button {
      font-size: 14px;
    }
  }
`;

const Banner = (props) => (
  <SBanner>
    <Text>
      {props.text}{' '}
      <Link
        href={props.linkHref}
        text={props.linkText}
        openIcon
      />
    </Text>
    {/* <GrayButton
            variant="contained"
            onClick={props.onButtonClick}
        >{props.btnBext}</GrayButton> */}
  </SBanner>
);

export default Banner;
