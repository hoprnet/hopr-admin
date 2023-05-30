import { Action, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync, createExtraReducers } from './actionsAsync';

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    setInitiating(state) {
      console.log('SDK initiating');
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
    messageReceived(
      state,
      action: PayloadAction<(typeof initialState.messages)[0]>
    ) {
      state.messages.push(action.payload);
    },
    initializeWebsocket(state) {
      state.websocketConnected = true;
    },
    closeWebsocket(state) {
      state.websocketConnected = false;
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const nodeActions = nodeSlice.actions;
export const nodeActionsAsync = actionsAsync;
export default nodeSlice.reducer;
