import type {
  AccountResponseType, GetChannelsResponseType, GetInfoResponseType 
} from '@hoprnet/hopr-sdk';
import type { WatcherMessage } from '../../../hooks/useWatcher/messages';
import type { SafeMultisigTransactionResponse } from '@safe-global/safe-core-sdk-types';

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
  previousStates: {
    prevChannels: GetChannelsResponseType | null;
    prevNodeInfo: GetInfoResponseType | null;
    prevNodeBalances: AccountResponseType | null;
    prevMessage: WatcherMessage;
    prevPendingSafeTransaction: SafeMultisigTransactionResponse | null;
  };
};

export const initialState: InitialState = {
  notifications: [],
  // previous states used to compare for notifications
  previousStates: {
    prevChannels: null,
    prevPendingSafeTransaction: null,
    prevMessage: null,
    prevNodeBalances: null,
    prevNodeInfo: null,
  },
};
