import { useEffect } from 'react';
import { parseEther } from 'viem';
import { useEthersSigner } from '..';
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';
import { observeNodeBalances } from './balances';
import { observeChannels } from './channels';
import { observeNodeInfo } from './info';
import { observePendingSafeTransactions } from './safeTransactions';
import { observeSafeInfo } from './safeInfo';
import { nodeActionsAsync } from '../../store/slices/node';

export const useWatcher = ({ intervalDuration = 60_000 }: { intervalDuration?: number }) => {
  const dispatch = useAppDispatch();
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((store) => store.auth.loginData);
  const messages = useAppSelector((store) => store.node.messages.data);
  const connected = useAppSelector((store) => store.auth.status.connected);

  const signer = useEthersSigner();
  // flags to activate notifications
  const activeChannels = useAppSelector(store => store.app.configuration.notifications.channels)
  const activeMessage = useAppSelector(store => store.app.configuration.notifications.message)
  const activeNodeBalances = useAppSelector(store => store.app.configuration.notifications.nodeBalances)
  const activeNodeInfo = useAppSelector(store => store.app.configuration.notifications.nodeInfo)
  const activePendingSafeTransaction = useAppSelector(store => store.app.configuration.notifications.pendingSafeTransaction)
  // redux previous states, this can be updated from anywhere in the app
  const prevChannels = useAppSelector((store) => store.app.previousStates.prevChannels);
  const prevNodeBalances = useAppSelector((store) => store.app.previousStates.prevNodeBalances);
  const prevNodeInfo = useAppSelector((store) => store.app.previousStates.prevNodeInfo);
  const prevPendingSafeTransaction = useAppSelector((store) => store.app.previousStates.prevPendingSafeTransaction);

  // node watchers
  useEffect(() => {
    if (!connected) return;

    const watchChannelsInterval = setInterval(() => {
      observeChannels({
        apiEndpoint,
        apiToken,
        dispatch,
        active: activeChannels,
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
        active: activeNodeInfo,
        previousState: prevNodeInfo,
        updatePreviousData: (newNodeInfo) => {
          dispatch(appActions.setPrevNodeInfo(newNodeInfo));
        },
      });
    }, intervalDuration);

    const watchMessagesInterval = setInterval(() => {
      if (!apiEndpoint || !apiToken) return;
      return dispatch(
        nodeActionsAsync.getMessagesThunk({
          apiEndpoint,
          apiToken,
        }),
      );
    }, 5_000);

    const watchNodeBalancesInterval = setInterval(() => {
      observeNodeBalances({
        apiEndpoint,
        apiToken,
        active: activeNodeBalances,
        minimumNodeBalances: {
          hopr: '0',
          native: parseEther('0.003').toString(),
          safeHopr: '0',
          safeNative: '0',
          safeHoprAllowance: '0',
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
      clearInterval(watchMessagesInterval);
    };
  }, [connected, apiEndpoint, apiToken, prevNodeBalances, prevNodeInfo, prevChannels]);

  // safe watchers
  const safeIndexed = useAppSelector((store) => store.safe.info.safeIndexed);
  const selectedSafeAddress = useAppSelector((store) => store.safe.selectedSafe.data.safeAddress);

  useEffect(() => {
    const watchPendingSafeTransactionsInterval = setInterval(() => {
      observePendingSafeTransactions({
        dispatch,
        previousState: prevPendingSafeTransaction,
        selectedSafeAddress,
        active: activePendingSafeTransaction,
        signer: signer,
        updatePreviousData: (newSafeTransactions) => {
          dispatch(appActions.setPrevPendingSafeTransaction(newSafeTransactions));
        },
      });
    }, intervalDuration);

    const watchSafeInfoInterval = setInterval(() => {
      observeSafeInfo({
        dispatch,
        selectedSafeAddress,
        safeIndexed,
        active: true,
        signer,
      });
    }, intervalDuration);

    return () => {
      clearInterval(watchPendingSafeTransactionsInterval);
      clearInterval(watchSafeInfoInterval);
    };
  }, [selectedSafeAddress, signer, prevPendingSafeTransaction, safeIndexed]);

};
