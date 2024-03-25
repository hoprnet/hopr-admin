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
  const firstChannelsCallWasSuccesfull = useAppSelector((store) => !!store.node.channels.data);
  const connected = useAppSelector((store) => store.auth.status.connected);

  const signer = useEthersSigner();
  // flags to activate notifications
  const activeChannels = useAppSelector(store => store.app.configuration.notifications.channels)
  const activeMessage = useAppSelector(store => store.app.configuration.notifications.message)
  const activeNodeBalances = useAppSelector(store => store.app.configuration.notifications.nodeBalances)
  const activeNodeInfo = useAppSelector(store => store.app.configuration.notifications.nodeInfo)
  const activePendingSafeTransaction = useAppSelector(store => store.app.configuration.notifications.pendingSafeTransaction)
  // redux previous states, this can be updated from anywhere in the app
  const prevOutgoingChannels = useAppSelector((store) => store.app.previousStates.prevOutgoingChannels);
  const prevIncomingChannels = useAppSelector((store) => store.app.previousStates.prevIncomingChannels);
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

    const watchMetricsInterval = setInterval(() => {
      if (!apiEndpoint || !apiToken) return;
      return dispatch(
        nodeActionsAsync.getPrometheusMetricsThunk({
          apiEndpoint,
          apiToken,
        }),
      );
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
      clearInterval(watchMetricsInterval);
    };
  }, [connected, apiEndpoint, apiToken, prevNodeBalances, prevNodeInfo, prevOutgoingChannels]);

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
    if(!firstChannelsCallWasSuccesfull) return;

    if(!prevOutgoingChannels) {
      const channelsOutgoingIds = Object.keys(channels.outgoing);
      if(
        channelsOutgoingIds.length !==0 && //true
        Object.keys(channels.outgoing[channelsOutgoingIds[0]]).includes('status') // If the channels are populated more than with tickets data
      ) {
        dispatch(appActions.setPrevOutgoingChannels(channels.outgoing));
      };
      return;
    };

    if(activeChannels) {

      const changesOutgoing = checkHowChannelsHaveChanged(prevOutgoingChannels, channels.outgoing);
      if(changesOutgoing.length !== 0) {
        console.log('changes channels', changesOutgoing)
        for(let i = 0; i < changesOutgoing.length; i++){
          let notificationText: null | string = null;
          if(changesOutgoing[i].status === "Open") {
            notificationText = `Channel to ${changesOutgoing[i].peerAddress} opened.`
          } else if(changesOutgoing[i].status === "PendingToClose") {
            notificationText = `Channel to ${changesOutgoing[i].peerAddress} is pending to close.`
          } else if(changesOutgoing[i].status === "Closed") {
            notificationText = `Channel to ${changesOutgoing[i].peerAddress} closed.`
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
        dispatch(appActions.setPrevOutgoingChannels(channels.outgoing));
      }

    }
  }, [activeChannels, firstChannelsCallWasSuccesfull, channels, prevOutgoingChannels]);

  // useEffect(() => {
  //   if(!firstChannelsCallWasSuccesfull) return;

  //   if(!prevOutgoingChannels) {
  //     const channelsOutgoingIds = Object.keys(channels.outgoing);
  //     if(
  //       channelsOutgoingIds.length !==0 && //true
  //       Object.keys(channels.outgoing[channelsOutgoingIds[0]]).includes('status') // If the channels are populated more than with tickets data
  //     ) {
  //       dispatch(appActions.setPrevOutgoingChannels(channels));
  //     };
  //     return
  //   };

  //   if(activeChannels) {

  //     const changesOutgoing = checkHowChannelsHaveChanged(prevOutgoingChannels, channels.outgoing);
  //     if(changesOutgoing.length !== 0) {
  //       console.log('changes channels', changesOutgoing)
  //       for(let i = 0; i < changesOutgoing.length; i++){
  //         let notificationText: null | string = null;
  //         if(changesOutgoing[i].status === "Open") {
  //           notificationText = `Channel to ${changesOutgoing[i].peerAddress} opened.`
  //         } else if(changesOutgoing[i].status === "PendingToClose") {
  //           notificationText = `Channel to ${changesOutgoing[i].peerAddress} is pending to close.`
  //         } else if(changesOutgoing[i].status === "Closed") {
  //           notificationText = `Channel to ${changesOutgoing[i].peerAddress} closed.`
  //         }
  //         if (notificationText) {
  //           sendNotification({
  //             notificationPayload: {
  //               source: 'node',
  //               name: notificationText,
  //               url: null,
  //               timeout: null,
  //             },
  //             toastPayload: { message: notificationText },
  //             dispatch,
  //           });
  //         }
  //       }
  //       dispatch(appActions.setPrevOutgoingChannels(channels));
  //     }


  //     const changesIncoming = checkHowChannelsHaveChanged(prevIncomingChannels, channels);
  //     if(changesOutgoing.length !== 0) {
  //       console.log('changes channels', changesOutgoing)
  //       for(let i = 0; i < changesOutgoing.length; i++){
  //         let notificationText: null | string = null;
  //         if(changesOutgoing[i].status === "Open") {
  //           notificationText = `Channel to ${changesOutgoing[i].peerAddress} opened.`
  //         } else if(changesOutgoing[i].status === "PendingToClose") {
  //           notificationText = `Channel to ${changesOutgoing[i].peerAddress} is pending to close.`
  //         } else if(changesOutgoing[i].status === "Closed") {
  //           notificationText = `Channel to ${changesOutgoing[i].peerAddress} closed.`
  //         }
  //         if (notificationText) {
  //           sendNotification({
  //             notificationPayload: {
  //               source: 'node',
  //               name: notificationText,
  //               url: null,
  //               timeout: null,
  //             },
  //             toastPayload: { message: notificationText },
  //             dispatch,
  //           });
  //         }
  //       }
  //       dispatch(appActions.setPrevOutgoingChannels(channels));
  //     }

  //   }
  // }, [activeChannels, firstChannelsCallWasSuccesfull, channels, prevIncomingChannels]);

};
