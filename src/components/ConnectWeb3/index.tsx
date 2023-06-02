import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Modal from '../../future-hopr-lib-components/Modal';
import WalletButton from '../../future-hopr-lib-components/Button/wallet-button';

// Store
import { useAppDispatch } from '../../store';
import { web3Actions } from '../../store/slices/web3';

// wagmi
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const ConnectWalletContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  p {
    margin-top: 48px;
  }
`;

export default function ConnectWeb3() {
  const dispatch = useAppDispatch();
  const [chooseWalletModal, set_chooseWalletModal] = useState(false);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected) set_chooseWalletModal(false);
  }, [isConnected]);

  return (
    <div>
      {!isConnected ? (
        <button
          onClick={() => {
            set_chooseWalletModal(true);
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <button
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </button>
      )}

      <Modal
        open={chooseWalletModal}
        onClose={() => {
          set_chooseWalletModal(false);
        }}
        title="CONNECT A WALLET"
      >
        <ConnectWalletContent>
          <WalletButton
            onClick={() => {
              dispatch(web3Actions.setLoading(true));
              connect();
              if (isConnected) set_chooseWalletModal(false);
            }}
            wallet="metamask"
          />
          <p>
            By connecting a wallet, you agree to HOPR’s Terms of Service and acknowledge that you have read and
            understand the Disclaimer.
          </p>
        </ConnectWalletContent>
      </Modal>
    </div>
  );
}
