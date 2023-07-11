import { useState, useEffect } from 'react';
import styled from '@emotion/styled';

// Store
import { useAppDispatch, useAppSelector } from '../../store';
import { safeActions, safeActionsAsync } from '../../store/slices/safe';

import { useSigner } from '../../hooks';

import Select from '@mui/material/Select';
import { MenuItem } from '@mui/material';

const AppBarContainer = styled.div`
  height: 59px;
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px lightgray solid;
`;

export default function ConnectSafe() {
  const dispatch = useAppDispatch();
  const { signer } = useSigner();
  const connected = useAppSelector((selector) => selector.web3.status);
  const safes = useAppSelector((selector) => selector.safe.safesByOwner);
  const safeAddress = useAppSelector((selector) => selector.safe.selectedSafeAddress);
  const [selectedSafeAddress, set_selectedSafeAddress] = useState(safeAddress || '');

  useEffect(() => {
    fetchInitialStateForSigner();
  }, [signer]);

  const fetchInitialStateForSigner = async () => {
    if (signer) {
      dispatch(safeActions.resetState());
      dispatch(safeActionsAsync.getSafesByOwnerThunk({ signer }));
    }
  };

  const useSelectedSafe = (safeAddress: string) => {
    if (signer) {
      set_selectedSafeAddress(safeAddress);
      dispatch(
        safeActionsAsync.getSafeInfoThunk({
          signer: signer,
          safeAddress,
        }),
      );
      // Additional logic to connect to the safe
    }
  };

  const shorterAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 6, address.length)}`;
  };

  return (
    <>
      <AppBarContainer>
        <img
          src="/assets/safe-icon.svg"
          style={{ height: '50px' }}
        />
        {connected.connected ? (
          <>
            <Select
              value={selectedSafeAddress}
              placeholder="Select Safe"
              onChange={(e) => {
                useSelectedSafe(e.target.value);
              }}
              renderValue={() => shorterAddress(selectedSafeAddress)}
              variant="standard"
              disableUnderline
            >
              {safes.map((safeAddress) => (
                <MenuItem
                  key={safeAddress}
                  value={safeAddress}
                >
                  {shorterAddress(safeAddress)}
                </MenuItem>
              ))}
            </Select>
          </>
        ) : (
          <button disabled>Select Safe</button>
        )}
      </AppBarContainer>
    </>
  );
}
