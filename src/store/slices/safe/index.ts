import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createExtraReducers } from './actionsAsync';

const safeSlice = createSlice({
  name: 'safe',
  initialState,
  reducers: { 
    resetState: (state) => {
      state.selectedSafeAddress = null;
      state.info = null;
      state.allTransactions = null;
      state.pendingTransactions = null;
      state.safesByOwner = [];
      state.delegates = null;
    },
    setSafeBalance_xDai(state, action) {
      state.balance.xDai.value = action.payload ? action.payload.value : null;
      state.balance.xDai.formatted = action.payload ? action.payload.formatted : null;
    },
    setSafeBalance_xHopr(state, action) {
      state.balance.xHopr.value = action.payload ? action.payload.value : null;
      state.balance.xHopr.formatted = action.payload ? action.payload.formatted : null;
    },
    setSafeBalance_wxHopr(state, action) {
      state.balance.wxHopr.value = action.payload ? action.payload.value : null;
      state.balance.wxHopr.formatted = action.payload ? action.payload.formatted : null;
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const safeActions = safeSlice.actions;
export const safeActionsAsync = actionsAsync;
export default safeSlice.reducer;
