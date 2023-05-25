import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync } from './actionsAsync';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    useNodeData(state, action) {
      state.loginData.ip = action.payload.ip;
      state.loginData.apiKey = action.payload.apiKey;
      state.status.connecting = true;
    },
    setConnected(state) {
      state.status.connecting = false;
      state.status.connected = true;
    },
    addNodeData(state, action) {
      const newItem = action.payload;
      const existingItem = state.nodes.findIndex(
        (item: { ip: string }) => item.ip === newItem.ip
      );
      if (existingItem === -1) {
        state.nodes = [
          {
            ip: action.payload.ip,
            apiKey: action.payload.apiKey,
          },
          ...state.nodes,
        ];
      } else {
        state.nodes[existingItem].apiKey = action.payload.apiKey;
      }

      localStorage.setItem('admin-ui-node-list', JSON.stringify(state.nodes));
    },
    clearLocalNodes(state) {
      state.nodes = [];
      localStorage.removeItem('admin-ui-node-list');
    },
  },
});

export const authActions = authSlice.actions;
export const authActionsAsync = actionsAsync;
export default authSlice.reducer;
