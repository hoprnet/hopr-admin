import type {
  GetTicketStatisticsResponseType,
  GetAliasesResponseType,
  GetChannelsResponseType,
  GetInfoResponseType,
  GetPeersResponseType,
  GetTicketsResponseType,
  GetTokenResponseType,
  GetEntryNodesResponseType,
  PingPeerResponseType,
} from '@hoprnet/hopr-sdk';

export type Message = {
  id: string;
  timestamp?: number;
  receivedAt?: number;
  body: string;
  notified?: boolean;
  seen?: boolean;
  status?: 'sending' | 'sent' | 'error';
  error?: string;
  challenge?: string;
  receiver?: string;
  tag?: number;
};

export type ChannelOutgoingType = {
  status?: "Open" | "PendingToClose" | "Closed";
  balance?: string;
  peerAddress?: string;
  isClosing?: boolean;
}

export type ChannelIncomingType = {
  status?: "Open" | "PendingToClose" | "Closed";
  balance?: string;
  peerAddress?: string;
  tickets: number;
  ticketBalance: string;
  isClosing?: boolean;
}

export type ChannelsOutgoingType = {
  [channelId: string]: ChannelOutgoingType
}


export type ChannelsIncomingType = {
  [channelId: string]: ChannelIncomingType
}

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
      safeHopr: {
        value: string | null;
        formatted: string | null;
      },
      safeNative: {
        value: string | null;
        formatted: string | null;
      },
      safeHoprAllowance: {
        value: string | null;
        formatted: string | null;
      },
      channels: {
        value: string | null;
        formatted: string | null;
      },
    };
    isFetching: boolean;
  };
  channels: {
    data: GetChannelsResponseType | null;
    parsed: {
      outgoing:  ChannelsOutgoingType;
      incoming: ChannelsIncomingType;
    },
    isFetching: boolean;
  };
  links: {
    nodeAddressToOutgoingChannel: {
      [nodeAddress: string]: string
    },
    nodeAddressToIncomingChannel: {
      [nodeAddress: string]: string
    },
    nodeAddressToPeerId: {
      [nodeAddress: string]: string
    },
    peerIdToNodeAddress: {
      [peerId: string]: string
    },
    peerIdToAlias: {
      [peerId: string]: string
    },
  };
  messages: {
    data: Message[],
    isFetching: boolean;
    isDeleting: boolean;
  };
  messagesSent: Message[];
  signedMessages: { timestamp: number; body: string }[];
  peers: {
    data: GetPeersResponseType | null;
    // parsed: {
    //   [peerAddress: string]: {
    //     peerId: string;
    //     quality: number;
    //     multiaddr: string | null;
    //     heartbeats: {
    //       sent: number;
    //       success: number;
    //     };
    //     lastSeen: number;
    //     lastSeenLatency: number;
    //     backoff: number;
    //     isNew: boolean;
    //     reportedVersion: string;
    //   }
    // }
    isFetching: boolean
  };
  entryNodes: { data: GetEntryNodesResponseType | null; isFetching: boolean };
  peerInfo: {
    data: {
      announced: string[];
      observed: string[];
    };
    isFetching: boolean;
  };
  statistics: { data: GetTicketStatisticsResponseType | null; isFetching: boolean };
  tickets: {
    data: GetTicketsResponseType | null;
    isFetching: boolean
  };
  tokens: { data: GetTokenResponseType[]; isFetching: boolean };
  version: { data: string | null; isFetching: boolean };
  transactions: { data: string[]; isFetching: boolean };
  pings: (PingPeerResponseType & { peerId: string })[];
  metrics: {
    data: {
      raw: string | null;
      parsed: {
        [key: string]: {
          categories: string[];
          data: unknown[];
          length: number;
          name: string;
          type: string;
        };
      };
    };
    isFetching: boolean;
  };
  messagesWebsocketStatus: WebsocketConnectionStatus;
  closeChannel: { isFetching: boolean };
  redeemTickets: {
    isFetching: boolean;
    error: string | undefined;
  };
  apiEndpoint: string | null
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
      safeHopr: {
        value: null,
        formatted: null,
      },
      safeNative: {
        value: null,
        formatted: null,
      },
      safeHoprAllowance: {
        value: null,
        formatted: null,
      },
      channels: {
        value: null,
        formatted: null,
      },
    },
    isFetching: false,
  },
  channels: {
    data: null,
    parsed: {
      outgoing: {},
      incoming: {}
    },
    isFetching: false,
  },
  messages: {
    data: [],
    isFetching: false,
    isDeleting: false,
  },
  messagesSent: [],
  signedMessages: [],
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
  closeChannel: { isFetching: false },
  redeemTickets: {
    isFetching: false,
    error: undefined,
  },
  links: {
    nodeAddressToOutgoingChannel: {},
    nodeAddressToIncomingChannel: {},
    nodeAddressToPeerId: {},
    peerIdToNodeAddress: {},
    peerIdToAlias: {},
  },
  apiEndpoint: null,
};
