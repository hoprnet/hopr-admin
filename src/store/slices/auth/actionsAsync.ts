import { createAsyncThunk } from '@reduxjs/toolkit';
import { authActions } from './index';
import { api } from '@hoprnet/hopr-sdk';
const { getInfo } = api;

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (
    loginData: { apiToken: string; apiEndpoint: string },
    { dispatch }
  ) => {
    const info = await getInfo({
      apiEndpoint: loginData.apiEndpoint,
      apiToken: loginData.apiToken,
    });
    console.log({ info });
    if (info) dispatch(authActions.setConnected());
  }
);

export const actionsAsync = {
  loginThunk,
};
