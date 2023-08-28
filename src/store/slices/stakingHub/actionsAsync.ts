import { ActionReducerMapBuilder, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { initialState } from './initialState';

import NetworkRegistryAbi from '../../../abi/network-registry-abi.json'
import { HOPR_NETWORK_REGISTRY } from '../../../../config';
import { WalletClient, publicActions } from 'viem';

const getHubSafesByOwnerThunk = createAsyncThunk<
  {
    moduleAddress: string;
    safeAddress: string;
  }[],
  string,
  { state: RootState }
>(
  'stakingHub/getHubSafesByOwner',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setHubSafesByOwnerFetching(true));
    try {
      const resp = await fetch('https://stake.hoprnet.org/api/hub/getSafes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerAddress: payload }),
      });
      const json: { moduleaddress: string; safeaddress: string }[] = await resp.json();
      const mapped = json.map((elem) => {
        return {
          moduleAddress: elem.moduleaddress,
          safeAddress: elem.safeaddress,
        };
      });
      return mapped;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().stakingHub.safes.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);


const registerNodeAndSafeToNRThunk = createAsyncThunk<
  | {
      transactionHash: string;
    }
  | undefined,
  {
    walletClient: WalletClient;
    nodeAddress: string;
    safeAddress: string;
  },
  { state: RootState }
>(
  'safe/registerNodeAndSafeToNR',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    try {
      const superWalletClient = payload.walletClient.extend(publicActions);

      if (!superWalletClient.account) return;

      const {
        result,
        request,
      } = await superWalletClient.simulateContract({
        account: payload.walletClient.account,
        address: HOPR_NETWORK_REGISTRY,
        abi: NetworkRegistryAbi,
        functionName: 'managerRegiester',
        args: [payload.safeAddress, payload.nodeAddress],
      });

      const transactionHash = await superWalletClient.writeContract(request);

      await superWalletClient.waitForTransactionReceipt({ hash: transactionHash });

      console.log('registerNodeAndSafeToNR hash', transactionHash)

      return { transactionHash };
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);


// Helper actions to update the isFetching state
const setHubSafesByOwnerFetching = createAction<boolean>('stakingHub/setHubSafesByOwnerFetching');

export const createAsyncReducer = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  // getSafesByOwner
  builder.addCase(getHubSafesByOwnerThunk.fulfilled, (state, action) => {
    if (action.payload) {
      console.log(action.payload);
      state.safes.data = action.payload;

      if (action.payload.length > 0) {
        //  state.onboarding.notFinished = true;
        //   state.onboarding.step = 2;
      }
    }
    state.safes.isFetching = false;
  });
};

export const actionsAsync = { 
  getHubSafesByOwnerThunk,
  registerNodeAndSafeToNRThunk
};
