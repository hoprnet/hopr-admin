
import { authActions } from './index'
import { getInfo } from 'hopr-sdk';

export const login = (loginData: any) => {
    return async (dispatch:any) => {
       const info = await getInfo({url: loginData.ip, apiKey: loginData.apiKey});
       console.log({info})
       if (info) dispatch(authActions.setConnected())
    };
};

export const actionsAsync = {
    login
}