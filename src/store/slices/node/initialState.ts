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
  // TODO: should this hold sent and received messages?
  messages: unknown[];
  peers: GetPeersResponseType | null;
  peerInfo: GetPeerInfoResponseType | null;
  settings: GetSettingsResponseType | null;
  statistics: GetStatisticsResponseType | null;
  tickets: GetTicketsResponseType | null;
  token: GetTokenResponseType | null;
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
  peers: {
    connected: [],
    announced: [],
  },
  peerInfo: {
    announced: [],
    observed: [],
  },
  info: null,
  settings: null,
  statistics: null,
  tickets: [],
  token: null,
};
