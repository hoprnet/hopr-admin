import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { GetInfoResponseType, api } from '@hoprnet/hopr-sdk';
import { nodeActionsAsync } from '../node';
import { parseEther } from 'viem';
import { RootState } from '../..';
const { getInfo } = api;

export const loginThunk = createAsyncThunk<
  GetInfoResponseType | undefined,
  { apiToken: string; apiEndpoint: string },
  { state: RootState }
>('auth/login', async (loginData: { apiToken: string; apiEndpoint: string }, {
  rejectWithValue,
  dispatch,
}) => {
  const {
    apiEndpoint,
    apiToken,
  } = loginData;
  try {
    const info = await getInfo({
      apiEndpoint: apiEndpoint,
      apiToken: apiToken,
    });
    return info;
  } catch (e) {
    // see if connecting error is due to low balance
    const nodeBalances = await dispatch(
      nodeActionsAsync.getBalancesThunk({
        apiEndpoint,
        apiToken,
      }),
    ).unwrap();

    const addresses = await dispatch(
      nodeActionsAsync.getAddressesThunk({
        apiToken,
        apiEndpoint,
      }),
    ).unwrap();

    const minimumNodeBalance = parseEther('0.001');

    if (nodeBalances?.native && BigInt(nodeBalances.native) < minimumNodeBalance) {
      return rejectWithValue(`Your xDai balance seems to low to operate the node. 
        \n Please top up your node.
        \n Address: ${addresses?.native}`);
    }

    return rejectWithValue(e);
  }
});

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(loginThunk.pending, (state) => {
    state.status.connecting = true;
    state.status.connected = false;
    state.status.error = null;
  });
  builder.addCase(loginThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.status.connecting = false;
      state.status.connected = true;
      state.status.error = null;
    }
  });
  builder.addCase(loginThunk.rejected, (state, meta) => {
    state.status.connecting = false;
    console.log(meta);
    state.status.error = 'Unable to connect.\n\n' + JSON.stringify(meta.error);
  });
};

export const actionsAsync = { loginThunk };
