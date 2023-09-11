import { ActionReducerMapBuilder, createAction, createAsyncThunk, isPlain } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { initialState, SubgraphParsedOutput } from './initialState';
import {
  STAKING_V2_SUBGRAPH,
  HOPR_NETWORK_REGISTRY,
  MINIMUM_WXHOPR_TO_FUND,
  MINIMUM_XDAI_TO_FUND,
  MINIMUM_XDAI_TO_FUND_NODE,
  HOPR_CHANNELS_SMART_CONTRACT_ADDRESS,
  wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS
} from '../../../../config';
import NetworkRegistryAbi from '../../../abi/network-registry-abi.json';
import { nodeManagementModuleAbi }  from '../../../abi/nodeManagementModuleAbi';
import { Address, PublicClient, WalletClient, publicActions } from 'viem';
import { gql } from 'graphql-request';
import { stakingHubActions } from '.';
import { safeActionsAsync } from '../safe';

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

      let output = JSON.parse(JSON.stringify(initialState.safeInfo.data));
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

type ParsedTargets =   {
  channels: false | string;
  wxHOPR: false | string;
}

const getModuleTargetsThunk = createAsyncThunk<
  ParsedTargets, 
  { safeAddress: string; moduleAddress: string, walletClient: PublicClient; }, 
  { state: RootState }
>(
  'stakingHub/getNodeConfiguration',
  async ({ safeAddress, moduleAddress, walletClient }, {
    rejectWithValue,
  }) => {
    console.log('stakingHub/getNodeConfiguration', safeAddress, moduleAddress);
    try {
      const superWalletClient = walletClient.extend(publicActions);
  
      const channelsTarget = await superWalletClient.readContract({
        address: moduleAddress as `0x${string}`,
        abi: nodeManagementModuleAbi,
        functionName: 'tryGetTarget',
        args: [HOPR_CHANNELS_SMART_CONTRACT_ADDRESS]
      }) as [boolean, BigInt];

      const wxHOPRTarget = await superWalletClient.readContract({
        address: moduleAddress as `0x${string}`,
        abi: nodeManagementModuleAbi,
        functionName: 'tryGetTarget',
        args: [wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS]
      }) as [boolean, BigInt];

      console.log('targets', wxHOPRTarget, channelsTarget)

      const targets = {
        channels: channelsTarget[0] === true ? channelsTarget[1].toString() : false,
        wxHOPR: wxHOPRTarget[0] === true ? wxHOPRTarget[1].toString() : false,
      } as ParsedTargets;

      // TODO: Decode the targets
      /**
       * @dev it stores the following information in uint256 = (160 + 8 * 12)
       * (address)              as uint160: targetAddress
       * (Clearance)            as uint8: clearance
       * (TargetType)           as uint8: targetType
       * (TargetPermission)     as uint8: defaultTargetPermission                                       (for the target)
       * (CapabilityPermission) as uint8: defaultRedeemTicketSafeFunctionPermisson                      (for Channels
       * contract)
       * (CapabilityPermission) as uint8: RESERVED FOR defaultBatchRedeemTicketsSafeFunctionPermisson   (for Channels
       * contract)
       * (CapabilityPermission) as uint8: defaultCloseIncomingChannelSafeFunctionPermisson              (for Channels
       * contract)
       * (CapabilityPermission) as uint8: defaultInitiateOutgoingChannelClosureSafeFunctionPermisson    (for Channels
       * contract)
       * (CapabilityPermission) as uint8: defaultFinalizeOutgoingChannelClosureSafeFunctionPermisson    (for Channels
       * contract)
       * (CapabilityPermission) as uint8: defaultFundChannelMultiFunctionPermisson                      (for Channels
       * contract)
       * (CapabilityPermission) as uint8: defaultSetCommitmentSafeFunctionPermisson                     (for Channels
       * contract)
       * (CapabilityPermission) as uint8: defaultApproveFunctionPermisson                               (for Token contract)
       * (CapabilityPermission) as uint8: defaultSendFunctionPermisson                                  (for Token contract)
       */
      
      return targets;
    } catch (e) {
      return rejectWithValue(e);
    }
});


