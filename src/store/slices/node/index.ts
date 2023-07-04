import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { actionsAsync, createExtraReducers } from './actionsAsync';
import { initialState } from './initialState';

const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    resetState: () => initialState,
    setInitiating(state) {
      console.log('SDK initiating');
      state.status.initiating = true;
    },
    setInitiated(state) {
      console.log('SDK setInitiated');
      state.status.initiating = false;
      state.status.initiated = true;
    },
    messageReceived(state, action: PayloadAction<(typeof initialState.messages)[0]>) {
      state.messages.push(action.payload);
      if(state.messages.length > 100 ) state.messages = state.messages.slice(state.messages.length-100, state.messages.length);
    },
    toggleMessageSeen(state, action: PayloadAction<(typeof initialState.messages)[0]>) {
      state.messages = state.messages.map((message) => {
        if (message.id === action.payload.id) {
          return {
            ...message,
            seen: !message.seen,
          };
        }
        return message;
      });
    },
    logsReceived(state, action: PayloadAction<(typeof initialState.logs)[0]>) {
      state.logs.push(action.payload);
    },
    // handle ws state
    updateMessagesWebsocketStatus(state, action: PayloadAction<typeof initialState.messagesWebsocketStatus>) {
      state.messagesWebsocketStatus = action.payload;
    },
    updateLogsWebsocketStatus(state, action: PayloadAction<typeof initialState.messagesWebsocketStatus>) {
      state.logsWebsocketStatus = action.payload;
    },
    // user actions to open and close ws
    initializeMessagesWebsocket() {
      // state changes in node middleware
    },
    initializeLogsWebsocket() {
      // state changes in node middleware
    },
    closeMessagesWebsocket() {
      // state changes in node middleware
    },
    closeLogsWebsocket() {
      // state changes in node middleware
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const nodeActions = nodeSlice.actions;
export const nodeActionsAsync = actionsAsync;
export default nodeSlice.reducer;
