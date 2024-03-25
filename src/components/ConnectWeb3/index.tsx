import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// UI
import WalletButton from '../../future-hopr-lib-components/Button/wallet-button';
import Modal from '../../future-hopr-lib-components/Modal';
import { Button, Menu, MenuItem } from '@mui/material';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';
import { safeActions } from '../../store/slices/safe';
import { stakingHubActions, stakingHubActionsAsync } from '../../store/slices/stakingHub';

// wagmi
import { Connector, useConnect, useDisconnect, useAccount } from 'wagmi';
import { truncateEthereumAddress } from '../../utils/blockchain';
import { web3Actions } from '../../store/slices/web3';
import { UserRejectedRequestError } from 'viem';

const AppBarContainer = styled(Button)`
  align-items: center;
  display: none;
  cursor: pointer;
  height: 59px;
  justify-content: center;
  width: 285px;
  border-radius: 0;
  .image-container {
    height: 50px;
    width: 50px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  @media screen and (min-width: 500px) {
    display: flex;
  }
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

const Web3Button = styled.div`
  font-family: 'Source Code Pro';
  min-width: 150px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  color: #414141;
  gap: 10px;
  text-transform: none;
  p {
    margin: 0;
    font-size: 12px;
  }
  .chain {
    color: #808080;
    line-height: 12px;
  }
`;

const DropdownArrow = styled.img`
  align-self: center;
`;

const ErrorContent = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 350px;
  overflow-wrap: anywhere;
  white-space: break-spaces;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3c64a5;
    border-radius: 10px;
    border: 3px solid white;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #000050;
  }
`;

type ConnectWeb3Props = {
  inTheAppBar?: boolean;
  open?: boolean;
  onClose?: () => void;
};

export default function ConnectWeb3({ inTheAppBar, open, onClose }: ConnectWeb3Props) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State variable to hold the anchor element for the menu
  const { connectors, connect, error, reset, pendingConnector } = useConnect();
  const { connector } = useAccount();
  const { disconnect } = useDisconnect();

  const account = useAppSelector((store) => store.web3.account);
  const isConnected = useAppSelector((store) => store.web3.status.connected);
  const modalOpen = useAppSelector((store) => store.web3.modalOpen);
  const chain = useAppSelector((store) => store.web3.chain);
  const walletPresent = useAppSelector((store) => store.web3.status.walletPresent);
  const [localError, set_localError] = useState<false | string>(false);
  const containerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isConnected && account && chain) {
      dispatch(stakingHubActionsAsync.getHubSafesByOwnerThunk(account));
      handleClose();
    }
  }, [isConnected, account, chain]);

  useEffect(() => {
    if (open) {
      dispatch(web3Actions.setModalOpen(open));
    }
  }, [open]);

  useEffect(() => {
    if (error) {
      if (error instanceof UserRejectedRequestError) {
        let parsedError = error.shortMessage;
        if (error.details && error.details !== error.shortMessage && error.details.length > 10) {
          parsedError = parsedError + '\n\n' + error.details;
        }
        set_localError(parsedError);
      } else {
        set_localError(JSON.stringify(error));
      }
      // wallet connect modal can
      // cause errors if it is closed without connecting
      if (pendingConnector?.id === 'walletConnect') {
        reset();
      }
    } else set_localError(false);
  }, [error]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    dispatch(web3Actions.setModalOpen(false));
    setTimeout(() => {
      set_localError(false);
    }, 250);
  };

  const handleConnectToWallet = (connector: Connector) => {
    dispatch(web3Actions.setLoading(true));
    dispatch(web3Actions.setDisconnecting(false));

    connect({ connector });

    // wallet connect opens another modal
    if (isConnected || connector.id === 'walletConnect') {
      handleClose();
    }
  };

  const handleDisconnectMM = () => {
    console.log('handleDisconnectMM');
    disconnect();
    dispatch(appActions.resetState());
    dispatch(web3Actions.resetState());
    dispatch(safeActions.resetState());
    dispatch(stakingHubActions.resetState());
    dispatch(web3Actions.setDisconnecting(true));
    navigate('/');
  };

  // New function to handle opening the menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // New function to handle closing the menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleWeb3ButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isConnected) {
      dispatch(web3Actions.setModalOpen(true));
    } else {
      handleOpenMenu(event);
    }
  };

  return (
    <>
      {inTheAppBar && (
        <AppBarContainer
          onClick={handleWeb3ButtonClick}
          ref={containerRef}
          className={`web3-connect-btn`}
        >
          <div className="image-container">
            <img
              src={
                connector?.id === 'walletConnect'
                  ? '/assets/wallets/WalletConnect-Icon.svg'
                  : '/assets/wallets/MetaMask_Fox.svg'
              }
            />
          </div>
          {!isConnected ? (
            <Web3Button>Connect Wallet</Web3Button>
          ) : (
            <>
              <Web3Button>
                <div className="wallet-info">
                  <p className="chain">
                    {connector?.name ?? 'Metamask'} @ {chain}
                  </p>
                  <p>eth: {truncateEthereumAddress(account as string)}</p>
                </div>
                <div className="dropdown-icon">
                  <DropdownArrow src="/assets/dropdown-arrow.svg" />
                </div>
              </Web3Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                disableScrollLock={true}
              >
                <MenuItem onClick={handleDisconnectMM}>Disconnect</MenuItem>
              </Menu>
            </>
          )}
        </AppBarContainer>
      )}
      <Modal
        open={modalOpen}
        onClose={handleClose}
        title={localError ? 'ERROR' : 'CONNECT A WALLET'}
        disableScrollLock={true}
        style={{ height: '270px' }}
      >
        {!localError && (
          <ConnectWalletContent>
            {connectors.map((connector) => (
              <WalletButton
                key={connector.id}
                disabled={!connector.ready}
                onClick={() => {
                  handleConnectToWallet(connector);
                }}
                wallet={connector.id}
              />
            ))}
            <p>
              By connecting a wallet, you agree to HOPR’s Terms of Service and acknowledge that you have read and
              understand the Disclaimer.
            </p>
          </ConnectWalletContent>
        )}
        <ErrorContent>
          {localError && !walletPresent && <p>Wallet was not detected. Please install a wallet, e.g. MetaMask</p>}
          {localError && walletPresent && <p>{localError}</p>}
        </ErrorContent>
      </Modal>
    </>
  );
}
