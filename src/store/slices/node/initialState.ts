import { environment } from '../../../../config';
import type {
  GetStatisticsResponseType,
  AccountResponseType,
  GetAliasesResponseType,
  GetChannelsResponseType,
  GetInfoResponseType,
  GetPeerInfoResponseType,
  GetPeersResponseType,
  GetSettingsResponseType,
  GetTicketsResponseType,
  GetTokenResponseType,
  GetEntryNodesResponseType,
  PingNodeResponseType
} from '@hoprnet/hopr-sdk';

export type Message = {
  id: string;
  createdAt: number;
  body: string;
  seen?: boolean;
  status?: 'sending' | 'sent' | 'error';
  error?: string;
  challenge?: string;
};

type WebsocketConnectionStatus = 'connecting' | 'connected' | 'error' | null;

type InitialState = {
  // info: GetInfoResponseType | null;
  info: {
    data: GetInfoResponseType | null;
    isFetching: boolean;
  };
  status: {
    data: {
      initiating: boolean;
      initiated: boolean;
    };
    isFetching: boolean;
  };
  addresses: {
    data: { hopr: string | null; native: string | null };
    isFetching: boolean;
  };
  aliases: GetAliasesResponseType | null;
  balances: {
    hopr: string | null;
    native: string | null;
    reloading: boolean;
  };
  channels: {
    data: GetChannelsResponseType | null;
    isFetching: boolean;
  };
  messages: Message[];
  messagesSent: Message[];
  logs: {
    id: string;
    message: string;
    timestamp: number;
  }[];
  signedMessages: { createdAt: number; body: string }[];
  peers: GetPeersResponseType | null;
  entryNodes: GetEntryNodesResponseType | null;
  peerInfo: {
    announced: string[];
    observed: string[];
  };
  settings: GetSettingsResponseType | null;
  statistics: GetStatisticsResponseType | null;
  tickets: GetTicketsResponseType | null;
  tokens: GetTokenResponseType[];
  version: string | null;
  transactions: string[];
  pings: (PingNodeResponseType & { peerId: string })[];
  metrics: string | null;
  messagesWebsocketStatus: WebsocketConnectionStatus;
  logsWebsocketStatus: WebsocketConnectionStatus;
};

export const initialState: InitialState = {
  info: {
    data: null,
    isFetching: false,
  },
  status: {
    data: {
      initiating: false,
      initiated: false,
    },
    isFetching: false,
  },
  addresses: {
    data: {
      hopr: null,
      native: null,
    },
    isFetching: false,
  },
  aliases: null,
  balances: {
    native: null,
    hopr: null,
    reloading: false,
  },
  channels: {
    data: null,
    isFetching: false,
  },
  messages: [],
  messagesSent: [],
  signedMessages: [],
  logs: [],
  peers: {
    connected: [],
    announced: [],
  },
  peerInfo: {
    announced: [],
    observed: [],
  },
  entryNodes: null,
  settings: null,
  statistics: null,
  tickets: [],
  tokens: [],
  version: null,
  transactions: [],
  pings: [],
  metrics: null,
  messagesWebsocketStatus: null,
  logsWebsocketStatus: null,
};
