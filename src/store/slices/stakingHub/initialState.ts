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
  }
};

export const initialState: InitialState = { 
  safes: {
    data: [],
    isFetching: false,
  },
  onboarding: {
    step: 0,
  }
};
