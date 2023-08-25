import { ActionReducerMapBuilder, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { RootState } from '../..';

const getHubSafesByOwnerThunk = createAsyncThunk<any | undefined, any, { state: RootState }>(
  'stakingHub/getHubSafesByOwner',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setHubSafesByOwnerFetching(true));
    try {
      const resp = await fetch('https://stake.hoprnet.org/api/hub/getSafes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerAddress: payload }),
      });
      const json = await resp.json();
      const mapped = json.map((elem: { moduleaddress: string; safeaddress: string }) => {
        return {
          moduleAddress: elem.moduleaddress,
          safeAddress: elem.safeaddress,
        };
      });
      return mapped;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().stakingHub.safes.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

// Helper actions to update the isFetching state
const setHubSafesByOwnerFetching = createAction<boolean>('stakingHub/setHubSafesByOwnerFetching');

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  // getSafesByOwner
  builder.addCase(getHubSafesByOwnerThunk.fulfilled, (state, action) => {
    if (action.payload) {
      console.log(action.payload);
      state.safes.data = action.payload;

      if (action.payload.length > 0) {
        state.onboarding.notFinished = true;
        state.onboarding.step = 2;
      }
    }
    state.safes.isFetching = false;
  });
};

export const actionsAsync = { getHubSafesByOwnerThunk };
