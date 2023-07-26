import { useEffect } from 'react';
import { parseEther } from 'viem';
import { useEthersSigner } from '..';
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';
import { observeNodeBalances } from './balances';
import { observeChannels } from './channels';
import { observeNodeInfo } from './info';
import { observeMessages } from './messages';
import { observePendingSafeTransactions } from './safeTransactions';

export const useWatcher = ({ intervalDuration = 15000 }: { intervalDuration?: number }) => {
  const dispatch = useAppDispatch();
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((store) => store.auth.loginData);
  const messages = useAppSelector((store) => store.node.messages);
  const connected = useAppSelector((store) => store.auth.status.connected);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafeAddress);
  const signer = useEthersSigner();
  // redux previous states, this can be updated from anywhere in the app
  const prevChannels = useAppSelector((store) => store.app.previousStates.prevChannels);
  const prevMessage = useAppSelector((store) => store.app.previousStates.prevMessage);
  const prevNodeBalances = useAppSelector((store) => store.app.previousStates.prevNodeBalances);
  const prevNodeInfo = useAppSelector((store) => store.app.previousStates.prevNodeInfo);
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);

  // node watchers
  useEffect(() => {
    if(!connected) return;
    
    const watchChannelsInterval = setInterval(() => {
      observeChannels({
        apiEndpoint,
        apiToken,
        dispatch,
        previousState: prevChannels,
        updatePreviousData: (newChannels) => {
          dispatch(appActions.setPrevChannels(newChannels));
        },
      });
    }, intervalDuration);

    const watchNodeInfoInterval = setInterval(() => {
      observeNodeInfo({
        apiEndpoint,
        apiToken,
        dispatch,
        previousState: prevNodeInfo,
        updatePreviousData: (newNodeInfo) => {
          dispatch(appActions.setPrevNodeInfo(newNodeInfo));
        },
      });
    }, intervalDuration);

    const watchNodeBalancesInterval = setInterval(() => {
      observeNodeBalances({
        apiEndpoint,
        apiToken,
        minimumNodeBalances: {
          hopr: '0',
          native: parseEther('0.003').toString(),
        },
        previousState: prevNodeBalances,
        updatePreviousData: (newNodeBalances) => {
          dispatch(appActions.setPrevNodeBalances(newNodeBalances));
        },
        dispatch,
      });
    }, intervalDuration);

    return () => {
      clearInterval(watchChannelsInterval);
      clearInterval(watchNodeInfoInterval);
      clearInterval(watchNodeBalancesInterval);
    };
  }, [connected, apiEndpoint, apiToken, prevNodeBalances, prevNodeInfo, prevChannels]);

  // safe watchers
  useEffect(() => {
    const watchPendingSafeTransactionsInterval = setInterval(() => {
      observePendingSafeTransactions({
        dispatch,
        previousState: prevPendingSafeTransaction,
        selectedSafeAddress,
        signer: signer,
        updatePreviousData: (newSafeTransactions) => {
          dispatch(appActions.setPrevPendingSafeTransaction(newSafeTransactions));
        },
      });
    }, intervalDuration);

    return () => {
      clearInterval(watchPendingSafeTransactionsInterval);
    };
  }, [selectedSafeAddress, signer, prevPendingSafeTransaction]);

  // check when redux receives new messages
  useEffect(() => {
    observeMessages({
      dispatch,
      messages,
      previousState: prevMessage,
      updatePreviousData: (newMessage) => {
        dispatch(appActions.setPrevMessage(newMessage));
      },
    });
  }, [messages, prevMessage]);
};
