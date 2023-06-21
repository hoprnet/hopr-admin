type InitialState = {
  notifications: {
    id: string;
    name: string;
    source: string;
    seen: boolean;
    timeout: number;
    url: string | null;
  }[];
};

export const initialState: InitialState = { notifications: [] };
