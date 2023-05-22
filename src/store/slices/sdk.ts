import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    status: {
        loading: false as boolean,
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

const sdkSlice = createSlice({
    name: 'sdk',
    initialState,
    reducers:{
        getNodeData(state){
            state.node.peerId = '16';
        }
    }
});

export const sdkActions = sdkSlice.actions;
export default sdkSlice.reducer;

