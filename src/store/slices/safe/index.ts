import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createExtraReducers } from './actionsAsync';

const safeSlice = createSlice({
  name: 'safe',
  initialState,
  reducers: { resetState: (state) => {
    state.selectedSafeAddress = null;
    state.info = null;
    state.allTransactions = null;
    state.pendingTransactions = null;
    state.safesByOwner = [];
    state.delegates = null;
  } },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const safeActions = safeSlice.actions;
export const safeActionsAsync = actionsAsync;
export default safeSlice.reducer;
