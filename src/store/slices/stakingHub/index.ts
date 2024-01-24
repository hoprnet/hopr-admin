import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createAsyncReducer } from './actionsAsync';

const stakingHubSlice = createSlice({
  name: 'stakingHub',
  initialState,
  reducers: {
    resetState: () => initialState,
    resetStateWithoutMagicLinkForOnboarding: (state) => {
      const nodeAddressProvidedByMagicLink = state.onboarding.nodeAddressProvidedByMagicLink;
      const initialStateCopy = JSON.parse(JSON.stringify(initialState));
      if (nodeAddressProvidedByMagicLink) state.onboarding.nodeAddressProvidedByMagicLink = nodeAddressProvidedByMagicLink;
      return initialStateCopy;
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
    addOwnerToSafe: (state, action) => {
      state.safeInfo.data.owners.push(
        {
          owner: {
            id: action.payload
          }
        }
      )
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
    setConfigUpdated: (state) => {
      state.config.needsUpdate.data = false;
      state.config.needsUpdate.strategy = null;
    },
    setNextOnboarding: (state, action: {
      payload: {
        nodeAddress: string,
        key: 'includedInModule' | 'registeredNodesInNetworkRegistry',
        value: boolean
    }}) => {
      if( typeof(action?.payload?.nodeAddress) === 'string' &&
          typeof(action?.payload?.value) === 'boolean'
        ) {
          const nodeAddress = action.payload.nodeAddress.toLocaleLowerCase();
          if(state.nodes[nodeAddress]) {
            state.nodes[nodeAddress][action.payload.key] = action.payload.value;
          }
      }
    },
  },
  extraReducers: (builder) => {
    createAsyncReducer(builder);
  },
});

export const stakingHubActions = stakingHubSlice.actions;
export const stakingHubActionsAsync = actionsAsync;
export default stakingHubSlice.reducer;
