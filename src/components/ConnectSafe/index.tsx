import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActions, safeActionsAsync } from '../../store/slices/safe';

import { useEthersSigner } from '../../hooks';

import { Button, Menu, MenuItem } from '@mui/material';
import { observePendingSafeTransactions } from '../../hooks/useWatcher/safeTransactions';
import { appActions } from '../../store/slices/app';
import { truncateEthereumAddress } from '../../utils/helpers';

const AppBarContainer = styled(Button)`
  align-items: center;
  border-right: 1px lightgray solid;
  display: flex;
  align-items: center;
  height: 59px;
  cursor: pointer;
  justify-content: center;
  width: 250px;
  gap: 10px;
  border-radius: 0;
  .image-container {
    height: 50px;
    width: 50px;
    img {
      height: 100%;
      width: 100%;
    }
  }
  &.safe-not-connected {
    img {
      filter: opacity(0.5);
    }
  }
`;

const Content = styled.div`
  font-family: 'Source Code Pro';
  font-size: 18px;
  width: 170px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
  font-size: 14px;
  gap: 10px;
  color: #414141;
`;

const DropdownArrow = styled.img`
  align-self: center;
`;

const DisabledButton = styled.div`
  width: 170px;
  color: #969696;
`;

const SafeAddress = styled.div`
  font-family: 'Source Code Pro';
  font-size: 18px;
  width: 170px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  justify-content: space-evenly;
  font-size: 14px;
  gap: 10px;
  color: #414141;
`;

export default function ConnectSafe() {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const connected = useAppSelector((selector) => selector.web3.status);
  const safes = useAppSelector((selector) => selector.safe.safesByOwner.data);
  const safeAddress = useAppSelector((selector) => selector.safe.selectedSafeAddress.data);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State variable to hold the anchor element for the menu
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);

  const menuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Event listener callback to close the menu
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    // Attach the event listener to the document
    document.addEventListener('click', handleOutsideClick);

    // Cleanup the event listener when the component is unmounted
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    fetchInitialStateForSigner();
  }, [signer]);

  useEffect(() => {
    if (safeAddress) useSelectedSafe(safeAddress);
  }, [safeAddress]);

  const fetchInitialStateForSigner = async () => {
    if (signer) {
      dispatch(safeActions.resetState());
      dispatch(safeActionsAsync.getSafesByOwnerThunk({ signer }));
    }
  };

  const useSelectedSafe = (safeAddress: string) => {
    if (signer) {
      dispatch(appActions.resetState());
      observePendingSafeTransactions({
        dispatch,
        previousState: prevPendingSafeTransaction,
        selectedSafeAddress: safeAddress,
        signer,
        updatePreviousData: (newData) => {
          dispatch(appActions.setPrevPendingSafeTransaction(newData));
        },
      });
      dispatch(
        safeActionsAsync.getSafeInfoThunk({
          signer: signer,
          safeAddress,
        }),
      );
      dispatch(
        safeActionsAsync.getAllSafeTransactionsThunk({
          signer,
          safeAddress,
        }),
      );
      dispatch(
        safeActionsAsync.getSafeDelegatesThunk({
          signer,
          options: { safeAddress },
        }),
      );
    }
  };

  // New function to handle opening the menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // New function to handle closing the menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleSafeButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    if (connected.connected) {
      handleOpenMenu(event);
    }
  };

  return (
    <AppBarContainer
      onClick={handleSafeButtonClick}
      ref={menuRef}
      disabled={!connected.connected}
      className={`safe-connect-btn ${safeAddress ? 'safe-connected' : 'safe-not-connected'}`}
    >
      <div className="image-container">
        <img
          src="/assets/safe-icon.svg"
          alt="Safe Icon"
        />
      </div>
      {connected.connected ? (
        <>
          <SafeAddress>
            {truncateEthereumAddress(safeAddress || '...') || '...'} <DropdownArrow src="/assets/dropdown-arrow.svg" />
          </SafeAddress>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            disableScrollLock={true}
            MenuListProps={{
              'aria-labelledby': 'safe-menu-button',
              className: 'safe-menu-list',
            }}
          >
            {safes.map((safeAddress) => (
              <MenuItem
                key={safeAddress}
                value={safeAddress}
                onClick={() => useSelectedSafe(safeAddress)}
              >
                {safeAddress &&
                  `${safeAddress.substring(0, 6)}...${safeAddress.substring(
                    safeAddress.length - 8,
                    safeAddress.length,
                  )}`}
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <DisabledButton>Connect Wallet</DisabledButton>
      )}
    </AppBarContainer>
  );
}
