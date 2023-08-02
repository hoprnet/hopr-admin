import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createExtraReducers } from './actionsAsync';

const safeSlice = createSlice({
  name: 'safe',
  initialState,
  reducers: { resetState: (state) => {
    state.selectedSafeAddress.data = null;
    state.allTransactions.data = null;
    state.pendingTransactions.data = null;
    state.safesByOwner.data = [];
    state.info.data = null;
    state.delegates.data = null;
  } },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const safeActions = safeSlice.actions;
export const safeActionsAsync = actionsAsync;
export default safeSlice.reducer;
