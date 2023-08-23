import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createExtraReducers } from './actionsAsync';

const stakingHubSlice = createSlice({
  name: 'stakingHub',
  initialState,
  reducers: {
    resetState: (state) => {
      state.safes.data = [];
      state.safes.isFetching = false;
    },
    addSafe: (state, payload) => {
      state.safes.data = [...state.safes.data, payload.payload];
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const stakingHubActions = stakingHubSlice.actions;
export const stakingHubActionsAsync = actionsAsync;
export default stakingHubSlice.reducer;
