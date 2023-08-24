import styled from '@emotion/styled';
import { useEffect, useRef, useState } from 'react';
import WalletButton from '../../future-hopr-lib-components/Button/wallet-button';
import Modal from '../../future-hopr-lib-components/Modal';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';
import { safeActions } from '../../store/slices/safe';
import { stakingHubActions, stakingHubActionsAsync } from '../../store/slices/stakingHub';

// wagmi
import { Button, Menu, MenuItem } from '@mui/material';
import { Connector, useConnect, useDisconnect } from 'wagmi';
import { truncateEthereumAddress } from '../../utils/blockchain';
import { web3Actions } from '../../store/slices/web3';

const AppBarContainer = styled(Button)`
  align-items: center;
  display: flex;
  cursor: pointer;
  height: 59px;
  justify-content: center;
  width: 285px;
  border-radius: 0;
  & .image-container {
    height: 50px;
    width: 50px;
    & img {
      width: 100%;
      height: 100%;
    }
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
  const {
    connectors,
    connect,
    error,
    data,
  } = useConnect();

  const { disconnect } = useDisconnect();
  const account = useAppSelector((store) => store.web3.account);
  const isConnected = useAppSelector((store) => store.web3.status.connected);
  const chain = useAppSelector((store) => store.web3.chain);
  const walletPresent = useAppSelector((store) => store.web3.walletPresent);
  const [localError, set_localError] = useState<false | string>(false);
  const [currentAccount, set_currentAccount] = useState('');
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
    if (isConnected) {
      console.log('isConnected');
      dispatch(stakingHubActionsAsync.getHubSafesByOwnerThunk(account));
      handleClose();
    }
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

  useEffect(() => {
    if (error) set_localError(JSON.stringify(error));
    else set_localError(false);
  }, [error]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    set_chooseWalletModal(false);
    setTimeout(() => {
      set_localError(false);
    }, 250);
  };

  const handleConnectToWallet = (connector: Connector) => {
    dispatch(web3Actions.setLoading(true));

    connect({ connector });

    // wallet connect opens another modal
    if (isConnected || connector.id === 'walletConnect') {
      handleClose();
    }
  };

  const handleDisconnectMM = () => {
    disconnect();
    dispatch(appActions.resetSafeState());
    dispatch(web3Actions.resetState());
    dispatch(safeActions.resetState());
    dispatch(stakingHubActions.resetState());
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
      set_chooseWalletModal(true);
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
                data?.connector?.id === 'walletConnect'
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
                    {data?.connector?.name ?? 'Metamask'} @ {chain}
                  </p>
                  <p>eth: {truncateEthereumAddress(currentAccount)}</p>
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
        open={chooseWalletModal}
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
        {localError && !walletPresent && <p>Wallet was not detected. Please install a wallet, e.g. MetaMask</p>}
        {localError && walletPresent && <p>{localError}</p>}
      </Modal>
    </>
  );
}
