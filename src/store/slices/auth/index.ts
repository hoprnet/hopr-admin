import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { actionsAsync } from './actionsAsync';

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    useNodeData(state, action: PayloadAction<{ apiToken: string; apiEndpoint: string }>) {
      state.loginData.apiEndpoint = action.payload.apiEndpoint;
      state.loginData.apiToken = action.payload.apiToken;
      state.status.connecting = true;
    },
    setConnected(state) {
      state.status.connecting = false;
      state.status.connected = true;
    },
    addNodeData(state, action: PayloadAction<{ apiToken: string; apiEndpoint: string }>) {
      const newItem = action.payload;
      const existingItem = state.nodes.findIndex((item) => item.apiEndpoint === newItem.apiEndpoint);
      if (existingItem === -1) {
        state.nodes = [
          {
            apiEndpoint: action.payload.apiEndpoint,
            apiToken: action.payload.apiToken,
          },
          ...state.nodes,
        ];
      } else {
        state.nodes[existingItem].apiToken = action.payload.apiToken;
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
