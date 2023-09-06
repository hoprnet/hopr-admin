import { ActionReducerMapBuilder, createAction, createAsyncThunk, isPlain } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { initialState, SubgraphParsedOutput } from './initialState';
import {
  STAKING_V2_SUBGRAPH,
  HOPR_NETWORK_REGISTRY,
  MINIMUM_WXHOPR_TO_FUND,
  MINIMUM_XDAI_TO_FUND,
  MINIMUM_XDAI_TO_FUND_NODE
} from '../../../../config';
import NetworkRegistryAbi from '../../../abi/network-registry-abi.json';
import { WalletClient, publicActions } from 'viem';
import { gql } from 'graphql-request';

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
>('safe/registerNodeAndSafeToNR', async (payload, { rejectWithValue }) => {
  try {
    const superWalletClient = payload.walletClient.extend(publicActions);

    if (!superWalletClient.account) return;
    console.log('payload', payload);

    const { request } = await superWalletClient.simulateContract({
      account: payload.walletClient.account,
      address: HOPR_NETWORK_REGISTRY,
      abi: NetworkRegistryAbi,
      functionName: 'managerRegister',
      args: [[payload.safeAddress], [payload.nodeAddress]],
    });

    const transactionHash = await superWalletClient.writeContract(request);

    await superWalletClient.waitForTransactionReceipt({ hash: transactionHash });

    console.log('registerNodeAndSafeToNR hash', transactionHash);

    return { transactionHash };
  } catch (e) {
    return rejectWithValue(e);
  }
});

const getSubgraphDataThunk = createAsyncThunk<
  SubgraphParsedOutput,
  { safeAddress: string; moduleAddress: string },
  { state: RootState }
>(
  'stakingHub/getSubgraphData',
  async ({
    safeAddress,
    moduleAddress,
  }, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setSubgraphDataFetching(true));

    safeAddress = safeAddress.toLocaleLowerCase();
    moduleAddress = moduleAddress.toLocaleLowerCase();

    const GET_THEGRAPH_QUERY = gql`{
      safes(first: 1, where: {id: "${safeAddress}"}) {
        id
        balance {
          mHoprBalance
          wxHoprBalance
          xHoprBalance
        }
        threshold
        owners {
          owner {
            id
          }
        }
        isCreatedByNodeStakeFactory
        targetedModules {
          id
        }
        allowance {
          xHoprAllowance
          wxHoprAllowance
          mHoprAllowance
          grantedToChannelsContract
        }
        addedModules {
          module {
            id
          }
        }
        isEligibleOnNetworkRegistry
        registeredNodesInSafeRegistry {
          node {
            id
          }
        }
        registeredNodesInNetworkRegistry {
          node {
            id
          }
        }
      }
      nodeManagementModules(
        first: 1
        where: {id: "${moduleAddress}"}
      ) {
        id
        implementation
        includedNodes {
          node {
            id
          }
        }
        multiSend
        target {
          id
        }
      }
      balances(where: {id: "all_the_safes"}) {
        mHoprBalance
        wxHoprBalance
        xHoprBalance
      }
      _meta {
        hasIndexingErrors
        deployment
        block {
          hash
          timestamp
        }
      }
    }`



    try {
      const resp = await fetch(STAKING_V2_SUBGRAPH, {
        method: 'POST',
        body: GET_THEGRAPH_QUERY,
      });
      const json = await resp.json();
      console.log('SubgraphOutput', json);

      let output = JSON.parse(JSON.stringify(initialState.safeInfo));
      if (json.safes.length > 0) output = json.safes[0];
      if (json.nodeManagementModules.length > 0) output.module = json.nodeManagementModules[0];
      if (json.balances.length > 0) output.overall_staking_v2_balances = json.balances[0];

      console.log('SubgraphParsedOutput', output);
      return output;
    } catch (e) {
      if (isPlain(e)) {
        return rejectWithValue(e);
      }

      return rejectWithValue(JSON.stringify(e));
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().stakingHub.safeInfo.isFetching;
    if (isFetching) {
      return false;
    }
  } },
);

