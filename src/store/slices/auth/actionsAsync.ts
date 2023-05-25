import { authActions } from './index';
import { api } from 'hopr-sdk';

export const login = (loginData: any) => {
  return async (dispatch: any) => {
    const info = await api.getInfo({
      url: loginData.ip,
      apiKey: loginData.apiKey,
    });
    console.log({ info });
    if (info) dispatch(authActions.setConnected());
  };
};

export const actionsAsync = {
  login,
};
