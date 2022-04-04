export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "poolName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "at",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "basicToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "proposalContract",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "descriptionURL",
        type: "string",
      },
    ],
    name: "Deployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "__TraderPoolFactory_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        components: [
          {
            internalType: "string",
            name: "descriptionURL",
            type: "string",
          },
          {
            internalType: "address",
            name: "trader",
            type: "address",
          },
          {
            internalType: "bool",
            name: "privatePool",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "totalLPEmission",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "baseToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "minimalInvestment",
            type: "uint256",
          },
          {
            internalType: "enum ICoreProperties.CommissionPeriod",
            name: "commissionPeriod",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "commissionPercentage",
            type: "uint256",
          },
        ],
        internalType: "struct ITraderPoolFactory.PoolDeployParameters",
        name: "poolDeployParameters",
        type: "tuple",
      },
    ],
    name: "deployBasicPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        components: [
          {
            internalType: "string",
            name: "descriptionURL",
            type: "string",
          },
          {
            internalType: "address",
            name: "trader",
            type: "address",
          },
          {
            internalType: "bool",
            name: "privatePool",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "totalLPEmission",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "baseToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "minimalInvestment",
            type: "uint256",
          },
          {
            internalType: "enum ICoreProperties.CommissionPeriod",
            name: "commissionPeriod",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "commissionPercentage",
            type: "uint256",
          },
        ],
        internalType: "struct ITraderPoolFactory.PoolDeployParameters",
        name: "poolDeployParameters",
        type: "tuple",
      },
    ],
    name: "deployInvestPool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getInjector",
    outputs: [
      {
        internalType: "address",
        name: "_injector",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IContractsRegistry",
        name: "contractsRegistry",
        type: "address",
      },
    ],
    name: "setDependencies",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_injector",
        type: "address",
      },
    ],
    name: "setInjector",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]