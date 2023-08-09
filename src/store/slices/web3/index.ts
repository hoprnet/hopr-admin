import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { createExtraReducers, actionsAsync } from './actionsAsync';

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
      state.hasCommunityNFT = action.payload;
    },
    setWalletBalance_xDai(state, action) {
      state.balance.xDai.value = action.payload ? action.payload.value : null;
      state.balance.xDai.formatted = action.payload ? action.payload.formatted : null;
    },
    setWalletBalance_xHopr(state, action) {
      state.balance.xHopr.value = action.payload ? action.payload.value : null;
      state.balance.xHopr.formatted = action.payload ? action.payload.formatted : null;
    },
    setWalletBalance_wxHopr(state, action) {
      state.balance.wxHopr.value = action.payload ? action.payload.value : null;
      state.balance.wxHopr.formatted = action.payload ? action.payload.formatted : null;
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const web3Actions = web3Slice.actions;
export const web3ActionsAsync = actionsAsync;
export default web3Slice.reducer;
