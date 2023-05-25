import { nodeActions } from './index';
import { HoprSdk  } from 'hopr-sdk'

var hoprSdk = new HoprSdk({url:'', apiToken:''});

const setNode = (loginData: any) => {
  return async (dispatch: any) => {
    dispatch(nodeActions.setIniciating());
    hoprSdk = new HoprSdk({url: loginData.ip, apiToken: loginData.apiKey});
    const info = await hoprSdk.api.node.getInfo();
    console.log({ info });
    if (info) dispatch(nodeActions.setInitiated(info));
  };
};

const getInfo = () => {
  return async (dispatch: any) => {
    const info = await hoprSdk.api.node.getInfo();
    console.log({ info });
    if (info) dispatch(nodeActions.setInfo(info));
  };
};

export const actionsAsync = {
  setNode,
  getInfo,
};
