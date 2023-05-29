import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';

const web3Slice = createSlice({
  name: 'web3',
  initialState,
  reducers: {},
});

export const web3Actions = web3Slice.actions;
export default web3Slice.reducer;
