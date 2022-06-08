export default [
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
    name: "BASIC_POOL_NAME",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INVEST_POOL_NAME",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "INVEST_PROPOSAL_NAME",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RISKY_PROPOSAL_NAME",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "__PoolContractsRegistry_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "poolAddress",
        type: "address",
      },
    ],
    name: "addPool",
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
    ],
    name: "countPools",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "countTraderPools",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "getImplementation",
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
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "getProxyBeacon",
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
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "injectDependenciesToExistingPools",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "potentialPool",
        type: "address",
      },
    ],
    name: "isBasicPool",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "potentialPool",
        type: "address",
      },
    ],
    name: "isInvestPool",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "potentialPool",
        type: "address",
      },
    ],
    name: "isPool",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
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
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "listPools",
    outputs: [
      {
        internalType: "address[]",
        name: "pools",
        type: "address[]",
      },
    ],
    stateMutability: "view",
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
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "listPoolsWithInfo",
    outputs: [
      {
        internalType: "address[]",
        name: "pools",
        type: "address[]",
      },
      {
        components: [
          {
            internalType: "string",
            name: "ticker",
            type: "string",
          },
          {
            internalType: "string",
            name: "name",
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
                name: "baseTokenDecimals",
                type: "uint256",
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
            internalType: "struct ITraderPool.PoolParameters",
            name: "parameters",
            type: "tuple",
          },
          {
            internalType: "address[]",
            name: "openPositions",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "baseAndPositionBalances",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "totalBlacklistedPositions",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalInvestors",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPoolUSD",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "totalPoolBase",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lpSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lpLockedInProposals",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "traderUSD",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "traderBase",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "traderLPBalance",
            type: "uint256",
          },
        ],
        internalType: "struct ITraderPool.PoolInfo[]",
        name: "poolInfos",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "totalPoolUSDWithProposals",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "traderLeverageUSDTokens",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "freeLeverageUSD",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "freeLeverageBase",
            type: "uint256",
          },
        ],
        internalType: "struct ITraderPool.LeverageInfo[]",
        name: "leverageInfos",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "listTraderPools",
    outputs: [
      {
        internalType: "address[]",
        name: "pools",
        type: "address[]",
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
        internalType: "address",
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
        internalType: "string[]",
        name: "names",
        type: "string[]",
      },
      {
        internalType: "address[]",
        name: "newImplementations",
        type: "address[]",
      },
    ],
    name: "setNewImplementations",
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
