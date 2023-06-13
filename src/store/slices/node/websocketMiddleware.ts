import { utils } from '@hoprnet/hopr-sdk';
import { Middleware, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from '../auth/initialState';
import { nodeActions } from './index';

const {
  messageReceived,
  initializeWebsocket,
  closeWebsocket,
  updateWebsocketStatus,
} = nodeActions;

const { WebsocketHelper } = utils;

type LocalRootState = {
  auth: typeof initialState;
};

const websocketMiddleware: Middleware<object, LocalRootState> = ({
  dispatch,
  getState,
}) => {
  let socket: typeof WebsocketHelper.prototype | null = null;

  return (next) => (action: PayloadAction) => {
    if (action.type === initializeWebsocket.type) {
      // start websocket connection
      const { apiEndpoint, apiToken } = getState().auth.loginData;
      if (apiEndpoint && apiToken) {
        try {
          socket = new WebsocketHelper({
            apiEndpoint,
            apiToken,
            onOpen: () => {
              dispatch(updateWebsocketStatus(true));
            },
            onClose: () => {
              dispatch(updateWebsocketStatus(false));
            },
            onMessage: (message) => {
              dispatch(
                messageReceived({
                  body: message,
                  createdAt: Date.now(),
                  seen: false,
                })
              );
            },
          });
        } catch (e) {
          console.log(e);
          dispatch(updateWebsocketStatus(false));
        }
      }
    } else if (action.type === closeWebsocket.type) {
      // close websocket
      socket?.close();
      dispatch(updateWebsocketStatus(false));
    } else {
      return next(action);
    }
  };
};

export { websocketMiddleware };
