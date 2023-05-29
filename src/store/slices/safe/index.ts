import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';

const authSlice = createSlice({
  name: 'safe',
  initialState,
  reducers: {
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
