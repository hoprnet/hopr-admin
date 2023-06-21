import { PayloadAction, createSlice, nanoid } from '@reduxjs/toolkit';
import { initialState } from './initialState';

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<{
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
        id: nanoid(),
        seen: false,
        timeout: action.payload.timeout ?? now + defaultTimeout,
      });
    },
    seenNotification: (state, action: PayloadAction<(typeof initialState)['notifications'][0]>) => {
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload.id
          ? {
            ...notification,
            seen: true,
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
          }
          : notification,
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        seen: true,
      }));
    },
  },
});

export const appActions = appSlice.actions;
export default appSlice.reducer;
