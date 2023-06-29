import React from 'react';
import styled from '@emotion/styled';
import MuiButton, { ButtonProps } from '@mui/material/Button';
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
` as typeof MuiButton;

interface CustomButtonProps extends ButtonProps {
  wallet: 'metamask' | 'viewMode' | 'walletConnect';
  src?: string;
}

export default function Button(props: CustomButtonProps) {
  function src() {
    switch (props.wallet) {
    case 'metamask':
      return '/assets/wallets/MetaMask-Emblem.svg';
    case 'viewMode':
      return '/assets/wallets/Eye_open_font_awesome.svg';
    default:
      return '';
    }
  }

  return (
    <SButton {...props}>
      <img src={props.src ?? src()} />
      {props.wallet === 'viewMode' && <Typography>View mode</Typography>}
      {props.value}
    </SButton>
  );
}
