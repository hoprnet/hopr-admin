import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createExtraReducers } from './actionsAsync';

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
    setInfoFetching(state, action: PayloadAction<boolean>) {
      state.info.isFetching = action.payload;
    },
    setSelectedSafeFetching(state, action: PayloadAction<boolean>) {
      state.selectedSafeAddress.isFetching = action.payload;
    },
    setSafeByOwnerFetching(state, action: PayloadAction<boolean>) {
      state.safesByOwner.isFetching = action.payload;
    },
    setSafeTransactionsFetching(state, action: PayloadAction<boolean>) {
      state.allTransactions.isFetching = action.payload;
    },
    setSafePendingTransactionsFetching(state, action: PayloadAction<boolean>) {
      state.pendingTransactions.isFetching = action.payload;
    },
    setSafeDelegatesFetching(state, action: PayloadAction<boolean>) {
      state.delegates.isFetching = action.payload;
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const safeActions = safeSlice.actions;
export const safeActionsAsync = actionsAsync;
export default safeSlice.reducer;
