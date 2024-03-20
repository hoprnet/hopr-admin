import { ActionReducerMapBuilder, createAction, createAsyncThunk, isPlain } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { initialState, SubgraphParsedOutput } from './initialState';
import {
  STAKING_V2_SUBGRAPH,
  HOPR_NETWORK_REGISTRY,
  MINIMUM_WXHOPR_TO_FUND,
  MINIMUM_XDAI_TO_FUND,
  MINIMUM_XDAI_TO_FUND_NODE,
  HOPR_ANNOUNCEMENT_SMART_CONTRACT_ADDRESS,
  HOPR_CHANNELS_SMART_CONTRACT_ADDRESS,
  wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS
} from '../../../../config';
import { web3 } from '@hoprnet/hopr-sdk';
import {
  Address,
  PublicClient,
  WalletClient,
  parseEther,
  publicActions
} from 'viem'
import { gql } from 'graphql-request';
import { stakingHubActions } from '.';
import { safeActionsAsync } from '../safe';
import { NodePayload } from './initialState';
import { formatEther, getAddress } from 'viem';

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
      const ownerAddress = payload.toLocaleLowerCase();

      const GET_THEGRAPH_QUERY = gql`{
        safes(
          where: {isCreatedByNodeStakeFactory: true, owners_: {owner: "${ownerAddress}"}}
          first: 1000
        ) {
          id
          addedModules {
            module {
              id
            }
          }
        }
      }`;

      // temporary
      const resp = await Promise.all([
        fetch(STAKING_V2_SUBGRAPH, {
          method: 'POST',
          body: GET_THEGRAPH_QUERY,
        }),
        fetch(`${STAKING_V2_SUBGRAPH}-test`, {
          method: 'POST',
          body: GET_THEGRAPH_QUERY,
        }),
      ]);

      const json: {
        safes: {
          id: string;
          addedModules: {
            module: {
              id: string;
            };
          }[];
        }[];
      } = await resp[0].json();

      const json2: {
        safes: {
          id: string;
          addedModules: {
            module: {
              id: string;
            };
          }[];
        }[];
      } = await resp[1].json();

      let mapped1 = json.safes.map((elem) => {
        return {
          moduleAddress: getAddress(elem.addedModules[0].module.id),
          safeAddress: getAddress(elem.id),
        };
      });
      mapped1 = mapped1.filter((elem) => elem.moduleAddress);

      let mapped2 = json2.safes.map((elem) => {
        return {
          moduleAddress: getAddress(elem.addedModules[0].module.id),
          safeAddress: getAddress(elem.id),
        };
      });
      mapped2 = mapped2.filter((elem) => elem.moduleAddress);

      return [...mapped1, ...mapped2];
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
      abi: web3.hoprNetworkRegistryABI,
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
  { safeAddress: string; moduleAddress: string; browserClient: PublicClient },
  { state: RootState }
