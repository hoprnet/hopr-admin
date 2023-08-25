import { ActionReducerMapBuilder, createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { STAKE_SUBGRAPH, GNOSIS_CHAIN_HOPR_BOOST_NFT } from '../../../../config';
import erc721ABI from '../../../abi/erc721-abi.json'
import {
  Address,
  WalletClient,
  encodePacked,
  keccak256,
  publicActions,
  toBytes,
  toHex
} from 'viem';
import Safe, { EthersAdapter, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit';
import { RootState } from '../..';

// TO REMOVE
import { HOPR_CHANNELS_SMART_CONTRACT_ADDRESS, HOPR_NODE_MANAGEMENT_MODULE, HOPR_NODE_STAKE_FACTORY } from '../../../../config'
import hoprNodeStakeFactoryAbi from '../../../abi/nodeStakeFactoryAbi.json';

const getCommunityNftsOwnedByWallet = createAsyncThunk(
  'web3/getCommunityNftsOwnedByWallet',
  async (payload: { account: string }, { rejectWithValue }) => {
    try {
      const account = payload.account;
      const response = await fetch(STAKE_SUBGRAPH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{\"query\":\"\\n  query getSubGraphNFTsUserDataForWallet {\\n    _meta {\\n      block {\\n        timestamp\\n        number\\n      }\\n    }\\n    boosts(first: 1, where: {owner: \\\"${account.toLocaleLowerCase()}\\\", uri_ends_with: \\\"Network_registry/community\\\"}) {\\n      id}\\n  }\\n\"}`,
      });
      const responseJson: {
        data: {
          boosts: { id: string }[];
        } | null;
      } = await response.json();

      return responseJson.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  },
);

const sendNftToSafeThunk = createAsyncThunk<
  | {
      success: boolean;
    }
  | undefined,
  {
    walletClient: WalletClient;
    walletAddress: string;
    safeAddres: string;
    communityNftId: number;
  },
  { state: RootState }
>(
  'safe/sendNftToSafe',
  async (payload, {
    rejectWithValue,
    dispatch,
  }) => {
    dispatch(setCommunityNftTransfering(true));
    let success = false;
    try {
      const superWalletClient = payload.walletClient.extend(publicActions);

      if (!superWalletClient.account) return;

      const {
        result,
        request,
      } = await superWalletClient.simulateContract({
        account: payload.walletClient.account,
        address: GNOSIS_CHAIN_HOPR_BOOST_NFT,
        abi: erc721ABI,
        functionName: 'safeTransferFrom',
        args: [
          payload.walletAddress,
          payload.safeAddres,
          payload.communityNftId,
        ],
      });

      // TODO: Add error handling if failed (notificaiton)

      if (!result) return;

      const transactionHash = await superWalletClient.writeContract(request);

      const red = await superWalletClient.waitForTransactionReceipt({ hash: transactionHash });

      console.log({ red });

      dispatch(
        setCommunityNftIdInSafe(payload.communityNftId),
      );

      return {
        success
      };
    } catch (e) {
      return rejectWithValue(e);
    }
  },
  { condition: (_payload, { getState }) => {
    const isFetching = getState().web3.communityNftTransfering;
    if (isFetching) {
      return false;
    }
  } },
);

// Helper actions to update the isFetching state
const setCommunityNftTransfering = createAction<boolean>('web3/setCommunityNftTransfering');
const setCommunityNftIdInSafe = createAction<{}>('safe/setCommunityNftId');

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(getCommunityNftsOwnedByWallet.fulfilled, (state, action) => {
    if (action.payload) {
      if (action.payload?.boosts.length > 0 && action.payload?.boosts[0].id) {
        console.log('Found community NFT id:', action.payload?.boosts[0].id);
        state.communityNftId = parseInt(action.payload?.boosts[0].id);
      }
    }
  });
  builder.addCase(sendNftToSafeThunk.rejected, (state) => {
    state.communityNftTransfering = false;
  });
  builder.addCase(sendNftToSafeThunk.fulfilled, (state, action) => {
    state.communityNftId = null;
    state.communityNftTransfering = false;
  });
};

export const actionsAsync = { 
  getCommunityNftsOwnedByWallet,
  sendNftToSafeThunk
};
