export const nodeManagementModuleAbi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AddressIsZero",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "AlreadyInitialized",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ArrayTooLong",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ArraysDifferentLength",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CalldataOutOfBounds",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "CannotChangeOwner",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DefaultPermissionRejected",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "DelegateCallNotAllowed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "FunctionSignatureTooShort",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "GranularPermissionRejected",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoMembership",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NodePermissionRejected",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NonExistentKey",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ParameterNotAllowed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PermissionNotConfigured",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PermissionNotFound",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SafeMultisendSameAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SendNotAllowed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TargetAddressNotAllowed",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TargetIsNotScoped",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TargetIsScoped",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "TooManyCapabilities",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "UnacceptableMultiSendOffset",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "WithMembership",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "previousAdmin",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdmin",
        "type": "address"
      }
    ],
    "name": "AdminChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "beacon",
        "type": "address"
      }
    ],
    "name": "BeaconUpgraded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "ExecutionFailure",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "ExecutionSuccess",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "version",
        "type": "uint8"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "node",
        "type": "address"
      }
    ],
    "name": "NodeAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "node",
        "type": "address"
      }
    ],
    "name": "NodeRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "multisendAddress",
        "type": "address"
      }
    ],
    "name": "SetMultisendAddress",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "Target",
        "name": "defaultTarget",
        "type": "uint256"
      }
    ],
    "name": "addChannelsAndTokenTarget",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nodeAddress",
        "type": "address"
      }
    ],
    "name": "addNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "encoded",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "decodeFunctionSigsAndPermissions",
    "outputs": [
      {
        "internalType": "bytes4[]",
        "name": "functionSigs",
        "type": "bytes4[]"
      },
      {
        "internalType": "enum GranularPermission[]",
        "name": "permissions",
        "type": "uint8[]"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4[]",
        "name": "functionSigs",
        "type": "bytes4[]"
      },
      {
        "internalType": "enum GranularPermission[]",
        "name": "permissions",
        "type": "uint8[]"
      }
    ],
    "name": "encodeFunctionSigsAndPermissions",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "encoded",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "execTransactionFromModule",
    "outputs": [
      {
        "internalType": "bool",
        "name": "success",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "enum Enum.Operation",
        "name": "operation",
        "type": "uint8"
      }
    ],
    "name": "execTransactionFromModuleReturnData",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "capabilityKey",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "pairId",
        "type": "bytes32"
      }
    ],
    "name": "getGranularPermissions",
    "outputs": [
      {
        "internalType": "enum GranularPermission",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTargets",
    "outputs": [
      {
        "internalType": "Target[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "Target",
        "name": "nodeDefaultTarget",
        "type": "uint256"
      }
    ],
    "name": "includeNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "initParams",
        "type": "bytes"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "isHoprNodeManagementModule",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nodeAddress",
        "type": "address"
      }
    ],
    "name": "isNode",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "multisend",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxiableUUID",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nodeAddress",
        "type": "address"
      }
    ],
    "name": "removeNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "targetAddress",
        "type": "address"
      }
    ],
    "name": "revokeTarget",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "targetAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "channelId",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "encodedSigsPermissions",
        "type": "bytes32"
      }
    ],
    "name": "scopeChannelsCapabilities",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nodeAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "internalType": "enum GranularPermission",
        "name": "permission",
        "type": "uint8"
      }
    ],
    "name": "scopeSendCapability",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "Target",
        "name": "defaultTarget",
        "type": "uint256"
      }
    ],
    "name": "scopeTargetChannels",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "Target",
        "name": "defaultTarget",
        "type": "uint256"
      }
    ],
    "name": "scopeTargetSend",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "Target",
        "name": "defaultTarget",
        "type": "uint256"
      }
    ],
    "name": "scopeTargetToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nodeAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "targetAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "encodedSigsPermissions",
        "type": "bytes32"
      }
    ],
    "name": "scopeTokenCapabilities",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_multisend",
        "type": "address"
      }
    ],
    "name": "setMultisend",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "targetAddress",
        "type": "address"
      }
    ],
    "name": "tryGetTarget",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      },
      {
        "internalType": "Target",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "upgradeToAndCall",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]