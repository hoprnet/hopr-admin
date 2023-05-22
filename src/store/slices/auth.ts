import { createSlice } from '@reduxjs/toolkit'
import {getObjectFromLocalStorage} from '../../utils/functions'

const ADMIN_UI_NODE_LIST = getObjectFromLocalStorage("admin-ui-node-list");

const initialState = {
    status: {
        loading: false as boolean,
        connected: false as boolean,
    },
    loginData: {
        ip: null as string | null,
        apiKey: null as string | null,
        peerId: null as string | null,
    },
    nodes: ADMIN_UI_NODE_LIST ? ADMIN_UI_NODE_LIST : [] as {}[]
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        useNodeData(state, action){
            state.loginData.ip = action.payload.ip;
            state.loginData.apiKey = action.payload.apiKey;
        },
        addNodeData(state, action){
            state.nodes = [
                {
                    ip: action.payload.ip,
                    apiKey: action.payload.apiKey
                },
                ...state.nodes
            ];
            localStorage.setItem("admin-ui-node-list", JSON.stringify(state.nodes));
        },
        clearLocalNodes(state){
            state.nodes = [];
            localStorage.removeItem("admin-ui-node-list");
        },
    }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;

