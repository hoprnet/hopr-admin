export const nodeSafeRegistryAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'NodeAddressZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NodeHasSafe',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotSafeOwnerNorNode',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotValidSafe',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotValidSignatureFromNode',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SafeAddressZero',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'safeAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address',
      },
    ],
    name: 'DergisteredNodeSafe',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'safeAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'nodeAddress',
        type: 'address',
      },
    ],
    name: 'RegisteredNodeSafe',
    type: 'event',
  },
  {
    inputs: [],
    name: 'NODE_SAFE_TYPEHASH',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'VERSION',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'nodeAddr',
        type: 'address',
      },
    ],
    name: 'deregisterNodeBySafe',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'domainSeparator',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'safeAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nodeChainKeyAddress',
            type: 'address',
          },
        ],
        internalType: 'struct HoprNodeSafeRegistry.NodeSafe',
        name: 'nodeSafe',
        type: 'tuple',
      },
    ],
    name: 'isNodeSafeRegistered',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'nodeToSafe',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'safeAddr',
        type: 'address',
      },
    ],
    name: 'registerSafeByNode',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'safeAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'nodeChainKeyAddress',
            type: 'address',
          },
        ],
        internalType: 'struct HoprNodeSafeRegistry.NodeSafe',
        name: 'nodeSafe',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'sig',
        type: 'bytes',
      },
    ],
    name: 'registerSafeWithNodeSig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
