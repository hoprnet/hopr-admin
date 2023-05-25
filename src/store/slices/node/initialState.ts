export const initialState = {
    status: {
        initiating: false as boolean,
        initiated: false as boolean,
    },
    peerId: null as string | null,
    ethAddress: null as string | null,
    balances: {
        mHOPR: null as string | null,
        xDai: null as string | null,
    },
    aliases: {},
    channels: {
        incoming: [],
        outgoing: [],
    },
    messages: [],
    peers: {
        connected: [],
        announced: [],
    },
    peerInfo: {
        announced: [],
        observed: []
    },
    info: {
        environment:  null as string | null,
        announcedAddress: [] as string[],
        listeningAddress: [] as string[],
        network: null as string | null,
        hoprToken: null as string | null,
        hoprChannels: null as string | null,
        hoprNetworkRegistryAddress: null as string | null,
        connectivityStatus: null as string | null,
        isEligible: null as boolean | null,
        channelClosurePeriod: null as number | null,
        version: null as string | null,
    },
    settings: {
        includeRecipient: null as boolean | null,
        strategy: null as string | null,
    },
    ticketsStatistics: {
        pending: null as number | null,
        unredeemed: null as number | null,
        unredeemedValue: null as string | null,
        redeemed: null as number | null,
        redeemedValue: null as string | null,
        losingTickets: null as number | null,
        winProportion: null as number | null,
        neglected: null as number | null,
        rejected: null as number | null,
        rejectedValue: null as string | null,
    },
    tickets: [],
    token: {
        id: null as string | null,
        description: null as string | null,
        capabilities: []
    }
};
