import { authActions } from './index';
import { api } from '@hoprnet/hopr-sdk';
const { getInfo } = api;

export const login = (loginData: any) => {
  return async (dispatch: any) => {
    const info = await getInfo({
      apiEndpoint: loginData.ip,
      apiToken: loginData.apiKey,
    });
    console.log({ info });
    if (info) dispatch(authActions.setConnected());
  };
};

export const actionsAsync = {
  login,
};
