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
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { gnosis } from 'viem/chains';

const AppBarContainer = styled.div`
  height: 59px;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ConnectWalletContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  p {
    margin-top: 48px;
  }
`;

type ConnectWeb3Props = {
  inTheAppBar?: boolean;
  open?: boolean;
  onClose?: () => void;
};

export default function ConnectWeb3({
  inTheAppBar,
  open,
  onClose,
}: ConnectWeb3Props) {
  const dispatch = useAppDispatch();
  const [chooseWalletModal, set_chooseWalletModal] = useState(false);
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect: openWalletConnect } = useConnect({
    connector: new WalletConnectConnector({
      options: { projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID },
      chains: [gnosis],
    }),
    onError: () => disconnect(),
  });

  useEffect(() => {
    if (isConnected) handleClose();
  }, [isConnected]);

  useEffect(() => {
    set_chooseWalletModal(open!);
  }, [open]);

  const handleClose = () => {
    if (onClose) onClose();
    set_chooseWalletModal(false);
  };

  const handleConnectToMetaMask = () => {
    dispatch(web3Actions.setLoading(true));
    connect();
    if (isConnected) handleClose();
  };

  const handleConnectToWalletConnect = () => {
    dispatch(web3Actions.setLoading(true));
    openWalletConnect();
    handleClose();
  };

  return (
    <>
      {inTheAppBar && (
        <AppBarContainer>
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
        </AppBarContainer>
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
            onClick={handleConnectToMetaMask}
            wallet="metamask"
          />
          <WalletButton
            onClick={handleConnectToWalletConnect}
            wallet="walletConnect"
            value={'connect with walletConnect'}
          />
          <p>
            By connecting a wallet, you agree to HOPR’s Terms of Service and acknowledge that you have read and
            understand the Disclaimer.
          </p>
        </ConnectWalletContent>
      </Modal>
    </>
  );
}
