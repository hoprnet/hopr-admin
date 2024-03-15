import { useEffect } from 'react';
import { parseEther } from 'viem';
import { useEthersSigner } from '..';
import { useAppDispatch, useAppSelector } from '../../store';
import { appActions } from '../../store/slices/app';
import { observeNodeBalances } from './balances';
import { observeNodeInfo } from './info';
import { observePendingSafeTransactions } from './safeTransactions';
import { observeSafeInfo } from './safeInfo';
import { sendNotification } from '../../hooks/useWatcher/notifications';
import { nodeActions, nodeActionsAsync } from '../../store/slices/node';
import { checkHowChannelsHaveChanged } from './channels';

export const useWatcher = ({ intervalDuration = 60_000 }: { intervalDuration?: number }) => {
  const dispatch = useAppDispatch();
  const {
    apiEndpoint,
    apiToken,
  } = useAppSelector((store) => store.auth.loginData);
  const messages = useAppSelector((store) => store.node.messages.data);
  const channels = useAppSelector((store) => store.node.channels.parsed);
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
      if (!apiEndpoint || !apiToken || !activeChannels) return;
      return dispatch(
        nodeActionsAsync.getChannelsThunk({
          apiEndpoint,
          apiToken,
        }),
      );
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


  useEffect(() => {
    if(activeMessage && messages && messages.length > 0) {
        messages.forEach((msgReceived, index) => {
          let hasToNotify = !msgReceived.notified;
          if(hasToNotify){
            const notification = `Message received: ${msgReceived.body}`;
            sendNotification({
              notificationPayload: {
                source: 'node',
                name: notification,
                url: null,
                timeout: null,
              },
              toastPayload: { message: notification },
              dispatch,
            });
            dispatch(nodeActions.setMessageNotified(index));
          }
        })
    }
  }, [activeMessage, messages]);

  useEffect(() => {
    console.log('useEffect channels', channels, prevChannels)
    if(!prevChannels) {
      if(Object.keys(channels.incoming).length !==0 || Object.keys(channels.outgoing).length !==0) {
        dispatch(appActions.setPrevChannels(channels));
      };
      return
    };
    if(activeChannels) {
      const changes = checkHowChannelsHaveChanged(prevChannels, channels);
      if(changes.length !== 0) {
        console.log('changes channels', changes)
        for(let i = 0; i < changes.length; i++){
          let notificationText: null | string = null;
          if(changes[i].status === "Open") {
            notificationText = `Channel to ${changes[i].peerAddress} opened.`
          } else if(changes[i].status === "PendingToClose") {
            notificationText = `Channel to ${changes[i].peerAddress} is pending to close.`
          } else if(changes[i].status === "Closed") {
            notificationText = `Channel to ${changes[i].peerAddress} closed.`
          }
          if (notificationText) {
            sendNotification({
              notificationPayload: {
                source: 'node',
                name: notificationText,
                url: null,
                timeout: null,
              },
              toastPayload: { message: notificationText },
              dispatch,
            });
          }
        }
        dispatch(appActions.setPrevChannels(channels));
      }
    }
  }, [activeChannels, channels, prevChannels]);

};
