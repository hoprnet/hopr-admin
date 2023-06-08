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
  PingNodeResponseType,
} from '@hoprnet/hopr-sdk';

type InitialState = {
  info: GetInfoResponseType | null;
  status: {
    initiating: boolean;
    initiated: boolean;
  };
  addresses: AccountResponseType | null;
  aliases: GetAliasesResponseType | null;
  balances: AccountResponseType | null;
  channels: GetChannelsResponseType | null;
  messages: {
    createdAt: number;
    seen: boolean;
    body: string;
    challenge?: string;
  }[];
  logs: {
    id: string;
    message: string;
    timestamp: number;
  }[];
  signedMessages: { createdAt: number; body: string }[];
  peers: GetPeersResponseType | null;
  entryNodes: GetEntryNodesResponseType | null;
  peerInfo: GetPeerInfoResponseType | null;
  settings: GetSettingsResponseType | null;
  statistics: GetStatisticsResponseType | null;
  tickets: GetTicketsResponseType | null;
  tokens: GetTokenResponseType[];
  version: string | null;
  transactions: string[];
  pings: (PingNodeResponseType & { peerId: string })[];
  metrics: string | null;
  messagesWebsocketConnected: boolean;
  logsWebsocketConnected: boolean;
};

export const initialState: InitialState = {
  info: null,
  status: {
    initiating: false,
    initiated: false,
  },
  addresses: null,
  aliases: null,
  balances: null,
  channels: null,
  messages: [],
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
  messagesWebsocketConnected: false,
  logsWebsocketConnected: false,
};
