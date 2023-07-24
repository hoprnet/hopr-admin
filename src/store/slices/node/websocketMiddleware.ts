import { utils } from '@hoprnet/hopr-sdk';
import {
  Middleware, PayloadAction, nanoid 
} from '@reduxjs/toolkit';
import { initialState as nodeInitialState } from '../node/initialState';
import { initialState } from '../auth/initialState';
import { nodeActions } from './index';
import readStreamEvent from '../../../utils/readStreamEvent';

const {
  messageReceived,
  initializeMessagesWebsocket,
  closeMessagesWebsocket,
  updateMessagesWebsocketStatus,
  logsReceived,
  initializeLogsWebsocket,
  closeLogsWebsocket,
  updateLogsWebsocketStatus,
} = nodeActions;

const { WebsocketHelper } = utils;

type LocalRootState = {
  auth: typeof initialState;
  node: typeof nodeInitialState;
};

const websocketMiddleware: Middleware<object, LocalRootState> = ({
  dispatch, getState, 
}) => {
  let messagesWebsocket: typeof WebsocketHelper.prototype | null = null;
  let logsWebsocket: typeof WebsocketHelper.prototype | null = null;

  return (next) => (action: PayloadAction) => {
    if (action.type === initializeMessagesWebsocket.type) {
      // start websocket connection
      const {
        apiEndpoint, apiToken, 
      } = getState().auth.loginData;
      const messagesWebsocketStatus = getState().node.messagesWebsocketStatus;
      if (apiEndpoint && apiToken) {
        try {
          // check if connection is being established
          if (messagesWebsocketStatus === 'connecting') return;
          // close previous ws before opening new one
          if (messagesWebsocket) {
            messagesWebsocket.close();
          }
          dispatch(updateMessagesWebsocketStatus('connecting'));
          messagesWebsocket = new WebsocketHelper({
            apiEndpoint,
            apiToken,
            onOpen: () => {
              dispatch(updateMessagesWebsocketStatus('connected'));
            },
            onClose: () => {
              dispatch(updateMessagesWebsocketStatus(null));
            },
            onMessage: (message) => {
              dispatch(
                messageReceived({
                  id: nanoid(),
                  body: message,
                  createdAt: Date.now(),
                  seen: false,
                }),
              );
            },
          });
        } catch (e) {
          dispatch(updateMessagesWebsocketStatus('error'));
        }
      }
    } else if (action.type === closeMessagesWebsocket.type) {
      // close messages websocket
      messagesWebsocket?.close();
      dispatch(updateMessagesWebsocketStatus(null));
    } else if (action.type === initializeLogsWebsocket.type) {
      const {
        apiEndpoint, apiToken, 
      } = getState().auth.loginData;
      const logsWebsocketStatus = getState().node.logsWebsocketStatus;
      if (apiEndpoint && apiToken) {
        try {
          // check if connection is being established
          if (logsWebsocketStatus === 'connecting') return;
          // close previous ws before opening new one
          if (logsWebsocket) {
            logsWebsocket.close();
          }
          dispatch(updateLogsWebsocketStatus('connecting'));
          logsWebsocket = new WebsocketHelper({
            apiEndpoint,
            apiToken,
            decodeMessage: false,
            path: '/api/v2/node/stream/websocket/',
            onOpen: () => {
              dispatch(updateLogsWebsocketStatus('connected'));
            },
            onClose: () => {
              dispatch(updateLogsWebsocketStatus(null));
            },
            onMessage: (message) => {
              const log = readStreamEvent(message);
              if (log) {
                dispatch(logsReceived(log));
              }
            },
          });
        } catch (e) {
          dispatch(updateLogsWebsocketStatus('error'));
        }
      }
    } else if (action.type === closeLogsWebsocket.type) {
      // close logs websocket
      logsWebsocket?.close();
      dispatch(updateLogsWebsocketStatus(null));
    } else {
      return next(action);
    }
  };
};

export { websocketMiddleware };
