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
      state.onboarding.step = 0;
      state.onboarding.notFinished = false;
    },
    addSafe: (state, action) => {
      state.safes.data = [...state.safes.data, action.payload];
    },
    setOnboardingStep: (state, action) => {
      state.onboarding.step = action.payload;
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const stakingHubActions = stakingHubSlice.actions;
export const stakingHubActionsAsync = actionsAsync;
export default stakingHubSlice.reducer;
