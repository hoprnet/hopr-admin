import type { Log } from '../types';
import createLog from './createLog';

/**
 * Legacy event reader from stream socket.
 * Read incoming stream event and convert it to a client log.
 * @param event Event coming from '/api/v2/node/stream/websocket'
 * @returns log readable by hopr-admin
 */
const readStreamEvent = (data: string): Log | undefined => {
  if (data === undefined) {
    return undefined;
  }

  try {
    const log: {
      type: string;
      msg: string;
      ts: string;
    } = JSON.parse(data);

    // we ignore plain messages, instead print HOPRd logs
    if (log.type === 'message') {
      return undefined;
    }
    // we ignore connected type, which is simply a line of all connected peers
    if (log.type === 'connected') {
      return undefined;
    }
    // we are only interested in messages which have a message
    if (!log.msg) {
      return undefined;
    }

    return createLog(log.msg, +new Date(log.ts));
  } catch (error) {
    console.log('error reading stream log', error);
  }
};

export default readStreamEvent;
