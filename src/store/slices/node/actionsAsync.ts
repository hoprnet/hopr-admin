import { createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { getInfo } from 'hopr-sdk/api';
import { APIError } from 'hopr-sdk/utils';

const getInfoThunk = createAsyncThunk(
  'node/getInfo',
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const info = await getInfo({ url, apiKey });
      return info;
    } catch (e) {
      if (e instanceof APIError) {
        rejectWithValue(e.error);
      }
    }
  }
);

export const createExtraReducers = (
  builder: ActionReducerMapBuilder<typeof initialState>
) => {
  builder.addCase(getInfoThunk.pending, (state) => {});
  builder.addCase(getInfoThunk.rejected, (state) => {});
  builder.addCase(getInfoThunk.fulfilled, (state, action) => {
    console.log({ action });
  });
};

export const actionsAsync = {
  getInfoThunk,
};
