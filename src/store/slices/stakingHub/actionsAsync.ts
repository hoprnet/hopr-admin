import { ActionReducerMapBuilder, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { initialState } from './initialState';
import { STAKING_V2_SUBGRAPH } from '../../../../config';
import { SubgraphOutput } from './initialState';

import NetworkRegistryAbi from '../../../abi/network-registry-abi.json'
import { HOPR_NETWORK_REGISTRY } from '../../../../config';
import { WalletClient, publicActions } from 'viem';

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


const registerNodeAndSafeToNRThunk = createAsyncThunk<
  | {
      transactionHash: string;
    }
  | undefined,
  {
    walletClient: WalletClient;
    nodeAddress: string;
    safeAddress: string;
  },
  { state: RootState }
>(
  'safe/registerNodeAndSafeToNR',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    try {
      const superWalletClient = payload.walletClient.extend(publicActions);

      if (!superWalletClient.account) return;
      console.log('payload', payload)
      const {
        result,
        request,
      } = await superWalletClient.simulateContract({
        account: payload.walletClient.account,
        address: HOPR_NETWORK_REGISTRY,
        abi: NetworkRegistryAbi,
        functionName: 'managerRegister',
        args: [[payload.safeAddress], [payload.nodeAddress]],
      });
      console.log('request', request);
      console.log('result', result);
      const transactionHash = await superWalletClient.writeContract(request);

      await superWalletClient.waitForTransactionReceipt({ hash: transactionHash });

      console.log('registerNodeAndSafeToNR hash', transactionHash)

      return { transactionHash };
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);


const getSubgraphDataThunk = createAsyncThunk<SubgraphOutput | null, string, { state: RootState }>(
  'stakingHub/getSubgraphData',
  async (safeAddress, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setSubgraphDataFetching(true));

  //  safeAddress = '0x0cdecaff277c296665f31aac0957a3a3151b6159'; //debug

    console.log(safeAddress);

    const QUERY = `{\"query\":\"{\\n  safes(first: 1, where: {id: \\\"${safeAddress}\\\"}) {\\n    id\\n    balance {\\n      mHoprBalance\\n      wxHoprBalance\\n      xHoprBalance\\n    }\\n    threshold\\n    owners {\\n      owner {\\n        id\\n      }\\n    }\\n    isCreatedByNodeStakeFactory\\n    targetedModules {\\n      id\\n    }\\n    allowance {\\n      xHoprAllowance\\n      wxHoprAllowance\\n      mHoprAllowance\\n      grantedToChannelsContract\\n    }\\n    addedModules {\\n      module {\\n        id\\n      }\\n    }\\n    isEligibleOnNetworkRegistry\\n    registeredNodesInSafeRegistry {\\n      node {\\n        id\\n      }\\n    }\\n    registeredNodesInNetworkRegistry {\\n      node {\\n        id\\n      }\\n    }\\n  }\\n  _meta {\\n    hasIndexingErrors\\n    deployment\\n  }\\n  nodeManagementModules(first: 1, where: {id: \\\"${safeAddress}\\\"}) {\\n    id\\n    implementation\\n    includedNodes {\\n      node {\\n        id\\n      }\\n    }\\n    multiSend\\n    target {\\n      id\\n    }\\n  }\\n}\",\"variables\":null,\"extensions\":{\"headers\":null}}`;

    try {
      const resp = await fetch(STAKING_V2_SUBGRAPH, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: QUERY,
      });
      const json: {
        data: {
          safes: SubgraphOutput[];
        };
      } = await resp.json();
      console.log('SubgraphOutput', json);

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

      if (action.payload.registeredNodesInNetworkRegistry.length > 0) {
        let tmp = [];
        tmp = action.payload.registeredNodesInNetworkRegistry.map((elem) => elem.node.id as string);
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
  registerNodeAndSafeToNRThunk,
  getSubgraphDataThunk,
};
