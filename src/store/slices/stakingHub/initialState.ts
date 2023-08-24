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
  };
};

export const initialState: InitialState = {
  safes: {
    data: [],
    isFetching: false,
  },
  onboarding: { 
    step: 1,
    notFinished: false,
  },
};
