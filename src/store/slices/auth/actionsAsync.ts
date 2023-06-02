import { authActions } from './index';
import { api } from '@hoprnet/hopr-sdk';
const { getInfo } = api;

export const login = (loginData: { apiToken: string; apiEndpoint: string }) => {
  return async (dispatch: any) => {
    const info = await getInfo({
      apiEndpoint: loginData.apiEndpoint,
      apiToken: loginData.apiToken,
    });
    console.log({ info });
    if (info) dispatch(authActions.setConnected());
  };
};

export const actionsAsync = {
  login,
};
