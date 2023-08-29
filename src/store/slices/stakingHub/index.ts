import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createAsyncReducer } from './actionsAsync';

const stakingHubSlice = createSlice({
  name: 'stakingHub',
  initialState,
  reducers: {
    resetState: (state) => {
      state.safes.data = [];
      state.safes.isFetching = false;
      state.onboarding = {
        step: 0,
        nodeAddress: null,
        safeAddress: null,
        moduleAddress: null,
        notFinished: false,
        userIsInOnboarding: false,
      };
    },
    addSafe: (state, action) => {
      state.safes.data = [...state.safes.data, action.payload];
    },
    addSafeAndUseItForOnboarding: (state, action) => {
      state.safes.data = [...state.safes.data, action.payload];
      state.onboarding.safeAddress = action.payload.safeAddress;
      state.onboarding.moduleAddress = action.payload.moduleAddress;
    },
    useSafeForOnboarding: (state, action) => {
      state.onboarding.safeAddress = action.payload.safeAddress;
      state.onboarding.moduleAddress = action.payload.moduleAddress;
    },
    setOnboardingNodeAddress: (state, action) => {
      state.onboarding.nodeAddress = action.payload;
    },
    setOnboardingStep: (state, action) => {
      state.onboarding.step = action.payload;
    },
  },
  extraReducers: (builder) => {
    createAsyncReducer(builder);
  },
});

export const stakingHubActions = stakingHubSlice.actions;
export const stakingHubActionsAsync = actionsAsync;
export default stakingHubSlice.reducer;
