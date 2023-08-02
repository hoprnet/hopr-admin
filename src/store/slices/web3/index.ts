import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { createExtraReducers } from './actionsAsync';

const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {
    resetState: () => initialState,
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
    setChainId(state, action) {
      state.chainId = action.payload ? action.payload : null;
    },
    setChain(state, action) {
      state.chain = action.payload ? action.payload : null;
    },
    setWallet(state, action) {
      state.wallet = action.payload ? action.payload : null;
    },
    setHasCommunityNFT(state, action: PayloadAction<boolean>) {
      state.hasCommunityNFT = action.payload
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const web3Actions = web3Slice.actions;
export default web3Slice.reducer;
