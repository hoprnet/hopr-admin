import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { environment } from '../../../config';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActions, safeActionsAsync } from '../../store/slices/safe';
import { stakingHubActions, stakingHubActionsAsync } from '../../store/slices/stakingHub';

import { useEthersSigner } from '../../hooks';

import { Button, Menu, MenuItem } from '@mui/material';
import { observePendingSafeTransactions } from '../../hooks/useWatcher/safeTransactions';
import { appActions } from '../../store/slices/app';
import { truncateEthereumAddress } from '../../utils/blockchain';

//web3
import { browserClient } from '../../providers/wagmi';

const AppBarContainer = styled(Button)`
  align-items: center;
  border-right: 1px lightgray solid;
  display: none;
  align-items: center;
  height: 59px;
  cursor: pointer;
  justify-content: center;
  width: 250px;
  gap: 10px;
  border-radius: 0;
  &.display {
    display: flex;
  }
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
  const isConnected = useAppSelector((store) => store.web3.status.connected);
  const safes = useAppSelector((store) => store.stakingHub.safes.data);
  const safeAddress = useAppSelector((store) => store.safe.selectedSafeAddress.data);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State variable to hold the anchor element for the menu
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);
  const activePendingSafeTransaction = useAppSelector(
    (store) => store.app.configuration.notifications.pendingSafeTransaction,
  );

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
    const fetchInitialStateForSigner = async () => {
      if (signer) {
        dispatch(safeActions.resetState());
        dispatch(stakingHubActions.resetStateWithoutMagicLinkForOnboarding());
        dispatch(safeActionsAsync.getSafesByOwnerThunk({ signer }));
      }
    };

    fetchInitialStateForSigner();
  }, [signer]);

  useEffect(() => {
    if (safes.length > 0 && !safeAddress) {
      dispatch(safeActions.setSelectedSafe(safes[0].safeAddress));
    }
  }, [safes, safeAddress]);

  useEffect(() => {
    if (safeAddress && browserClient && safes) {
      useSelectedSafe(safeAddress);
      dispatch(
        stakingHubActionsAsync.getOnboardingDataThunk({
          browserClient,
          safeAddress,
          safes,
        }),
      );
    }
  }, [safeAddress]);

  const useSelectedSafe = async (safeAddress: string) => {
    if (signer) {
      dispatch(appActions.resetState());
      dispatch(safeActions.setSelectedSafe(safeAddress));
      observePendingSafeTransactions({
        dispatch,
        active: activePendingSafeTransaction,
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
    if (isConnected && safes.length > 0) {
      handleOpenMenu(event);
    }
  };

  return (
    <AppBarContainer
      onClick={handleSafeButtonClick}
      ref={menuRef}
      disabled={!isConnected}
      className={`safe-connect-btn ${safeAddress ? 'safe-connected' : 'safe-not-connected'} ${
        environment === 'dev' ? 'display' : 'display-none'
      }`}
    >
      <div className="image-container">
        <img
          src="/assets/safe-icon.svg"
          alt="Safe Icon"
        />
      </div>
      {isConnected ? (
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
            MenuListProps={{
              'aria-labelledby': 'safe-menu-button',
              className: 'safe-menu-list',
            }}
            disableScrollLock={true}
          >
            {safes.map((safe, index) => (
              <MenuItem
                key={`${safe.safeAddress}_${index}`}
                value={safe.safeAddress}
                onClick={() => {
                  useSelectedSafe(safe.safeAddress);
                }}
              >
                {safe.safeAddress &&
                  `${safe.safeAddress.substring(0, 6)}...${safe.safeAddress.substring(
                    safe.safeAddress.length - 8,
                    safe.safeAddress.length,
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
