import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActions, safeActionsAsync } from '../../store/slices/safe';

import { useEthersSigner } from '../../hooks';

import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';
import Button from '../../future-hopr-lib-components/Navbar/navButton';
import { observePendingSafeTransactions } from '../../hooks/useWatcher/safeTransactions';
import { appActions } from '../../store/slices/app';

const AppBarContainer = styled.div`
  align-items: center;
  border-right: 1px lightgray solid;
  display: flex;
  height: 59px;
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

const SafeSelect = styled(Select)`
  width: 170px;
  height: 25px;
`;

const DropdownArrow = styled.img`
  padding-top: 5px;
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
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);

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

  const shorterAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4, address.length)}`;
  };

  return (
    <>
      <AppBarContainer>
        <div className="image-container">
          <img
            src="/assets/safe-icon.svg"
            alt="Safe Icon"
          />
        </div>
        {connected.connected ? (
          <>
            <SafeSelect
              value={selectedSafeAddress}
              placeholder="Select Safe"
              onChange={(e) => {
                useSelectedSafe(e.target.value as string);
              }}
              renderValue={() => shorterAddress(selectedSafeAddress)}
              variant="standard"
              disableUnderline
              IconComponent={(props) => (
                <DropdownArrow
                  src="/assets/dropdown-arrow.svg"
                  {...props}
                />
              )}
            >
              {safes.map((safeAddress) => (
                <MenuItem
                  key={safeAddress}
                  value={safeAddress}
                >
                  {shorterAddress(safeAddress)}
                </MenuItem>
              ))}
            </SafeSelect>
          </>
        ) : (
          <DisabledButton disabled>Select Safe</DisabledButton>
        )}
      </AppBarContainer>
    </>
  );
}
