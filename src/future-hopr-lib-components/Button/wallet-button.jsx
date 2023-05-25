import React from 'react';
import styled from '@emotion/styled';
import MuiButton from '@mui/material/Button';
import Typography from '../Typography';

const SButton = styled(MuiButton)`
  width: 100%;
  background-color: rgb(241, 241, 241);
  img {
    height: 48px;
  }
  .Typography--PlainText {
    margin-bottom: 0;
    margin-left: 16px;
  }
`;

export default function Button(props) {
  function src() {
    switch (props.wallet) {
      case 'metamask':
        return './assets/wallets/MetaMask-Emblem.svg';
      case 'viewMode':
        return './assets/wallets/Eye_open_font_awesome.svg';
      default:
        return '';
    }
  }

  return (
    <SButton className={props.className} {...props}>
      <img src={props.src ? props.src : src()} />
      {props.wallet === 'viewMode' && <Typography>View mode</Typography>}
    </SButton>
  );
}
