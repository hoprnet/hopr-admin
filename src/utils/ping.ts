
import { actionsAsync } from '../store/slices/node/actionsAsync';
import { sendNotification } from '../hooks/useWatcher/notifications';

const ping = (
    peerId: string,
    apiEndpoint: string,
    apiToken?: string | null,

) => {
    if (loginData.apiEndpoint) {
      dispatch(
        actionsAsync.pingNodeThunk({
          peerId,
          apiEndpoint: loginData.apiEndpoint,
          apiToken: loginData.apiToken ? loginData.apiToken : '',
        })
      )
        .unwrap()
        .then((resp: any) => {
          const msg = `Ping of ${peerId} succeded with latency of ${resp.latency}ms`;
          console.log(msg, resp);
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: msg,
              url: null,
              timeout: null,
            },
            toastPayload: { message: msg },
            dispatch,
          });
        })
        .catch(async (e) => {
          const isCurrentApiEndpointTheSame = await dispatch(actionsAsync.isCurrentApiEndpointTheSame(loginData.apiEndpoint!)).unwrap();
          if (!isCurrentApiEndpointTheSame) return;

          let errMsg = `Ping of ${peerId} failed`;
          if (e instanceof sdkApiError && e.hoprdErrorPayload?.status) errMsg = errMsg + `.\n${e.hoprdErrorPayload.status}`;
          if (e instanceof sdkApiError && e.hoprdErrorPayload?.error) errMsg = errMsg + `.\n${e.hoprdErrorPayload.error}`;
          console.warn(errMsg, e);
          sendNotification({
            notificationPayload: {
              source: 'node',
              name: errMsg,
              url: null,
              timeout: null,
            },
            toastPayload: { message: errMsg },
            dispatch,
          });
        })
        .finally(() => {
        });
    }
  };