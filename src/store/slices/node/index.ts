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
    setInfo(state, action) {
      state.info = action.payload;
    },
    messageReceived(state, action: PayloadAction<(typeof initialState.messages)[0]>) {
      state.messages.push(action.payload);
      if (state.messages.length > 100)
        state.messages = state.messages.slice(state.messages.length - 100, state.messages.length);
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
    // Action to update the isFetching state
    setAliasesFetching(state, action: PayloadAction<boolean>) {
      state.aliases.isFetching = action.payload;
    },
    setInfoFetching(state, action: PayloadAction<boolean>) {
      state.info.isFetching = action.payload;
    },
    setMetricsFetching(state, action: PayloadAction<boolean>) {
      state.metrics.isFetching = action.payload;
    },
    setAddressesFetching(state, action: PayloadAction<boolean>) {
      state.addresses.isFetching = action.payload;
    },
    setBalancesFetching(state, action: PayloadAction<boolean>) {
      state.balances.isFetching = action.payload;
    },
    setChannelsFetching(state, action: PayloadAction<boolean>) {
      state.channels.isFetching = action.payload;
    },
    setPeersFetching(state, action: PayloadAction<boolean>) {
      state.peers.isFetching = action.payload;
    },
    setPeerInfoFetching(state, action: PayloadAction<boolean>) {
      state.peerInfo.isFetching = action.payload;
    },
    setEntryNodesFetching(state, action: PayloadAction<boolean>) {
      state.entryNodes.isFetching = action.payload;
    },
    setSettingsFetching(state, action: PayloadAction<boolean>) {
      state.settings.isFetching = action.payload;
    },
    setStatisticsFetching(state, action: PayloadAction<boolean>) {
      state.statistics.isFetching = action.payload;
    },
    setTicketsFetching(state, action: PayloadAction<boolean>) {
      state.tickets.isFetching = action.payload;
    },
    setTokensFetching(state, action: PayloadAction<boolean>) {
      state.tokens.isFetching = action.payload;
    },
    setVersionFetching(state, action: PayloadAction<boolean>) {
      state.version.isFetching = action.payload;
    },
    setTransactionsFetching(state, action: PayloadAction<boolean>) {
      state.transactions.isFetching = action.payload;
    },
  },
  extraReducers: (builder) => createExtraReducers(builder),
});

export const nodeActions = nodeSlice.actions;
export const nodeActionsAsync = actionsAsync;
export default nodeSlice.reducer;