>(
  'stakingHub/getSubgraphData',
  async ({
    safeAddress,
    moduleAddress,
    browserClient,
  }, {
    rejectWithValue,
    dispatch,
  }) => {
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
    }`;

    try {
      // temporary
      const resp = await Promise.all([
        fetch(STAKING_V2_SUBGRAPH, {
          method: 'POST',
          body: GET_THEGRAPH_QUERY,
        }),
        fetch(`${STAKING_V2_SUBGRAPH}-test`, {
          method: 'POST',
          body: GET_THEGRAPH_QUERY,
        }),
      ]);

      const json1 = await resp[0].json();
      const json2 = await resp[1].json();

      const json = json1.nodeManagementModules.length > 0 ? json1 : json2;

      console.log('SubgraphOutput', json);

      let output = JSON.parse(JSON.stringify(initialState.safeInfo.data));
      if (json.safes.length > 0) output = json.safes[0];
      if (json.nodeManagementModules.length > 0) output.module = json.nodeManagementModules[0];
      if (json.balances.length > 0) output.overall_staking_v2_balances = json.balances[0];

      console.log('output.registeredNodesInNetworkRegistry', output.registeredNodesInNetworkRegistry);
      console.log('output.registeredNodesInSafeRegistry', output.registeredNodesInSafeRegistry);

      let allNodes = [...output.registeredNodesInNetworkRegistry, ...output.registeredNodesInSafeRegistry];
      allNodes = allNodes.filter(function (item, pos) {
        return allNodes.indexOf(item) == pos;
      });

      console.log('allNodes found', allNodes);
      allNodes.forEach((safeRegNode: { node: { id: string } }) => {
        const nodeAddress = safeRegNode.node.id;
        dispatch(getNodeDataThunk({
          nodeAddress, browserClient, 
        }));
      });

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

type ParsedTargets = {
  channels: false | string;
  wxHOPR: false | string;
  announcmentTarget: false | string;
};

const getModuleTargetsThunk = createAsyncThunk<
  ParsedTargets,
  { safeAddress: string; moduleAddress: string; walletClient: PublicClient },
  { state: RootState }
>('stakingHub/getNodeConfiguration', async ({
  safeAddress,
  moduleAddress,
  walletClient,
}, { rejectWithValue }) => {
  console.log('stakingHub/getNodeConfiguration', safeAddress, moduleAddress);
  try {
    const superWalletClient = walletClient.extend(publicActions);

    const channelsTarget = (await superWalletClient.readContract({
      address: moduleAddress as `0x${string}`,
      abi: web3.hoprNodeManagementModuleABI,
      functionName: 'tryGetTarget',
      args: [HOPR_CHANNELS_SMART_CONTRACT_ADDRESS],
    })) as [boolean, bigint];

    const wxHOPRTarget = (await superWalletClient.readContract({
      address: moduleAddress as `0x${string}`,
      abi: web3.hoprNodeManagementModuleABI,
      functionName: 'tryGetTarget',
      args: [wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS],
    })) as [boolean, bigint];

    const announcmentTarget = (await superWalletClient.readContract({
      address: moduleAddress as `0x${string}`,
      abi: web3.hoprNodeManagementModuleABI,
      functionName: 'tryGetTarget',
      args: [HOPR_ANNOUNCEMENT_SMART_CONTRACT_ADDRESS],
    })) as [boolean, bigint];

    console.log('targets', {
      wxHOPRTarget, channelsTarget, announcmentTarget, 
    });

    const targets = {
      channels: channelsTarget[0] === true ? channelsTarget[1].toString() : false,
      wxHOPR: wxHOPRTarget[0] === true ? wxHOPRTarget[1].toString() : false,
      announcmentTarget: announcmentTarget[0] === true ? announcmentTarget[1].toString() : false,
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

      // Part of the onboarding after COMM registers you
      console.log('[Onboarding check] Node registered: ', state.stakingHub.onboarding.nodeAddress);
      if (state.stakingHub.onboarding.nodeAddress) {
        console.log('[Onboarding check] Delegate count: ', state.safe.delegates.data?.count);
        if (state.safe.delegates.data?.count) {
          console.log(
            '[Onboarding check] state.stakingHub.safeInfo.data.module.includedNodes.length > 0',
            state.stakingHub.safeInfo.data?.module?.includedNodes,
          );
          console.log(
            '[Onboarding check] state.stakingHub.safeInfo.data.module.includedNodes.length > 0',
            state.stakingHub.safeInfo.data?.module?.includedNodes &&
              state.stakingHub.safeInfo.data.module.includedNodes.length > 0,
          );
          console.log(
            '[Onboarding check] Node configured (includeNode()): ',
            state.stakingHub.safeInfo.data?.module?.includedNodes &&
              state.stakingHub.safeInfo.data.module.includedNodes.length > 0 &&
              state.stakingHub.safeInfo.data.module.includedNodes[0]?.node.id !== null,
          );
          if (
            state.stakingHub.safeInfo.data?.module?.includedNodes &&
            state.stakingHub.safeInfo.data.module.includedNodes.length > 0 &&
            state.stakingHub.safeInfo.data.module.includedNodes[0]?.node.id !== null
          ) {
            const nodeXDaiBalanceCheck =
              state.stakingHub.onboarding.nodeXDaiBalance &&
              BigInt(state.stakingHub.onboarding.nodeXDaiBalance) >= BigInt(0);
            console.log(
              '[Onboarding check] Node balance (xDai): ',
              state.stakingHub.onboarding.nodeXDaiBalance,
              nodeXDaiBalanceCheck,
            );
            if (nodeXDaiBalanceCheck) {
              const wxHoprAllowanceCheck =
                state.stakingHub.safeInfo.data.allowance.wxHoprAllowance &&
                parseEther(state.stakingHub.safeInfo.data.allowance.wxHoprAllowance) > BigInt(0);
              console.log(
                '[Onboarding check] Allowance set: ',
                state.stakingHub.safeInfo.data.allowance.wxHoprAllowance,
                wxHoprAllowanceCheck,
              );
              if (wxHoprAllowanceCheck) {
                console.log('[Onboarding check] step: 16');
                return 16;
              }
              console.log('[Onboarding check] step: 15');
              return 15;
            }
            console.log('[Onboarding check] step: 14');
            return 14;
          }
          console.log('[Onboarding check] step: 13');
          return 13;
        }
        console.log('[Onboarding check] step: 11');
        return 11;
      }

      // Part of the onboarding before COMM registers you
      const xDaiInSafeCheck =
        state.safe.balance.data.xDai.value &&
        BigInt(state.safe.balance.data.xDai.value) >= BigInt(MINIMUM_XDAI_TO_FUND * 1e18);
      const wxHoprInSafeCheck =
        state.safe.balance.data.wxHopr.value &&
        BigInt(state.safe.balance.data.wxHopr.value) >= BigInt(MINIMUM_WXHOPR_TO_FUND * 1e18);
      console.log('[Onboarding check] Safe balance (xDai):', state.safe.balance.data.xDai.value, xDaiInSafeCheck);
      console.log('[Onboarding check] Safe balance (wxHopr):', state.safe.balance.data.wxHopr.value, wxHoprInSafeCheck);
      if (xDaiInSafeCheck && wxHoprInSafeCheck) {
        console.log('[Onboarding check] step: 5');
        return 5;
      }

      console.log(
        '[Onboarding check] CommunityNftId in Safe',
        state.safe.communityNftIds.data.length,
        state.safe.communityNftIds.data.length !== 0,
      );
      if (state.safe.communityNftIds.data.length !== 0) {
        console.log('[Onboarding check] step: 4');
        return 4;
      }

      console.log('[Onboarding check] Safe created', state.safe.selectedSafe.data.safeAddress);
      if (state.safe.selectedSafe.data.safeAddress) {
        console.log('[Onboarding check] step: 2');
        return 2;
      }
      console.log('[Onboarding check] step: 0');
      // default case
      return 0;
    } catch (e) {
      console.warn('Getting Onboarding Step failed', e);
      if (isPlain(e)) {
        return rejectWithValue(e);
      }

      return rejectWithValue(JSON.stringify(e));
    }
  },
);

const getOnboardingDataThunk = createAsyncThunk<
  void,
  { browserClient: PublicClient; safeAddress: string; moduleAddress: string },
  { state: RootState }
>('stakingHub/getOnboardingData', async (payload, {
  rejectWithValue,
  dispatch,
}) => {
  dispatch(stakingHubActions.onboardingIsFetching(true));
  await dispatch(safeActionsAsync.getCommunityNftsOwnedBySafeThunk(payload.safeAddress)).unwrap();
  const moduleAddress = payload.moduleAddress;

  if (!moduleAddress) {
    return rejectWithValue('No module address found');
  }

  dispatch(
    getModuleTargetsThunk({
      safeAddress: payload.safeAddress,
      moduleAddress,
      walletClient: payload.browserClient,
    }),
  );

  const subgraphResponse = await dispatch(
    getSubgraphDataThunk({
      safeAddress: payload.safeAddress,
      moduleAddress,
      browserClient: payload.browserClient,
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

const getNodeDataThunk = createAsyncThunk<
  NodePayload,
  { nodeAddress: string; browserClient: PublicClient },
  { state: RootState }
>(
  'stakingHub/getNodeData',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(getNodeBalanceThunk(payload));
    const rez = await fetch(`https://network.hoprnet.org/api/getNode?env=37&nodeAddress=${payload.nodeAddress}`);
    const json = await rez.json();
    let nodeData = {
      nodeAddress: payload.nodeAddress,
      isFetching: false,
    };
    if (json.length > 0) {
      nodeData = {
        ...json[0],
        ...nodeData,
      };
    }
    return nodeData;
  },
  { condition: (_payload, { getState }) => {
    return true;
  } },
);

