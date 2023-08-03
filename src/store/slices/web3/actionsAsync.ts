import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { gql } from 'graphql-request';

const STAKE_SUBGRAPH = 'https://api.studio.thegraph.com/query/40439/hopr-stake-all-seasons/v0.0.10'

const GET_COMMUNITY_NFTS_BY_ACCOUNT_QUERY = gql`
  query getCommunityNftsOwnedByAccountQuery($id: String!) {
    account(id: $id) {
      ownedBoosts(first: 1000, where: {uri_ends_with: "community"}) {
        id
        uri
      }
    }
  }
`

const getCommunityNftsOwnedByAccount = createAsyncThunk('web3/getCommunityNftsOwnedByAccount', async (
  payload: { account: string },
  { rejectWithValue },
) => {
  try {
    const variables = { id: payload.account };
    const response = await fetch(STAKE_SUBGRAPH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_COMMUNITY_NFTS_BY_ACCOUNT_QUERY,
        variables,
      }),
    })
    const responseJson: { data: {account: {ownedBoosts: { id: string, uri: string}[]}}} = await response.json() 

    return responseJson.data;
  } catch (e) {
    return rejectWithValue(e);
  }
})




export const createExtraReducers = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(getCommunityNftsOwnedByAccount.fulfilled, (state, action) => {
    if (action.payload) {
      // if any community nft comes back then the account has an a community nft
      state.hasCommunityNFT = !!action.payload.account.ownedBoosts.length
    }
  });
};

export const actionsAsync = { getCommunityNftsOwnedByAccount };
