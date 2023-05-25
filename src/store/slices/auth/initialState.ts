import { getObjectFromLocalStorage } from '../../../utils/functions'

const ADMIN_UI_NODE_LIST = getObjectFromLocalStorage("admin-ui-node-list");

export const initialState = {
    status: {
        connecting: false as boolean,
        connected: false as boolean,
    },
    loginData: {
        ip: null as string | null,
        apiKey: null as string | null,
        peerId: null as string | null,
    },
    nodes: ADMIN_UI_NODE_LIST ? ADMIN_UI_NODE_LIST : [] as {}[],
};