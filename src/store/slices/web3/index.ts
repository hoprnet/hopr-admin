import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createExtraReducers } from './actionsAsync';

const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.status.loading = action.payload;
    },
    setConnected(state, action) {
      state.status.connected = action.payload;
      if (state.status.connected) state.status.loading = false;
    },
    setAccount(state, action) {
      state.account = action.payload ? action.payload : null;
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const web3Actions = web3Slice.actions;
export default web3Slice.reducer;