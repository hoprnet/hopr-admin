import { createSlice } from '@reduxjs/toolkit';
import { actionsAsync, createAsyncReducer } from './actionsAsync';
import { initialState } from './initialState';

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
    setDisconnecting(state, action) {
      state.status.disconnecting = action.payload ? action.payload : false;
    },
    setModalOpen(state, action) {
      state.modalOpen = action.payload ? action.payload : false;
    },
    setWalletPresent(state, action) {
      state.status.walletPresent = action.payload;
      state.status.loading = false;
    },
    setHasCommunityNftId(state, action) {
      state.communityNftId = action.payload;
    },
    setCommunityNftTransferring(state, action) {
      state.communityNftTransferring = action.payload;
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
  extraReducers: (builder) => createAsyncReducer(builder),
});

export const web3Actions = web3Slice.actions;
export const web3ActionsAsync = actionsAsync;
export default web3Slice.reducer;
