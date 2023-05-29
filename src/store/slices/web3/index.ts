import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';

const authSlice = createSlice({
  name: 'web3',
  initialState,
  reducers: {

  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
