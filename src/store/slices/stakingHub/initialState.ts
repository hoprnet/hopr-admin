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
    userIsInOnboarding: boolean;
  };
};

export const initialState: InitialState = {
  safes: {
    data: [],
    isFetching: false,
  },
  onboarding: {
    step: 0,
    notFinished: false,
    userIsInOnboarding: false,
  },
};
