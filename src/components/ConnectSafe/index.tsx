import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActions, safeActionsAsync } from '../../store/slices/safe';

import { useEthersSigner } from '../../hooks';

import { Button, Menu, MenuItem } from '@mui/material';
import { observePendingSafeTransactions } from '../../hooks/useWatcher/safeTransactions';
import { appActions } from '../../store/slices/app';

const AppBarContainer = styled.div`
  align-items: center;
  border-right: 1px lightgray solid;
  display: flex;
  height: 59px;
  cursor: pointer;
  justify-content: center;
  width: 250px;
  gap: 10px;
  & .image-container {
    height: 50px;
    width: 50px;
    & img {
      height: 100%;
      width: 100%;
    }
  }
`;

const SafeButton = styled(Button)`
  width: 170px;
  display: flex;
  align-items: flex-start;
  flex-direction: row;
  gap: 10px;
  color: #414141;
  &&.MuiButton-root {
    &:hover {
      background: none;
    }
  }
`;

const DropdownArrow = styled.img`
  align-self: center;
`;

const DisabledButton = styled(Button)`
  width: 170px;
`;

export default function ConnectSafe() {
  const dispatch = useAppDispatch();
  const signer = useEthersSigner();
  const connected = useAppSelector((selector) => selector.web3.status);
  const safes = useAppSelector((selector) => selector.safe.safesByOwner);
  const safeAddress = useAppSelector((selector) => selector.safe.selectedSafeAddress);
  const [selectedSafeAddress, set_selectedSafeAddress] = useState(safeAddress || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State variable to hold the anchor element for the menu
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);

  const menuRef = useRef<HTMLDivElement>(null);

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
      set_selectedSafeAddress(safeAddress);
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
      // Additional logic to connect to the safe
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

  const shorterAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;
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
    >
      <div className="image-container">
        <img
          src="/assets/safe-icon.svg"
          alt="Safe Icon"
        />
      </div>
      {connected.connected ? (
        <>
          <SafeButton disableRipple>
            {shorterAddress(selectedSafeAddress) || ''} <DropdownArrow src="/assets/dropdown-arrow.svg" />
          </SafeButton>
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
          >
            {safes.map((safeAddress) => (
              <MenuItem
                key={safeAddress}
                value={safeAddress}
                onClick={() => useSelectedSafe(safeAddress)}
              >
                {shorterAddress(safeAddress)}
              </MenuItem>
            ))}
          </Menu>
        </>
      ) : (
        <DisabledButton disabled>Connect Wallet</DisabledButton>
      )}
    </AppBarContainer>
  );
}