const goToStepWeShouldBeOnThunk = createAsyncThunk<number, undefined, { state: RootState }>(
  'stakingHub/goToStepWeShouldBeOn',
  async (_payload, {
    getState,
    rejectWithValue,
  }) => {
    try {
      const state = getState();

      console.log(
        'BigInt(state.stakingHub.safeInfo.data.allowance.wxHoprAllowance as string) > BigInt(0)',
        state.stakingHub.safeInfo.data.allowance.wxHoprAllowance &&
          BigInt(state.stakingHub.safeInfo.data.allowance.wxHoprAllowance as string) > BigInt(0),
      );
      if (
        state.stakingHub.safeInfo.data.allowance.wxHoprAllowance &&
        BigInt(state.stakingHub.safeInfo.data.allowance.wxHoprAllowance) > BigInt(0)
      ) {
        return 16;
      }

      console.log(
        'BigInt(state.stakingHub.onboarding.nodeXDaiBalance as string) >= BigInt(MINIMUM_XDAI_TO_FUND_NODE * 1e18)',
        state.stakingHub.onboarding.nodeXDaiBalance &&
          BigInt(state.stakingHub.onboarding.nodeXDaiBalance as string) >= BigInt(MINIMUM_XDAI_TO_FUND_NODE * 1e18),
      );
      if (
        state.stakingHub.onboarding.nodeXDaiBalance &&
        BigInt(state.stakingHub.onboarding.nodeXDaiBalance) >= BigInt(MINIMUM_XDAI_TO_FUND_NODE * 1e18)
      ) {
        return 15;
      }

      console.log(
        'state.stakingHub.safeInfo.data.module.includedNodes.length > 0',
        state.stakingHub.safeInfo.data.module.includedNodes,
      );
      console.log(
        'state.stakingHub.safeInfo.data.module.includedNodes.length > 0',
        state.stakingHub.safeInfo.data.module.includedNodes &&
          state.stakingHub.safeInfo.data.module.includedNodes.length > 0,
      );
      console.log(
        'state.stakingHub.safeInfo.data.module.includedNodes[0]?.node.id !== null',
        state.stakingHub.safeInfo.data.module.includedNodes &&
          state.stakingHub.safeInfo.data.module.includedNodes.length > 0 &&
          state.stakingHub.safeInfo.data.module.includedNodes[0]?.node.id !== null,
      );
      if (
        state.stakingHub.safeInfo.data.module.includedNodes &&
        state.stakingHub.safeInfo.data.module.includedNodes.length > 0 &&
        state.stakingHub.safeInfo.data.module.includedNodes[0]?.node.id !== null
      ) {
        return 14;
      }

      console.log('state.safe.delegates.data?.count', state.safe.delegates.data?.count);
      if (state.safe.delegates.data?.count) {
        return 13;
      }

      console.log('state.stakingHub.onboarding.nodeAddress', state.stakingHub.onboarding.nodeAddress);
      if (state.stakingHub.onboarding.nodeAddress) {
        return 11;
      }

      console.log(
        'state.safe.balance.data.xDai.value && BigInt(state.safe.balance.data.xDai.value) >= BigInt(MINIMUM_XDAI_TO_FUND * 1e18)',
        state.safe.balance.data.xDai.value &&
          BigInt(state.safe.balance.data.xDai.value) >= BigInt(MINIMUM_XDAI_TO_FUND * 1e18),
      );
      console.log(
        'state.safe.balance.data.wxHopr.value && BigInt(state.safe.balance.data.wxHopr.value) >= BigInt(MINIMUM_WXHOPR_TO_FUND*1e18)',
        state.safe.balance.data.wxHopr.value &&
          BigInt(state.safe.balance.data.wxHopr.value) >= BigInt(MINIMUM_WXHOPR_TO_FUND * 1e18),
      );

      if (
        state.safe.balance.data.xDai.value &&
        BigInt(state.safe.balance.data.xDai.value) >= BigInt(MINIMUM_XDAI_TO_FUND * 1e18) &&
        state.safe.balance.data.wxHopr.value &&
        BigInt(state.safe.balance.data.wxHopr.value) >= BigInt(MINIMUM_WXHOPR_TO_FUND * 1e18)
      ) {
        return 5;
      }

      console.log('state.safe.communityNftId !== null', state.safe.communityNftId !== null);
      if (state.safe.communityNftId !== null) {
        return 4;
      }

      console.log('state.safe.selectedSafeAddress.data', state.safe.selectedSafeAddress.data);
      if (state.safe.selectedSafeAddress.data) {
        return 2;
      }

      // default case
      return 0;
    } catch (e) {
      if (isPlain(e)) {
        return rejectWithValue(e);
      }

      return rejectWithValue(JSON.stringify(e));
    }
  },
);

// Helper actions to update the isFetching state
const setHubSafesByOwnerFetching = createAction<boolean>('stakingHub/setHubSafesByOwnerFetching');
const setSubgraphDataFetching = createAction<boolean>('stakingHub/setSubgraphDataFetching');

export const createAsyncReducer = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(getHubSafesByOwnerThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safes.data = action.payload;
    }
    if(action.payload.length === 0) {
      state.onboarding.notStarted = true;
    } else {
      state.onboarding.notStarted = false;
    }
    state.safes.isFetching = false;
  });
  builder.addCase(getSubgraphDataThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safeInfo.data = action.payload;
      if (action.payload?.registeredNodesInNetworkRegistry?.length > 0) {
        let tmp = [];
        tmp = action.payload.registeredNodesInNetworkRegistry.map((elem) => elem.node.id as string);
        state.safeInfo.data.registeredNodesInNetworkRegistryParsed = tmp;
        state.onboarding.nodeAddress = tmp[tmp.length - 1];
      }
    }
    state.safeInfo.isFetching = false;
  });
  builder.addCase(goToStepWeShouldBeOnThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.onboarding.step = action.payload;
      if (state.onboarding.step !== 0 && state.onboarding.step !== 15 && state.onboarding.step !== 16) {
        state.onboarding.notFinished = true;
        state.onboarding.notStarted = false;
      }
    }
  });
};

export const actionsAsync = {
  getHubSafesByOwnerThunk,
  registerNodeAndSafeToNRThunk,
  getSubgraphDataThunk,
  goToStepWeShouldBeOnThunk,
};
