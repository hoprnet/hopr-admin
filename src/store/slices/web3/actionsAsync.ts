import { createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { initialState } from './initialState';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const connect = createAsyncThunk('web3/connect', async () => {
  return '16x';
});

export const createExtraReducers = (
  builder: ActionReducerMapBuilder<typeof initialState>
) => {
  builder.addCase(connect.fulfilled, (state, action) => {
    if (action.payload) {
      state.status.connected = true;
      state.account = action.payload;
    }
  });
};

export const actionsAsync = {
  connect,
};
