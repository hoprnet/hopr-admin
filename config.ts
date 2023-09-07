export const environment: 'dev' | 'node' | 'web3' = 'dev';

// Smart Contracts
export const HOPR_CHANNELS_SMART_CONTRACT_ADDRESS = '0xfabee463f31e39ec8952bbfb4490c41103bf573e';
export const mHOPR_TOKEN_SMART_CONTRACT_ADDRESS = '0x66225dE86Cac02b32f34992eb3410F59DE416698';
export const xHOPR_TOKEN_SMART_CONTRACT_ADDRESS = '0xD057604A14982FE8D88c5fC25Aac3267eA142a08';
export const wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS = '0xD4fdec44DB9D44B8f2b6d529620f9C0C7066A2c1';
export const wxHOPR_WRAPPER_SMART_CONTRACT_ADDRESS = '0x097707143e01318734535676cfe2e5cF8b656ae8';
export const GNOSIS_CHAIN_HOPR_BOOST_NFT = '0x43d13d7b83607f14335cf2cb75e87da369d056c7';

// App
export const HOPR_TOKEN_USED = 'wxHOPR';
export const HOPR_TOKEN_USED_CONTRACT_ADDRESS = wxHOPR_TOKEN_SMART_CONTRACT_ADDRESS;

// Safe Contracts
export const SAFE_SERVICE_URL = 'https://safe-transaction.prod.hoprtech.net';
export const HOPR_NODE_STAKE_FACTORY = '0x098B275485c406573D042848D66eb9d63fca311C';
export const HOPR_NODE_MANAGEMENT_MODULE = '0xB7397C218766eBe6A1A634df523A1a7e412e67eA';
export const HOPR_NODE_SAFE_REGISTRY = '0xe15C24a0910311c83aC78B5930d771089E93077b';
export const HOPR_NETWORK_REGISTRY = '0x582b4b586168621dAf83bEb2AeADb5fb20F8d50d';

//Subgraphs
export const STAKE_SUBGRAPH = 'https://stake.hoprnet.org/api/hub/subgraph-allSeasons';
export const STAKING_V2_SUBGRAPH = 'https://stake.hoprnet.org/api/hub/subgraph-dufour';

// Wallet Connect
export const VITE_WALLET_CONNECT_PROJECT_ID = 'efdce6b5c6b10913211ff1b40bc4d54d';

// Minimum to be funded
export const MINIMUM_WXHOPR_TO_FUND = 30_000;
export const MINIMUM_WXHOPR_TO_FUND_NFT = 10_000;
export const MINIMUM_XDAI_TO_FUND = 2;
export const MINIMUM_XDAI_TO_FUND_NODE = 1;
export const DEFAULT_ALLOWANCE = 1000;
