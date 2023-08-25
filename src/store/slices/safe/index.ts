import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { actionsAsync, createAsyncReducer } from './actionsAsync';
import { createFetchingReducer } from './actionsFetching';
import { initialState } from './initialState';

const safeSlice = createSlice({
  name: 'safe',
  initialState,
  reducers: {
    resetState: (state) => {
      state.selectedSafeAddress.data = null;
      state.allTransactions.data = null;
      state.pendingTransactions.data = null;
      state.safesByOwner.data = [];
      state.info.data = null;
      state.delegates.data = null;
    },
    setSelectedSafe(state, action: PayloadAction<string>) {
      state.selectedSafeAddress.data = action.payload;
    },
    setSafeBalance_xDai(state, action) {
      state.balance.data.xDai.value = action.payload ? action.payload.value : null;
      state.balance.data.xDai.formatted = action.payload ? action.payload.formatted : null;
    },
    setSafeBalance_xHopr(state, action) {
      state.balance.data.xHopr.value = action.payload ? action.payload.value : null;
      state.balance.data.xHopr.formatted = action.payload ? action.payload.formatted : null;
    },
    setSafeBalance_wxHopr(state, action) {
      state.balance.data.wxHopr.value = action.payload ? action.payload.value : null;
      state.balance.data.wxHopr.formatted = action.payload ? action.payload.formatted : null;
    },
    setCommunityNftId(state, action: PayloadAction<number>) {
      state.communityNftId = action.payload;
    },
  },
  extraReducers: (builder) => {
    createAsyncReducer(builder), createFetchingReducer(builder);
  },
});

export const safeActions = safeSlice.actions;
export const safeActionsAsync = actionsAsync;
export default safeSlice.reducer;
