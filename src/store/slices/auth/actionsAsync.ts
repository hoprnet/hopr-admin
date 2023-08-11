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
    try {
      const nodeBalances = await dispatch(
        nodeActionsAsync.getBalancesThunk({
          payload: {
            apiEndpoint,
            apiToken,
          },
          force: true,
        }),
      ).unwrap();

      const addresses = await dispatch(
        nodeActionsAsync.getAddressesThunk({
          payload: {
            apiToken,
            apiEndpoint,
          },
          force: true,
        }),
      ).unwrap();

      const minimumNodeBalance = parseEther('0.001');

      if (nodeBalances?.native !== undefined && BigInt(nodeBalances.native) < minimumNodeBalance) {
        return rejectWithValue(
          `Your xDai balance seems to low to operate the node.\nPlease top up your node.\nAddress: ${addresses?.native}`,
        );
      }

      // stringify to make sure that
      // the error is serializable
      return rejectWithValue('Unknown error: ' + JSON.stringify(e));
    } catch (unknownError) {
      // getting balance and addresses failed
      // no way to tell if the balance is low
      return rejectWithValue('Error fetching: ' + JSON.stringify(unknownError));
    }
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
    if (meta.payload) {
      state.status.error = 'Unable to connect.\n\n' + meta.payload;
    } else if (meta.error.message) {
      state.status.error = 'Unable to connect.\n\n' + meta.error.message;
    } else {
      state.status.error = 'Unable to connect.\n\n' + 'Unknown error';
    }
  });
};

export const actionsAsync = { loginThunk };
