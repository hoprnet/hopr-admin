import { createSlice } from '@reduxjs/toolkit'
import { getObjectFromLocalStorage } from '../../utils/functions'
import { getInfo } from 'hopr-sdk';

const ADMIN_UI_NODE_LIST = getObjectFromLocalStorage("admin-ui-node-list");

const initialState = {
    status: {
        connecting: false as boolean,
        connected: false as boolean,
    },
    loginData: {
        ip: null as string | null,
        apiKey: null as string | null,
        peerId: null as string | null,
    },
    nodes: ADMIN_UI_NODE_LIST ? ADMIN_UI_NODE_LIST : [] as {}[],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        useNodeData(state, action){
            console.log(action);
            state.loginData.ip = action.payload.ip;
            state.loginData.apiKey = action.payload.apiKey;
            state.status.connecting = true;
        },
        setConnected(state){
            state.status.connecting = false;
            state.status.connected = true;
        },
        addNodeData(state, action){
            const newItem = action.payload;
            const existingItem = state.nodes.findIndex((item: { ip: string }) => item.ip === newItem.ip);
            console.log('existingItem', existingItem)
            if (existingItem === -1) {
                state.nodes = [
                    {
                        ip: action.payload.ip,
                        apiKey: action.payload.apiKey
                    },
                    ...state.nodes
                ];
            } else {
                state.nodes[existingItem].apiKey=action.payload.apiKey;
            }

            localStorage.setItem("admin-ui-node-list", JSON.stringify(state.nodes));
        },
        clearLocalNodes(state){
            state.nodes = [];
            localStorage.removeItem("admin-ui-node-list");
        },
    }
});


export const login = (loginData: any) => {
    return async (dispatch:any) => {
       const info = await getInfo({url: loginData.ip, apiKey: loginData.apiKey});
       console.log({info})
       if (info) dispatch(authSlice.actions.setConnected())
    };
};

export const authActions = authSlice.actions;
export default authSlice.reducer;

