import { createSlice } from '@reduxjs/toolkit'
import { SDK } from 'hopr-sdk'

const initialState = {
    status: {
        initiating: false as boolean,
        initiated: false as boolean,
    },
    node: {
        peerId: null as string | null,
        ethAddress: null as string | null,
        balances: {
            mHOPR: null as string | null,
            xDai: null as string | null,
        }
    }

};

var hoprSdk = new SDK('','');

const sdkSlice = createSlice({
    name: 'hopr-sdk',
    initialState,
    reducers:{
        setIniciating(state){
            console.log('SDK setIniciating');
            state.status.initiating = true;
        },
        setInitiated(state, action){
            console.log('SDK setInitiated', action);
            state.status.initiating = false;
            state.status.initiated = true;
        },
        getInfo(state, action){
            console.log('SDK getInfo', action);
        }
    }
});

export const getInfo = () => {
    return async (dispatch:any) => {
       const info = await hoprSdk.api.node.getInfo();
       console.log({info})
       if (info) dispatch(sdkSlice.actions.getInfo(info))
    };
};

export const setNode = (loginData: any) => {
    return async (dispatch:any) => {
       dispatch(sdkSlice.actions.setIniciating());
       hoprSdk = new SDK(loginData.ip,loginData.apiKey);
       const info = await hoprSdk.api.node.getInfo();
       console.log({info})
       if (info) dispatch(sdkSlice.actions.setInitiated(info))
    };
};

export const sdkActions = sdkSlice.actions;
export default sdkSlice.reducer;

