import { ActionReducerMapBuilder, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { initialState } from './initialState';
import { STAKING_V2_SUBGRAPH } from '../../../../config';
import { SubgraphOutput } from './initialState';

const getHubSafesByOwnerThunk = createAsyncThunk<
  {
    moduleAddress: string;
    safeAddress: string;
  }[],
  string,
  { state: RootState }
>(
  'stakingHub/getHubSafesByOwner',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setHubSafesByOwnerFetching(true));
    try {
      const resp = await fetch('https://stake.hoprnet.org/api/hub/getSafes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerAddress: payload }),
      });
      const json: { moduleaddress: string; safeaddress: string }[] = await resp.json();
      const mapped = json.map((elem) => {
        return {
          moduleAddress: elem.moduleaddress,
          safeAddress: elem.safeaddress,
        };
      });
      return mapped;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().stakingHub.safes.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const getSubgraphDataThunk = createAsyncThunk<
  SubgraphOutput | null,
  string,
  { state: RootState }
>(
  'stakingHub/getSubgraphData',
  async (safeAddress, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setSubgraphDataFetching(true));

    safeAddress = '0x0cdecaff277c296665f31aac0957a3a3151b6159' //debug

    console.log(safeAddress)

    const QUERY = `{\"query\":\"{\\n  safes(first: 1, where: {id: \\\"${safeAddress}\\\"}) {\\n    id\\n    balance {\\n      mHoprBalance\\n      wxHoprBalance\\n      xHoprBalance\\n    }\\n    threshold\\n    owners {\\n      owner {\\n        id\\n      }\\n    }\\n    isCreatedByNodeStakeFactory\\n    targetedModules {\\n      id\\n    }\\n    allowance {\\n      xHoprAllowance\\n      wxHoprAllowance\\n      mHoprAllowance\\n      grantedToChannelsContract\\n    }\\n    addedModules {\\n      module {\\n        id\\n      }\\n    }\\n    isEligibleOnNetworkRegistry\\n    registeredNodesInSafeRegistry {\\n      node {\\n        id\\n      }\\n    }\\n    registeredNodesInNetworkRegistry {\\n      node {\\n        id\\n      }\\n    }\\n  }\\n  _meta {\\n    hasIndexingErrors\\n    deployment\\n  }\\n  nodeManagementModules(first: 1, where: {id: \\\"${safeAddress}\\\"}) {\\n    id\\n    implementation\\n    includedNodes {\\n      node {\\n        id\\n      }\\n    }\\n    multiSend\\n    target {\\n      id\\n    }\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}`
    
    try {
      const resp = await fetch(STAKING_V2_SUBGRAPH, {
        method: 'POST',
        "headers": {
          "content-type": "application/json",
        },
        body: QUERY,
      });
      const json : {
        data: {
          safes: SubgraphOutput[]
        }
      } = await resp.json();
      console.log('SubgraphOutput',json )

      if (json.data.safes[0]) return json.data.safes[0];
      else return null;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().stakingHub.safeInfo.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);


// Helper actions to update the isFetching state
const setHubSafesByOwnerFetching = createAction<boolean>('stakingHub/setHubSafesByOwnerFetching');
const setSubgraphDataFetching = createAction<boolean>('stakingHub/setSubgraphDataFetching');

export const createAsyncReducer = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(getHubSafesByOwnerThunk.fulfilled, (state, action) => {
    if (action.payload) {
      console.log(action.payload);
      state.safes.data = action.payload;

      if (action.payload.length > 0) {
        //  state.onboarding.notFinished = true;
        //   state.onboarding.step = 2;
      }
    }
    state.safes.isFetching = false;
  });
  builder.addCase(getSubgraphDataThunk.fulfilled, (state, action) => {
    if (action.payload) {
      console.log(action.payload);
      state.safeInfo.data = action.payload;

      if(action.payload.registeredNodesInNetworkRegistry.length > 0) {
        let tmp = [];
        tmp = action.payload.registeredNodesInNetworkRegistry.map(elem=>elem.node.id as string)
        state.safeInfo.data.registeredNodesInNetworkRegistryParsed = tmp;
      }

      // if (action.payload.length > 0) {
      //   //  state.onboarding.notFinished = true;
      //   //   state.onboarding.step = 2;
      // }
    }
    state.safeInfo.isFetching = false;
  });
};

export const actionsAsync = { 
  getHubSafesByOwnerThunk,
  getSubgraphDataThunk
 };
