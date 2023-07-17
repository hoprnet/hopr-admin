import { useState, useEffect, MouseEvent } from 'react';
import styled from '@emotion/styled';
import Modal from '../../future-hopr-lib-components/Modal';
import WalletButton from '../../future-hopr-lib-components/Button/wallet-button';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { web3Actions } from '../../store/slices/web3';
import { appActions } from '../../store/slices/app';

// wagmi
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { gnosis, localhost } from 'viem/chains';
import { Button, Menu, MenuItem } from '@mui/material';

const AppBarContainer = styled.div`
  height: 59px;
  width: 200px;
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State variable to hold the anchor element for the menu
  const { connect } = useConnect({ connector: new InjectedConnector({ chains: [localhost, gnosis] }) });
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const account = useAppSelector((selector) => selector.web3.account);
  const [currentAccount, set_currentAccount] = useState('');

  useEffect(() => {
    if (isConnected) handleClose();
  }, [isConnected]);

  useEffect(() => {
    if (open) {
      set_chooseWalletModal(open);
    }
  }, [open]);

  useEffect(() => {
    if (account) {
      set_currentAccount(account);
    }
  }, [account]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    set_chooseWalletModal(false);
  };

  const handleConnectToMetaMask = () => {
    dispatch(web3Actions.setLoading(true));
    connect();
    if (isConnected) {
      handleClose();
    }
  };

  const handleDisconnectMM = () => {
    disconnect();
    dispatch(appActions.resetSafeState());
    dispatch(web3Actions.resetState());
  };

  // New function to handle opening the menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // New function to handle closing the menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const shorterAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 6, address.length)}`;
  };

  return (
    <>
      {inTheAppBar && (
        <AppBarContainer>
          <img
            src="/assets/wallets/MetaMask_Fox.svg"
            style={{ height: '50px' }}
          />
          {!isConnected ? (
            <button
              onClick={() => {
                set_chooseWalletModal(true);
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <>
              <Button
                onClick={handleOpenMenu}
                sx={{ color: 'black' }}
              >
                {shorterAddress(currentAccount)}
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleDisconnectMM}>Disconnect</MenuItem>
              </Menu>
            </>
          )}
        </AppBarContainer>
      )}
      <Modal
        open={chooseWalletModal}
        onClose={handleClose}
        title="CONNECT A WALLET"
      >
        <ConnectWalletContent>
          <WalletButton
            onClick={handleConnectToMetaMask}
            wallet="metamask"
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
