import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';

const safeSlice = createSlice({
  name: 'safe',
  initialState,
  reducers: {},
});

export const safeActions = safeSlice.actions;
export default safeSlice.reducer;
