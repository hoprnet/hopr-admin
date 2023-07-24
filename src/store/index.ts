import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook, useDispatch, useSelector 
} from 'react-redux';

import authSlice from './slices/auth';
import nodeSlice from './slices/node';
import safeSlice from './slices/safe';
import web3Slice from './slices/web3';
import appSlice from './slices/app';
import { websocketMiddleware } from './slices/node/websocketMiddleware';

const store = configureStore({
  reducer: {
    auth: authSlice,
    node: nodeSlice,
    safe: safeSlice,
    web3: web3Slice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(websocketMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
