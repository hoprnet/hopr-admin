import { websocket } from '@hoprnet/hopr-sdk/api';
import { decodeMessage } from '@hoprnet/hopr-sdk/utils';
import { Middleware, PayloadAction } from '@reduxjs/toolkit';
import WebSocket from 'ws';
import { initialState } from '../auth/initialState';
import { nodeActions } from './index';

const { messageReceived, initializeWebsocket, closeWebsocket } = nodeActions;

type LocalRootState = {
  auth: typeof initialState;
};

const websocketMiddleware: Middleware<{}, LocalRootState> = ({
  dispatch,
  getState,
}) => {
  let socket: WebSocket | null = null;

  return (next) => (action: PayloadAction) => {
    if (action.type === initializeWebsocket.type) {
      // start websocket connection
      const { apiEndpoint, apiToken } = getState().auth.loginData;
      if (apiEndpoint && apiToken) {
        socket = websocket({
          apiEndpoint,
          apiToken,
        });

        // add event listeners to socket
        socket.onopen = () => {
          dispatch(initializeWebsocket());
        };

        socket.onclose = () => {
          dispatch(closeWebsocket());
        };

        socket.onmessage = (event) => {
          const body = event.data.toString();
          // message received is an acknowledgement of a
          // message we have send, we can safely ignore this
          if (body.startsWith('ack:')) return;

          let message: string | undefined;
          try {
            message = decodeMessage(body);
          } catch (error) {
            console.error(error);
          }
          if (!message) return;

          dispatch(
            messageReceived({
              body: message,
              createdAt: Date.now(),
              seen: false,
            })
          );
        };

        socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          dispatch(closeWebsocket());
        };
      }
    } else if (action.type === closeWebsocket.type) {
      // close websocket
      socket?.close();
      dispatch(closeWebsocket());
    }

    return next(action);
  };
};

export { websocketMiddleware };
