import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { api } from '@hoprnet/hopr-sdk';
const { getInfo } = api;

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (loginData: { apiToken: string; apiEndpoint: string }) => {
    const info = await getInfo({
      apiEndpoint: loginData.apiEndpoint,
      apiToken: loginData.apiToken,
    });
    return info;
  },
);

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(loginThunk.pending, (state) => {
    state.status.connecting = true;
    state.status.connected = false;
  });
  builder.addCase(loginThunk.fulfilled, (state, action) => {
    if(action.payload) {
      state.status.connecting = false;
      state.status.connected = true;
    }
  });
  builder.addCase(loginThunk.rejected, (state) => {
    state.status.connecting = false;
  });
};

export const actionsAsync = { loginThunk };
