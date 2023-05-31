import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { actionsAsync, createExtraReducers } from './actionsAsync';
import { initialState } from './initialState';

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    setInitiating(state) {
      console.log('SDK initiating');
      state.status.initiating = true;
    },
    setInitiated(state) {
      console.log('SDK setInitiated');
      state.status.initiating = false;
      state.status.initiated = true;
    },
    messageReceived(
      state,
      action: PayloadAction<(typeof initialState.messages)[0]>
    ) {
      state.messages.push(action.payload);
    },
    // handle ws state
    updateWebsocketStatus(state, action: PayloadAction<boolean>) {
      state.websocketConnected = action.payload;
    },
    // user actions to open and close ws
    initializeWebsocket() {},
    closeWebsocket() {},
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const nodeActions = nodeSlice.actions;
export const nodeActionsAsync = actionsAsync;
export default nodeSlice.reducer;
