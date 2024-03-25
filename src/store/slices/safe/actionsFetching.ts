import { ActionReducerMapBuilder, createAction } from '@reduxjs/toolkit';
import { initialState } from './initialState';

// Helper actions to update the isFetching state
const setInfoFetching = createAction<boolean>('node/setSafeInfoFetching');
const setSelectedSafeFetching = createAction<boolean>('node/setSelectedSafeFetching');
const setSafeByOwnerFetching = createAction<boolean>('node/setSafeByOwnerFetching');
const setSafeAllTransactionsFetching = createAction<boolean>('node/setSafeAllTransactionsFetching');
const setSafePendingTransactionsFetching = createAction<boolean>('node/setSafePendingTransactionsFetching');
const setSafeDelegatesFetching = createAction<boolean>('node/setSafeDelegatesFetching');
const setCreateTransactionFetching = createAction<boolean>('node/setCreateTransactionFetching');
const setConfirmTransactionFetching = createAction<boolean>('node/setConfirmTransactionFetching');
const setRejectTransactionFetching = createAction<boolean>('node/setRejectTransactionFetching');
const setExecuteTransactionFetching = createAction<boolean>('node/setExecuteTransactionFetching');
const setAddDelegateFetching = createAction<boolean>('node/setAddDelegateFetching');
const setRemoveDelegateFetching = createAction<boolean>('node/setRemoveDelegateFetching');
const setTokenListFetching = createAction<boolean>('node/setTokenListFetching');
const setTokenFetching = createAction<boolean>('node/setTokenFetching');

export const safeActionsFetching = {
  setInfoFetching,
  setSelectedSafeFetching,
  setSafeByOwnerFetching,
  setSafeAllTransactionsFetching,
  setSafePendingTransactionsFetching,
  setSafeDelegatesFetching,
  setCreateTransactionFetching,
  setConfirmTransactionFetching,
  setRejectTransactionFetching,
  setExecuteTransactionFetching,
  setAddDelegateFetching,
  setRemoveDelegateFetching,
  setTokenListFetching,
  setTokenFetching,
};

export const createFetchingReducer = (builder: ActionReducerMapBuilder<typeof initialState>) => {
  builder.addCase(setInfoFetching, (state, action) => {
    state.info.isFetching = action.payload;
  });
  builder.addCase(setSelectedSafeFetching, (state, action) => {
    state.selectedSafe.isFetching = action.payload;
  });
  builder.addCase(setSafeByOwnerFetching, (state, action) => {
    state.safesByOwner.isFetching = action.payload;
  }),
  builder.addCase(setSafeAllTransactionsFetching, (state, action) => {
    state.allTransactions.isFetching = action.payload;
  }),
  builder.addCase(setSafePendingTransactionsFetching, (state, action) => {
    state.pendingTransactions.isFetching = action.payload;
  }),
  builder.addCase(setSafeDelegatesFetching, (state, action) => {
    state.delegates.isFetching = action.payload;
  }),
  builder.addCase(setCreateTransactionFetching, (state, action) => {
    state.createTransaction.isFetching = action.payload;
  }),
  builder.addCase(setConfirmTransactionFetching, (state, action) => {
    state.confirmTransaction.isFetching = action.payload;
  }),
  builder.addCase(setRejectTransactionFetching, (state, action) => {
    state.rejectTransaction.isFetching = action.payload;
  }),
  builder.addCase(setExecuteTransactionFetching, (state, action) => {
    state.executeTransaction.isFetching = action.payload;
  }),
  builder.addCase(setAddDelegateFetching, (state, action) => {
    state.addDelegate.isFetching = action.payload;
  }),
  builder.addCase(setRemoveDelegateFetching, (state, action) => {
    state.removeDelegate.isFetching = action.payload;
  }),
  builder.addCase(setTokenListFetching, (state, action) => {
    state.tokenList.isFetching = action.payload;
  }),
  builder.addCase(setTokenFetching, (state, action) => {
    state.token.isFetching = action.payload;
  });
};
