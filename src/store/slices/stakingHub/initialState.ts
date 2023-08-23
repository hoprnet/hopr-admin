type InitialState = {
  safes: {
    data: {
      safeAddress: string;
      moduleAddress: string;
    }[];
    isFetching: boolean,
  }
};

export const initialState: InitialState = {
  safes: {
    data: [],
    isFetching: false,
  },
};