const getNodeBalanceThunk = createAsyncThunk<
  NodePayload,
  { nodeAddress: string; browserClient: PublicClient },
  { state: RootState }
>(
  'stakingHub/getNodeBalance',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    const nodeBalanceInBigInt = await payload.browserClient?.getBalance({ address: payload.nodeAddress as Address });
    console.log('nodeBalanceInBigInt', payload.nodeAddress, nodeBalanceInBigInt);
    const nodeXDaiBalance = nodeBalanceInBigInt?.toString() ?? '0';
    const nodeXDaiBalanceFormatted = formatEther(nodeBalanceInBigInt);
    const nodeBalance = {
      nodeAddress: payload.nodeAddress,
      balance: nodeXDaiBalance,
      balanceFormatted: nodeXDaiBalanceFormatted,
      isFetching: false,
    };
    return nodeBalance;
  },
  { condition: (_payload, { getState }) => {
    return true;
  } },
);

// Helper actions to update the isFetching state
const setHubSafesByOwnerFetching = createAction<boolean>('stakingHub/setHubSafesByOwnerFetching');
const setSubgraphDataFetching = createAction<boolean>('stakingHub/setSubgraphDataFetching');
const setNodeDataFetching = createAction<boolean>('stakingHub/setNodeDataFetching');

