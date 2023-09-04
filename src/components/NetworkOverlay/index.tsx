import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useNetwork, useSwitchNetwork } from 'wagmi'
import 'wagmi/window';
import { getNetworkName } from '../../utils/getNetworkName';

// Store
import { useAppSelector } from '../../store';

// HOPR Components
import Button from '../../future-hopr-lib-components/Button';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
`;

export default function NetworkOverlay() {
  const chainId = useAppSelector((store) => store.web3.chainId);
  const isConnected = useAppSelector((store) => store.web3.status.connected);

  const { chain } = useNetwork()

  const switchChain = async () => {
    if (!window.ethereum) return;
    const rawEthereumProvider = window.ethereum;
    try {
        await rawEthereumProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x64' }]
        })
    } catch (error: any) {
        try {
            if (error.code === 4902) {
                await rawEthereumProvider.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0x64',
                        chainName: 'Gnosis Chain',
                        nativeCurrency: {
                            symbol: 'xDAI',
                            name: 'xDAI',
                            decimals: 18
                        },
                        rpcUrls: ['https://rpc.gnosischain.com/'],
                    }],
                })
            } else {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

  return (
    <>
      {isConnected && chainId?.toString() !== '100' && (
        <Overlay>
          {chain && <div>You are connected to {getNetworkName(chainId)}</div>}
          <div>Staking Hub is designed to work on <span className='bold'>GNOSIS Chain</span></div>
          <Button
            onClick={switchChain}
          >
            Switch network to GNOSIS
          </Button>
        </Overlay>
      )}
    </>
  );
}
