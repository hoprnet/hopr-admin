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
  info: {
    data: GetInfoResponseType | null;
    isFetching: boolean;
  };
  status: {
    initiating: boolean;
    initiated: boolean;
  };
  addresses: {
    data: { hopr: string | null; native: string | null };
    isFetching: boolean;
  };
  aliases: { data: GetAliasesResponseType | null; isFetching: boolean };
  balances: {
    data: {
      hopr: {
        value: string | null;
        formatted: string | null;
      };
      native: {
        value: string | null;
        formatted: string | null;
      };
    };
    isFetching: boolean;
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
  peers: { data: GetPeersResponseType | null; isFetching: boolean };
  entryNodes: { data: GetEntryNodesResponseType | null; isFetching: boolean };
  peerInfo: {
    data: {
      announced: string[];
      observed: string[];
    };
    isFetching: boolean;
  };
  settings: { data: GetSettingsResponseType | null; isFetching: boolean };
  statistics: { data: GetStatisticsResponseType | null; isFetching: boolean };
  tickets: { data: GetTicketsResponseType | null; isFetching: boolean };
  tokens: { data: GetTokenResponseType[]; isFetching: boolean };
  version: { data: string | null; isFetching: boolean };
  transactions: { data: string[]; isFetching: boolean };
  pings: (PingNodeResponseType & { peerId: string })[];
  metrics: {
    data: {
      raw: string | null;
      parsed: {
        [key: string]: {
          categories: string[];
          data: any[];
          length: number;
          name: string;
          type: string;
        };
      };
    };
    isFetching: boolean;
  };
  messagesWebsocketStatus: WebsocketConnectionStatus;
  logsWebsocketStatus: WebsocketConnectionStatus;
};

export const initialState: InitialState = {
  info: {
    data: null,
    isFetching: false,
  },
  status: {
    initiating: false,
    initiated: false,
  },
  addresses: {
    data: {
      hopr: null,
      native: null,
    },
    isFetching: false,
  },
  aliases: {
    data: null,
    isFetching: false,
  },
  balances: {
    data: {
      hopr: {
        value: null,
        formatted: null,
      },
      native: {
        value: null,
        formatted: null,
      },
    },
    isFetching: false,
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
    data: {
      connected: [],
      announced: [],
    },
    isFetching: false,
  },
  peerInfo: {
    data: {
      announced: [],
      observed: [],
    },
    isFetching: false,
  },
  entryNodes: {
    data: null,
    isFetching: false,
  },
  settings: {
    data: null,
    isFetching: false,
  },
  statistics: {
    data: null,
    isFetching: false,
  },
  tickets: {
    data: [],
    isFetching: false,
  },
  tokens: {
    data: [],
    isFetching: false,
  },
  version: {
    data: null,
    isFetching: false,
  },
  transactions: {
    data: [],
    isFetching: false,
  },
  pings: [],
  metrics: {
    data: {
      raw: null,
      parsed: {},
    },
    isFetching: false,
  },
  messagesWebsocketStatus: null,
  logsWebsocketStatus: null,
};