const goToStepWeShouldBeOnThunk = createAsyncThunk<number, undefined, { state: RootState }>(
  'stakingHub/goToStepWeShouldBeOn',
  async (_payload, {
    getState,
    rejectWithValue,
  }) => {
    try {
      const state = getState();
      console.log( 'state', state );

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
      console.warn('Getting Onboarding Step failed', e)
      if (isPlain(e)) {
        return rejectWithValue(e);
      }

      return rejectWithValue(JSON.stringify(e));
    }
  },
);

const getOnboardingDataThunk = createAsyncThunk<
  void,
  { browserClient: PublicClient; safeAddress: string; safes: RootState['stakingHub']['safes']['data'] },
  { state: RootState }
>('stakingHub/getOnboardingData', async (payload, {
  rejectWithValue,
  dispatch,
}) => {
  dispatch(stakingHubActions.onboardingIsFetching(true));
  await dispatch(safeActionsAsync.getCommunityNftsOwnedBySafeThunk(payload.safeAddress)).unwrap();
  const moduleAddress = payload.safes.find((elem) => elem.safeAddress === payload.safeAddress)?.moduleAddress;

  if (!moduleAddress) {
    return rejectWithValue('No module address found');
  }

  dispatch(
    getModuleTargetsThunk({
      safeAddress: payload.safeAddress,
      moduleAddress,
      walletClient: payload.browserClient
    }),
  );

  const subgraphResponse = await dispatch(
    getSubgraphDataThunk({
      safeAddress: payload.safeAddress,
      moduleAddress,
    }),
  ).unwrap();

  let nodeXDaiBalance = '0';

  if (
    subgraphResponse.registeredNodesInNetworkRegistryParsed?.length > 0 &&
    subgraphResponse.registeredNodesInNetworkRegistryParsed[0] !== null
  ) {
    const nodeBalanceInBigInt = await payload.browserClient?.getBalance({ address: subgraphResponse.registeredNodesInNetworkRegistryParsed[0] as Address });
    nodeXDaiBalance = nodeBalanceInBigInt?.toString() ?? '0';
  }

  dispatch(
    stakingHubActions.useSafeForOnboarding({
      safeAddress: payload.safeAddress,
      moduleAddress,
      nodeXDaiBalance,
    }),
  );
  dispatch(goToStepWeShouldBeOnThunk());
  dispatch(stakingHubActions.onboardingIsFetching(false));
});

// Helper actions to update the isFetching state
const setHubSafesByOwnerFetching = createAction<boolean>('stakingHub/setHubSafesByOwnerFetching');
const setSubgraphDataFetching = createAction<boolean>('stakingHub/setSubgraphDataFetching');

export const createAsyncReducer = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(getHubSafesByOwnerThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safes.data = action.payload;
    }
    if (action.payload.length === 0) {
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
  builder.addCase(getModuleTargetsThunk.rejected, (state, action) => {
    console.log('getModuleTargetsThunk.rejected');
    state.config.needsUpdate.isFetching = false;
  });
  builder.addCase(getModuleTargetsThunk.fulfilled, (state, action) => {
    if (action.payload) {
      const correctConfig1 = '47598282682985165703087897390610028112494826122342268517157719752757376909312';
      const correctConfig2 = '96338966875583709871840581638487531229018761285270926761304390858285246317315';

      if(!action.payload.channels || !action.payload.wxHOPR){
        console.log('Old safe config present, needs update. Targets:', action.payload);
        state.config.needsUpdate.data = true;
        state.config.needsUpdate.strategy =  'configWillPointToCorrectContracts';
      } else if(action.payload.channels !== correctConfig1 || action.payload.wxHOPR !== correctConfig2){
        console.log('Old safe config present, need update. Targets:', action.payload);
        state.config.needsUpdate.data = true;
        state.config.needsUpdate.strategy = 'configWillLetOpenChannels';
      }
      state.config.needsUpdate.isFetching = false;
    }
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
  getModuleTargetsThunk,
  getSubgraphDataThunk,
  goToStepWeShouldBeOnThunk,
  getOnboardingDataThunk,
};
