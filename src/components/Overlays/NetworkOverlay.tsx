import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import 'wagmi/window';
import { getNetworkName } from '../../utils/getNetworkName';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { web3Actions } from '../../store/slices/web3';

// HOPR Components
import Button from '../../future-hopr-lib-components/Button';

// MUI
import { CircularProgress } from '@mui/material';

export const Overlay = styled.div`
  transition: margin-left 0.4s ease-out;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  color: #000050;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.85);
  gap: 32px;
  z-index: 1000;
  .bold {
    font-weight: 700;
  }
  div {
    width: 100%;
    text-align: center;
  }
  button {
    height: unset;
  }
  @media screen and (min-width: 500px) {
    padding: 16px;
  }
`;

const css = `

  .drawerHidden .OverlayWrongNetwork {
    margin-left: 0px;
    width: calc( 100%  - 16px);
  }

  @media screen and (min-width: 500px) {
    .drawerOpen .OverlayWrongNetwork {
      margin-left: 240px;
      width: calc( 100% - 240px - 32px);
    }

    .drawerClosed .OverlayWrongNetwork {
      margin-left: 56px;
      width: calc( 100% - 56px - 32px);
    }
  }

`;

export default function NetworkOverlay() {
  const dispatch = useAppDispatch();
  const chainId = useAppSelector((store) => store.web3.chainId);
  const isConnected = useAppSelector((store) => store.web3.status.connected);
  const loading = useAppSelector((store) => store.web3.status.loading);

  const { chain } = useNetwork();

  const switchChain = async () => {
    if (!window.ethereum) return;
    const rawEthereumProvider = window.ethereum;
    try {
      await rawEthereumProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x64' }],
      });
    } catch (error: any) {
      try {
        if (error.code === 4902) {
          await rawEthereumProvider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x64',
                chainName: 'Gnosis Chain',
                nativeCurrency: {
                  symbol: 'xDAI',
                  name: 'xDAI',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.gnosischain.com/'],
              },
            ],
          });
        } else {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return (
      <Overlay className={'OverlayWrongNetwork'}>
        <style>{css}</style>
        <CircularProgress />
      </Overlay>
    );
  }

  if (!isConnected) {
    return (
      <Overlay className={'OverlayWrongNetwork'}>
        <style>{css}</style>
        <div>You do not have your wallet connected</div>
        <Button
          onClick={() => {
            dispatch(web3Actions.setModalOpen(true));
          }}
        >
          CONNECT WALLET
        </Button>
      </Overlay>
    );
  }

  if (chainId && parseInt(chainId) !== 100) {
    return (
      <Overlay className={'OverlayWrongNetwork'}>
        <style>{css}</style>
        {chain && <div>You are connected to {getNetworkName(chainId)}</div>}
        <div>
          Staking Hub is designed to work on <span className="bold">GNOSIS Chain</span>
        </div>
        <Button onClick={switchChain}>Switch network to GNOSIS</Button>
      </Overlay>
    );
  }

  return <></>;
}
