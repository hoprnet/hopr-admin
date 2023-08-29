type InitialState = {
  safes: {
    data: {
      safeAddress: string;
      moduleAddress: string;
    }[];
    isFetching: boolean;
  };
  onboarding: {
    step: number;
    notFinished: boolean;
    nodeAddress: string | null;
    safeAddress: string | null;
    moduleAddress: string | null;
    userIsInOnboarding: boolean;
    nodeXDaiBalance: string | null;
    isFetching: boolean;
  };
  safeInfo: {
    data: SubgraphParsedOutput;
    isFetching: boolean;
  };
};

export type SubgraphParsedOutput = {
  balance: {
    mHoprBalance: string | null;
    wxHoprBalance: string | null;
    xHoprBalance: string | null;
  };
  threshold: string | null;
  owners: [
    {
      owner: {
        id: string | null;
      };
    }
  ];
  isCreatedByNodeStakeFactory: boolean | null;
  targetedModules: [
    {
      id: string | null;
    }
  ];
  allowance: {
    xHoprAllowance: string | null;
    wxHoprAllowance: string | null;
    mHoprAllowance: string | null;
    grantedToChannelsContract: string | null;
  };
  addedModules: [
    {
      module: {
        id: string | null;
      };
    }
  ];
  isEligibleOnNetworkRegistry: boolean | null;
  registeredNodesInSafeRegistry: [];
  registeredNodesInNetworkRegistry: [
    {
      node: {
        id: string | null;
      };
    }
  ];
  registeredNodesInNetworkRegistryParsed: string[];
  module: {
    id: string | null;
    implementation: string | null;
    includedNodes:
      | [
          {
            node: {
              id: string | null;
            };
          }
        ]
      | [];
    multiSend: string | null;
    target: {
      id: string | null;
    };
  };
  overall_staking_v2_balances: {
    mHoprBalance: string | null;
    wxHoprBalance: string | null;
    xHoprBalance: string | null;
  };
};

export const initialState: InitialState = {
  safes: {
    data: [],
    isFetching: false,
  },
  onboarding: {
    step: 0,
    nodeAddress: null,
    safeAddress: null,
    moduleAddress: null,
    notFinished: false,
    userIsInOnboarding: false,
    nodeXDaiBalance: null,
    isFetching: false,
  },
  safeInfo: {
    data: {
      balance: {
        mHoprBalance: null,
        wxHoprBalance: null,
        xHoprBalance: null,
      },
      threshold: null,
      owners: [{ owner: { id: null } }],
      isCreatedByNodeStakeFactory: null,
      targetedModules: [{ id: null }],
      allowance: {
        xHoprAllowance: null,
        wxHoprAllowance: null,
        mHoprAllowance: null,
        grantedToChannelsContract: null,
      },
      addedModules: [{ module: { id: null } }],
      isEligibleOnNetworkRegistry: null,
      registeredNodesInSafeRegistry: [],
      registeredNodesInNetworkRegistry: [{ node: { id: null } }],
      registeredNodesInNetworkRegistryParsed: [],
      module: {
        id: null,
        implementation: null,
        includedNodes: [
          { node: { id: null } },
        ],
        multiSend: null,
        target: { id: null },
      },
      overall_staking_v2_balances: {
        mHoprBalance: null,
        wxHoprBalance: null,
        xHoprBalance: null,
      },
    },
    isFetching: false,
  },
};
