import type { GetBalancesResponseType, GetChannelsResponseType, GetInfoResponseType } from '@hoprnet/hopr-sdk';
import type { WatcherMessage } from '../../../hooks/useWatcher/messages';
import type { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';
import { loadStateFromLocalStorage } from '../../../utils/localStorage';

type InitialState = {
  notifications: {
    id: string;
    name: string;
    source: string;
    seen: boolean;
    interacted: boolean;
    timeout: number;
    url: string | null;
  }[];
  configuration: {
    notifications: {
      channels: boolean,
      nodeInfo: boolean,
      nodeBalances: boolean,
      message: boolean,
      pendingSafeTransaction: boolean
    }
  };
  previousStates: {
    prevChannels: GetChannelsResponseType | null;
    prevNodeInfo: GetInfoResponseType | null;
    prevNodeBalances: GetBalancesResponseType | null;
    prevMessage: WatcherMessage;
    prevPendingSafeTransaction: SafeMultisigTransactionResponse | null;
  };
};

export const initialState: InitialState = {
  notifications: [],
  configuration: { notifications: loadStateFromLocalStorage('app/configuration/notifications') as InitialState['configuration']['notifications']
      ?? {
        channels: true,
        message: true,
        nodeBalances: true,
        nodeInfo: true,
        pendingSafeTransaction: true,
      } },
  // previous states used to compare for notifications
  previousStates: {
    prevChannels: null,
    prevPendingSafeTransaction: null,
    prevMessage: null,
    prevNodeBalances: null,
    prevNodeInfo: null,
  },
};
