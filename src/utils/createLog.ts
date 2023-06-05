import { Log } from '../types';

const createLog = (message: string, timestamp?: number): Log => {
  return {
    id: String(Math.random()),
    message,
    timestamp: timestamp || +new Date(),
  };
};

export default createLog;
