export default [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "fromToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "toToken",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "fromVolume",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "toVolume",
        type: "uint256",
      },
    ],
    name: "ActivePortfolioExchanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "traderLpClaimed",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "traderBaseClaimed",
        type: "uint256",
      },
    ],
    name: "CommissionClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "descriptionURL",
        type: "string",
      },
    ],
    name: "DescriptionURLChanged",
    type: "event",
  },
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
        internalType: "uint256",
        name: "divestedLP",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "receivedBase",
        type: "uint256",
      },
    ],
    name: "Divested",
    type: "event",
  },
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
        internalType: "uint256",
        name: "investedBase",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "receivedLP",
        type: "uint256",
      },
    ],
    name: "Invested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "InvestorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "investor",
        type: "address",
      },
    ],
    name: "InvestorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "admins",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "add",
        type: "bool",
      },
    ],
    name: "ModifiedAdmins",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "privateInvestors",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "add",
        type: "bool",
      },
    ],
    name: "ModifiedPrivateInvestors",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "divestedLP2",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "receivedLP",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "receivedBase",
        type: "uint256",
      },
    ],
    name: "ProposalDivested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
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
        name: "_poolParameters",
        type: "tuple",
      },
      {
        internalType: "address",
        name: "traderPoolProposal",
        type: "address",
      },
    ],
    name: "__InvestTraderPool_init",
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
        name: "poolParameters",
        type: "tuple",
      },
    ],
    name: "__TraderPool_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        name: "investor",
        type: "address",
      },
    ],
    name: "canRemovePrivateInvestor",
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
        name: "descriptionURL",
        type: "string",
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
        internalType: "uint256",
        name: "minimalInvestment",
        type: "uint256",
      },
    ],
    name: "changePoolParameters",
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
    ],
    name: "checkNewInvestor",
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
    ],
    name: "checkRemoveInvestor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "coreProperties",
    outputs: [
      {
        internalType: "contract ICoreProperties",
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
        name: "descriptionURL",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "lpAmount",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "timestampLimit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "investLPLimit",
            type: "uint256",
          },
        ],
        internalType: "struct ITraderPoolInvestProposal.ProposalLimits",
        name: "proposalLimits",
        type: "tuple",
      },
      {
        internalType: "uint256[]",
        name: "minPositionsOut",
        type: "uint256[]",
      },
    ],
    name: "createProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountLP",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "minPositionsOut",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "minDexeCommissionOut",
        type: "uint256",
      },
    ],
    name: "divest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amountBound",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "optionalPath",
        type: "address[]",
      },
      {
        internalType: "enum ITraderPool.ExchangeType",
        name: "exType",
        type: "uint8",
      },
    ],
    name: "exchange",
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
        internalType: "uint256",
        name: "amountLP",
        type: "uint256",
      },
    ],
    name: "getDivestAmountsAndCommissions",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "baseAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lpAmount",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "positions",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "givenAmounts",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "receivedAmounts",
            type: "uint256[]",
          },
        ],
        internalType: "struct ITraderPool.Receptions",
        name: "receptions",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "traderBaseCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "traderLPCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "traderUSDCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dexeBaseCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dexeLPCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dexeUSDCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dexeDexeCommission",
            type: "uint256",
          },
        ],
        internalType: "struct ITraderPool.Commissions",
        name: "commissions",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "optionalPath",
        type: "address[]",
      },
      {
        internalType: "enum ITraderPool.ExchangeType",
        name: "exType",
        type: "uint8",
      },
    ],
    name: "getExchangeAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
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
    inputs: [],
    name: "getInvestDelayEnd",
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
        internalType: "uint256",
        name: "amountInBaseToInvest",
        type: "uint256",
      },
    ],
    name: "getInvestTokens",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "baseAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lpAmount",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "positions",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "givenAmounts",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "receivedAmounts",
            type: "uint256[]",
          },
        ],
        internalType: "struct ITraderPool.Receptions",
        name: "receptions",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getLeverageInfo",
    outputs: [
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
        internalType: "struct ITraderPool.LeverageInfo",
        name: "leverageInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getNextCommissionEpoch",
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
    inputs: [],
    name: "getPoolInfo",
    outputs: [
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
        internalType: "struct ITraderPool.PoolInfo",
        name: "poolInfo",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "offsetLimits",
        type: "uint256[]",
      },
    ],
    name: "getReinvestCommissions",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "traderBaseCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "traderLPCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "traderUSDCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dexeBaseCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dexeLPCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dexeUSDCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "dexeDexeCommission",
            type: "uint256",
          },
        ],
        internalType: "struct ITraderPool.Commissions",
        name: "commissions",
        type: "tuple",
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
    name: "getUsersInfo",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "commissionUnlockTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "poolLPBalance",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "investedBase",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "poolUSDShare",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "poolBaseShare",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "owedBaseCommission",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "owedLPCommission",
            type: "uint256",
          },
        ],
        internalType: "struct ITraderPool.UserInfo[]",
        name: "usersInfo",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountInBaseToInvest",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "minPositionsOut",
        type: "uint256[]",
      },
    ],
    name: "invest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lpAmount",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "minPositionsOut",
        type: "uint256[]",
      },
    ],
    name: "investProposal",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "investorsInfo",
    outputs: [
      {
        internalType: "uint256",
        name: "investedBase",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "commissionUnlockEpoch",
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
        name: "who",
        type: "address",
      },
    ],
    name: "isPrivateInvestor",
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
        name: "who",
        type: "address",
      },
    ],
    name: "isTrader",
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
        name: "who",
        type: "address",
      },
    ],
    name: "isTraderAdmin",
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
        internalType: "address[]",
        name: "admins",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "add",
        type: "bool",
      },
    ],
    name: "modifyAdmins",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "privateInvestors",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "add",
        type: "bool",
      },
    ],
    name: "modifyPrivateInvestors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
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
    name: "openPositions",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "priceFeed",
    outputs: [
      {
        internalType: "contract IPriceFeed",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalPoolAddress",
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
        internalType: "uint256[]",
        name: "offsetLimits",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "minDexeCommissionOut",
        type: "uint256",
      },
    ],
    name: "reinvestCommission",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "minPositionsOut",
        type: "uint256[]",
      },
    ],
    name: "reinvestProposal",
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
    inputs: [],
    name: "symbol",
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
    name: "totalEmission",
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
    inputs: [],
    name: "totalInvestors",
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
    inputs: [],
    name: "totalSupply",
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
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
]
