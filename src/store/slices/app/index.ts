import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { GetBalancesResponseType, GetChannelsResponseType, GetInfoResponseType } from '@hoprnet/hopr-sdk';
import { WatcherMessage } from '../../../hooks/useWatcher/messages';
import { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { saveStateToLocalStorage } from '../../../utils/localStorage';

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetState: () => initialState,
    resetNodeState: (state) => ({
      ...state,
      previousStates: {
        ...state.previousStates,
        prevChannels: null,
        prevMessage: null,
        prevNodeBalances: null,
        prevNodeInfo: null,
      },
    }),
    resetSafeState: (state) => ({
      ...state,
      previousStates: {
        ...state.previousStates,
        prevPendingSafeTransaction: null,
      },
    }),
    setNotificationSettings: (state, action: PayloadAction<typeof initialState.configuration.notifications>) => {
      if (action.payload) {
        state.configuration.notifications = action.payload;
        saveStateToLocalStorage('app/configuration/notifications', action.payload);
      }
    },
    addNotification: (
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        source: string;
        timeout: number | null;
        url: string | null;
      }>,
    ) => {
      const now = Date.now();
      const defaultTimeout = 5000;
      state.notifications.push({
        ...action.payload,
        seen: false,
        interacted: false,
        timeout: action.payload.timeout ?? now + defaultTimeout,
      });
      if (state.notifications.length > 100)
        state.notifications = state.notifications.slice(state.notifications.length - 100, state.notifications.length);
    },
    seenNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? {
            ...notification,
            seen: true,
          }
          : notification,
      );
    },
    interactedWithNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload
          ? {
            ...notification,
            seen: true,
            interacted: true,
          }
          : notification,
      );
    },
    clearExpiredNotifications: (state) => {
      const now = Date.now();
      state.notifications = state.notifications.map((notification) =>
        notification.timeout < now
          ? {
            ...notification,
            seen: true,
            read: true,
          }
          : notification,
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    markSeenAllNotifications: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        seen: true,
      }));
    },
    setPrevChannels: (state, action: PayloadAction<GetChannelsResponseType | null>) => {
      state.previousStates.prevChannels = action.payload;
    },
    setPrevNodeInfo: (state, action: PayloadAction<GetInfoResponseType | null>) => {
      state.previousStates.prevNodeInfo = action.payload;
    },
    setPrevNodeBalances: (state, action: PayloadAction<GetBalancesResponseType | null>) => {
      state.previousStates.prevNodeBalances = action.payload;
    },
    setPrevMessage: (state, action: PayloadAction<WatcherMessage>) => {
      state.previousStates.prevMessage = action.payload;
    },
    setPrevPendingSafeTransaction: (state, action: PayloadAction<SafeMultisigTransactionResponse | null>) => {
      state.previousStates.prevPendingSafeTransaction = action.payload;
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
