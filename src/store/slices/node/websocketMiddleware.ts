import { utils } from '@hoprnet/hopr-sdk';
import { Middleware, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { initialState as nodeInitialState } from '../node/initialState';
import { initialState } from '../auth/initialState';
import { nodeActions } from './index';

const {
  messageReceived,
  initializeMessagesWebsocket,
  closeMessagesWebsocket,
  updateMessagesWebsocketStatus,
} =
  nodeActions;

const { WebsocketHelper } = utils;

type LocalRootState = {
  auth: typeof initialState;
  node: typeof nodeInitialState;
};

const websocketMiddleware: Middleware<object, LocalRootState> = ({
  dispatch,
  getState,
}) => {
  let messagesWebsocket: typeof WebsocketHelper.prototype | null = null;

  return (next) => (action: PayloadAction) => {
    if (action.type === initializeMessagesWebsocket.type) {
      // start websocket connection
      const {
        apiEndpoint,
        apiToken,
      } = getState().auth.loginData;
      const connectedToNode = getState().auth.status.connected;
      if (!connectedToNode) return;
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
            decodeMessage: false,
            onMessage: (message) => {
              try {
                const messageJSON: { type: 'message' | 'message-ack'; tag?: number; body?: string; id?: string } =
                  JSON.parse(message);

                // only show messages
                if (messageJSON.type !== 'message') return;

                if (messageJSON.body) {
                  dispatch(
                    messageReceived({
                      id: nanoid(),
                      body: messageJSON.body,
                      createdAt: Date.now(),
                      seen: false,
                    }),
                  );
                }
              } catch (e) {
                console.error('could not parse incoming message');
              }
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
    } else {
      return next(action);
    }
  };
};

export { websocketMiddleware };
