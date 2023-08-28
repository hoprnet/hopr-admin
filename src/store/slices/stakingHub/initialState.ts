type InitialState = {
  safes: {
    data: {
      safeAddress: string,
      moduleAddress: string,
    }[];
    isFetching: boolean,
  };
  onboarding: {
    step: number,
    notFinished: boolean,
    nodeAddress: string | null,
    userIsInOnboarding: boolean,
  };
  safeInfo: {
    data: SubgraphOutput
    isFetching: boolean,
  }
};

export type SubgraphOutput = {
  balance: {
    mHoprBalance: string | null,
    wxHoprBalance: string | null,
    xHoprBalance: string | null,
  },
  threshold: string | null,
  owners: [
    {
      owner: {
        id: string | null
      }
    }
  ],
  isCreatedByNodeStakeFactory: boolean | null,
  targetedModules: [
    {
      id: string | null
    }
  ],
  allowance: {
    xHoprAllowance: string | null,
    wxHoprAllowance: string | null,
    mHoprAllowance: string | null,
    grantedToChannelsContract: string | null
  },
  addedModules: [
    {
      module: {
        id: string | null
      }
    }
  ],
  isEligibleOnNetworkRegistry: boolean | null,
  registeredNodesInSafeRegistry: [],
  registeredNodesInNetworkRegistry: [
    {
      node: {
        id: string | null
      }
    }
  ],
  registeredNodesInNetworkRegistryParsed: string[];
}

export const initialState: InitialState = {
  safes: {
    data: [],
    isFetching: false,
  },
  onboarding: {
    step: 0,
    nodeAddress: null,
    notFinished: false,
    userIsInOnboarding: false,
  },
  safeInfo: {
    data: {
      balance: {
        mHoprBalance: null,
        wxHoprBalance: null,
        xHoprBalance: null,
      },
      threshold: null,
      owners: [
        {
          owner: {
            id: null
          }
        }
      ],
      isCreatedByNodeStakeFactory: null,
      targetedModules: [
        {
          id: null
        }
      ],
      allowance: {
        xHoprAllowance: null,
        wxHoprAllowance: null,
        mHoprAllowance: null,
        grantedToChannelsContract: null
      },
      addedModules: [
        {
          module: {
            id: null
          }
        }
      ],
      isEligibleOnNetworkRegistry: null,
      registeredNodesInSafeRegistry: [],
      registeredNodesInNetworkRegistry: [
        {
          node: {
            id: null
          }
        }
      ],
      registeredNodesInNetworkRegistryParsed: [],
    },
    isFetching: false,
  }
};