export const createAsyncReducer = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(getHubSafesByOwnerThunk.pending, (state) => {
    state.safes.isFetching = true;
  });
  builder.addCase(getHubSafesByOwnerThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safes.data = action.payload;
    }
    if (action.payload.length === 0) {
      state.onboarding.notStarted = true;
      state.onboarding.isFetching = false;
    } else {
      state.onboarding.notStarted = false;
    }
    state.safes.isFetching = false;
  });
  builder.addCase(getSubgraphDataThunk.pending, (state, action) => {
    state.safeInfo.isFetching = true;
  });
  builder.addCase(getSubgraphDataThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.safeInfo.data = action.payload;
      if (action.payload?.registeredNodesInNetworkRegistry?.length > 0) {
        let tmp = [];
        tmp = action.payload.registeredNodesInNetworkRegistry.map((elem: { node: { id: string | null } }) => {
          if (elem.node.id) {
            const nodeAddress = elem.node.id.toLocaleLowerCase();
            if (state.nodes[nodeAddress]) state.nodes[nodeAddress].registeredNodesInNetworkRegistry = true;
            else
              state.nodes[nodeAddress] = {
                nodeAddress: nodeAddress,
                registeredNodesInNetworkRegistry: true,
                isFetching: false,
              };
          }
          return elem.node.id as string;
        });
        state.safeInfo.data.registeredNodesInNetworkRegistryParsed = tmp;
        state.onboarding.nodeAddress = tmp[tmp.length - 1];
      }
      if (action.payload?.registeredNodesInSafeRegistry?.length > 0) {
        let tmp = [];
        tmp = action.payload.registeredNodesInSafeRegistry.map((elem: { node: { id: string | null } }) => {
          if (elem.node.id) {
            const nodeAddress = elem.node.id.toLocaleLowerCase();
            if (state.nodes[nodeAddress]) state.nodes[nodeAddress].registeredNodesInSafeRegistry = true;
            else
              state.nodes[nodeAddress] = {
                nodeAddress: nodeAddress,
                registeredNodesInSafeRegistry: true,
                isFetching: false,
              };
          }
          return elem.node.id as string;
        });
        state.safeInfo.data.registeredNodesInSafeRegistryParsed = tmp;
        state.onboarding.nodeAddress = tmp[tmp.length - 1];
      }
      if (action.payload?.module?.includedNodes?.length > 0) {
        action.payload.module.includedNodes.map((elem: { node: { id: string | null } }) => {
          if (elem.node.id) {
            const nodeAddress = elem.node.id.toLocaleLowerCase();
            if (state.nodes[nodeAddress]) state.nodes[nodeAddress].includedInModule = true;
            else
              state.nodes[nodeAddress] = {
                nodeAddress: nodeAddress,
                includedInModule: true,
                isFetching: false,
              };
          }
        });
      }
    }
    state.safeInfo.isFetching = false;
  });
  builder.addCase(getSubgraphDataThunk.rejected, (state, action) => {
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
      const correctConfig3 = '44154694447105676396867590936447101190536019366130432120501522583128004100096';

      if (!action.payload.channels || !action.payload.wxHOPR) {
        console.log('Old safe config present, needs update. Targets:', action.payload);
        state.config.needsUpdate.data = true;
        state.config.needsUpdate.strategy = 'configWillPointToCorrectContracts';
      } else if (action.payload.channels !== correctConfig1 || action.payload.wxHOPR !== correctConfig2) {
        console.log('Old safe config present, need update. Targets:', action.payload);
        state.config.needsUpdate.data = true;
        state.config.needsUpdate.strategy = 'configWillLetOpenChannels';
      } else if (action.payload.announcmentTarget !== correctConfig3 || !action.payload.announcmentTarget) {
        console.log('Old safe config present, need update. Targets:', action.payload);
        state.config.needsUpdate.data = true;
        state.config.needsUpdate.strategy = 'configAnnounceOnly';
      }
      state.config.needsUpdate.isFetching = false;
    }
  });
  builder.addCase(goToStepWeShouldBeOnThunk.pending, (state) => {
    state.onboarding.isFetching = true;
  });
  builder.addCase(goToStepWeShouldBeOnThunk.fulfilled, (state, action) => {
    if (action.payload) {
      state.onboarding.step = action.payload;
      state.onboarding.isFetching = false;
      if (state.onboarding.step !== 0 && state.onboarding.step !== 16) {
        state.onboarding.notFinished = true;
        state.onboarding.notStarted = false;
      } else if (state.onboarding.step === 16) {
        state.onboarding.notFinished = false;
      }
    }
  });
  builder.addCase(getNodeDataThunk.fulfilled, (state, action) => {
    const nodeData = action.payload;
    if (nodeData.nodeAddress) {
      const nodeAddress = nodeData.nodeAddress.toLocaleLowerCase();
      if (state.nodes[nodeAddress]) {
        state.nodes[nodeAddress] = {
          ...state.nodes[nodeAddress],
          ...nodeData,
        };
      } else {
        state.nodes[nodeAddress] = nodeData;
      }
    }
    if (state.nodes[0]) {
      state.nodes[0].isFetching = false;
    }
  });
  builder.addCase(getNodeDataThunk.rejected, (state) => {
    state.nodes[0].isFetching = false;
  });
  builder.addCase(getNodeBalanceThunk.fulfilled, (state, action) => {
    const nodeData = action.payload;
    if (nodeData.nodeAddress) {
      const nodeAddress = nodeData.nodeAddress.toLocaleLowerCase();
      if (state.nodes[nodeAddress]) {
        state.nodes[nodeAddress] = {
          ...state.nodes[nodeAddress],
          ...nodeData,
        };
      } else {
        state.nodes[nodeAddress] = nodeData;
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
