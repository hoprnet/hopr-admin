import { getObjectFromLocalStorage } from '../../../utils/functions';

const ADMIN_UI_NODE_LIST = getObjectFromLocalStorage('admin-ui-node-list');

type InitialState = {
  status: {
    connecting: boolean;
    connected: boolean;
  };
  loginData: {
    apiEndpoint: string | null;
    apiToken: string | null;
    peerId: string | null;
  };
  nodes: { apiEndpoint: string | null; apiToken: string | null }[];
};

export const initialState: InitialState = {
  status: {
    connecting: false,
    connected: false,
  },
  loginData: {
    apiEndpoint: null,
    apiToken: null,
    peerId: null,
  },
  nodes: ADMIN_UI_NODE_LIST ? ADMIN_UI_NODE_LIST : [],
};
