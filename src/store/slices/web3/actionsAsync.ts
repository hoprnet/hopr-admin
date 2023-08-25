import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { STAKE_SUBGRAPH } from '../../../../config';

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

export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(getCommunityNftsOwnedByWallet.fulfilled, (state, action) => {
    if (action.payload) {
      if (action.payload?.boosts.length > 0 && action.payload?.boosts[0].id) {
        console.log('Found community NFT id:', action.payload?.boosts[0].id);
        state.communityNftId = parseInt(action.payload?.boosts[0].id);
      }
    }
  });
};

export const actionsAsync = { getCommunityNftsOwnedByWallet };
