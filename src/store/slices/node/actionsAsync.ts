
import { nodeActions } from './index'
import { SDK } from 'hopr-sdk'

var hoprSdk = new SDK('','');

const setNode = (loginData: any) => {
    return async (dispatch:any) => {
       dispatch(nodeActions.setIniciating());
       hoprSdk = new SDK(loginData.ip,loginData.apiKey);
       const info = await hoprSdk.api.node.getInfo();
       console.log({info})
       if (info) dispatch(nodeActions.setInitiated(info));
    };
};

const getInfo = () => {
    return async (dispatch:any) => {
       const info = await hoprSdk.api.node.getInfo();
       console.log({info})
       if (info) dispatch(nodeActions.setInfo(info));
    };
};

export const actionsAsync = {
    setNode,
    getInfo
}