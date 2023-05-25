import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync } from './actionsAsync';
// TODO: assign Types from HOPR-SDK

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    setIniciating(state) {
      console.log('SDK setIniciating');
      state.status.initiating = true;
    },
    setInitiated(state, action) {
      console.log('SDK setInitiated', action);
      state.status.initiating = false;
      state.status.initiated = true;
    },
    setInfo(state, action) {
      console.log('SDK getInfo', action);
    },
  },
});

export const nodeActions = nodeSlice.actions;
export const nodeActionsAsync = actionsAsync;
export default nodeSlice.reducer;
