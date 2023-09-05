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
        nodeAddressProvidedByMagicLink: null,
        safeAddress: null,
        moduleAddress: null,
        notFinished: false,
        userIsInOnboarding: false,
        nodeXDaiBalance: null,
        isFetching: false,
        notStarted: null,
        modalToSartOnboardingDismissed: false,
        nodeBalance: {
          xDai: {
            value: null,
            formatted: null,
          },
        }
      };
    },
    resetStateWithoutMagicLinkForOnboarding: (state) => {
      state.safes.data = [];
      state.safes.isFetching = false;
      state.onboarding.step= 0;
      state.onboarding.nodeAddress= null;
      state.onboarding.safeAddress=null;
      state.onboarding.moduleAddress= null;
      state.onboarding.notFinished= false;
      state.onboarding.userIsInOnboarding= false;
      state.onboarding.nodeXDaiBalance= null;
      state.onboarding.isFetching= false;
      state.onboarding.notStarted= null;
      state.onboarding.nodeBalance= {
        xDai: {
          value: null,
          formatted: null,
        },
      }
    },
    resetOnboardingState: (state) => {
      state.onboarding = {
        step: 0,
        nodeAddress: null,
        nodeAddressProvidedByMagicLink: null,
        safeAddress: null,
        moduleAddress: null,
        notFinished: false,
        userIsInOnboarding: false,
        nodeXDaiBalance: null,
        isFetching: false,
        notStarted: null,
        modalToSartOnboardingDismissed: false,
        nodeBalance: {
          xDai: {
            value: null,
            formatted: null,
          },
        }
      };
    },
    dismissModalToSartOnboarding: (state) => {
      state.onboarding.modalToSartOnboardingDismissed = true;
    },
    onboardingIsFetching: (state, action) => {
      state.onboarding.isFetching = action.payload;
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
      if (action.payload.nodeXDaiBalance) state.onboarding.nodeXDaiBalance = action.payload.nodeXDaiBalance;
    },
    setNodeAddressProvidedByMagicLink: (state, action) => {
      state.onboarding.nodeAddressProvidedByMagicLink = action.payload;
    },
    setOnboardingNodeAddress: (state, action) => {
      state.onboarding.nodeAddress = action.payload;
    },
    setOnboardingStep: (state, action) => {
      state.onboarding.step = action.payload;
    },
    setNodeLinkedToSafeBalance_xDai: (state, action) => {
      state.onboarding.nodeBalance.xDai.value = action.payload ? action.payload.value : null;
      state.onboarding.nodeBalance.xDai.formatted = action.payload ? action.payload.formatted : null;
    },
  },
  extraReducers: (builder) => {
    createAsyncReducer(builder);
  },
});

export const stakingHubActions = stakingHubSlice.actions;
export const stakingHubActionsAsync = actionsAsync;
export default stakingHubSlice.reducer;
