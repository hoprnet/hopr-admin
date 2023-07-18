import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { api } from '@hoprnet/hopr-sdk';
const { getInfo } = api;

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (loginData: { apiToken: string; apiEndpoint: string }, { rejectWithValue }) => {
    try {
      const info = await getInfo({
        apiEndpoint: loginData.apiEndpoint,
        apiToken: loginData.apiToken,
      });
      return info;
    } catch (e) {
      return rejectWithValue(e)
    } 
  },
);

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(loginThunk.pending, (state, meta) => {
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
