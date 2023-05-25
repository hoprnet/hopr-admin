import {
  type AsyncThunk,
  createAsyncThunk,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { nodeActions } from './index';
import { HoprSdk, api } from 'hopr-sdk';
import { APIError } from 'hopr-sdk/dist/utils';
import { initialState } from './initialState';
var hoprSdk = new HoprSdk({ url: '', apiToken: '' });

const getInfoThunk = createAsyncThunk(
  'node/getInfo',
  async (
    { url, apiKey }: { url: string; apiKey: string },
    { rejectWithValue }
  ) => {
    try {
      const info = await api.getInfo({ url, apiKey });
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

// const setNode = (loginData: any) => {
//   return async (dispatch: any) => {
//     dispatch(nodeActions.setInitiating());
//     hoprSdk = new HoprSdk({ url: loginData.ip, apiToken: loginData.apiKey });
//     const info = await hoprSdk.api.node.getInfo();
//     console.log({ info });
//     if (info) dispatch(nodeActions.setInitiated(info));
//   };
// };

// const getInfo = () => {
//   return async (dispatch: any) => {
//     const info = await hoprSdk.api.node.getInfo();
//     console.log({ info });
//     if (info) dispatch(nodeActions.setInfo(info));
//   };
// };

export const actionsAsync = {
  getInfoThunk,
};
