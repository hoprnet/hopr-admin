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
} from 'hopr-sdk/types';

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
  messages: { createdAt: number; body: string; challenge?: string }[];
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
};

export const initialState: InitialState = {
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
  peers: {
    connected: [],
    announced: [],
  },
  peerInfo: {
    announced: [],
    observed: [],
  },
  entryNodes: null,
  info: null,
  settings: null,
  statistics: null,
  tickets: [],
  tokens: [],
  version: null,
  transactions: [],
  pings: [],
};
