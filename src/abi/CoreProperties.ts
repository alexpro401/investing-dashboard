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
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maxPoolInvestors",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxOpenPositions",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "leverageThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "leverageSlope",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "commissionInitTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "commissionDurations",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "dexeCommissionPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "dexeCommissionDistributionPercentages",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "minTraderCommission",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "maxTraderCommissions",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "delayForRiskyPool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "insuranceFactor",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxInsurancePoolShare",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minInsuranceDeposit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minInsuranceProposalAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "insuranceWithdrawalLock",
            type: "uint256",
          },
        ],
        internalType: "struct ICoreProperties.CoreParameters",
        name: "_coreParameters",
        type: "tuple",
      },
    ],
    name: "__CoreProperties_init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "addBlacklistTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "addWhitelistTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "coreParameters",
    outputs: [
      {
        internalType: "uint256",
        name: "maxPoolInvestors",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxOpenPositions",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leverageThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leverageSlope",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "commissionInitTimestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "dexeCommissionPercentage",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minTraderCommission",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "delayForRiskyPool",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "insuranceFactor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxInsurancePoolShare",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minInsuranceDeposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minInsuranceProposalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "insuranceWithdrawalLock",
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
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getBlacklistTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum ICoreProperties.CommissionPeriod",
        name: "period",
        type: "uint8",
      },
    ],
    name: "getCommissionDuration",
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
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "enum ICoreProperties.CommissionPeriod",
        name: "commissionPeriod",
        type: "uint8",
      },
    ],
    name: "getCommissionEpochByTimestamp",
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
    name: "getCommissionInitTimestamp",
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
        name: "epoch",
        type: "uint256",
      },
      {
        internalType: "enum ICoreProperties.CommissionPeriod",
        name: "commissionPeriod",
        type: "uint8",
      },
    ],
    name: "getCommissionTimestampByEpoch",
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
    name: "getDEXECommissionPercentages",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
      {
        internalType: "address[3]",
        name: "",
        type: "address[3]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDelayForRiskyPool",
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
        internalType: "address[]",
        name: "positions",
        type: "address[]",
      },
    ],
    name: "getFilteredPositions",
    outputs: [
      {
        internalType: "address[]",
        name: "filteredPositions",
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
    name: "getInsuranceFactor",
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
    name: "getInsuranceWithdrawalLock",
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
    name: "getMaxInsurancePoolShare",
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
    name: "getMaximumOpenPositions",
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
    name: "getMaximumPoolInvestors",
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
    name: "getMinInsuranceDeposit",
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
    name: "getMinInsuranceProposalAmount",
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
    name: "getTraderCommissions",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTraderLeverageParams",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "getWhitelistTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "isBlacklistedToken",
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
        name: "token",
        type: "address",
      },
    ],
    name: "isWhitelistedToken",
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
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "removeBlacklistTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "removeWhitelistTokens",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256[]",
        name: "durations",
        type: "uint256[]",
      },
    ],
    name: "setCommissionDurations",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "setCommissionInitTimestamp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "maxPoolInvestors",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxOpenPositions",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "leverageThreshold",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "leverageSlope",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "commissionInitTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "commissionDurations",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "dexeCommissionPercentage",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "dexeCommissionDistributionPercentages",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "minTraderCommission",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "maxTraderCommissions",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "delayForRiskyPool",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "insuranceFactor",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxInsurancePoolShare",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minInsuranceDeposit",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minInsuranceProposalAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "insuranceWithdrawalLock",
            type: "uint256",
          },
        ],
        internalType: "struct ICoreProperties.CoreParameters",
        name: "_coreParameters",
        type: "tuple",
      },
    ],
    name: "setCoreParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "dexeCommission",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "distributionPercentages",
        type: "uint256[]",
      },
    ],
    name: "setDEXECommissionPercentages",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "delayForRiskyPool",
        type: "uint256",
      },
    ],
    name: "setDelayForRiskyPool",
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
        internalType: "uint256",
        name: "insuranceFactor",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxInsurancePoolShare",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minInsuranceDeposit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minInsuranceProposalAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "insuranceWithdrawalLock",
        type: "uint256",
      },
    ],
    name: "setInsuranceParameters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "setMaximumOpenPositions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "setMaximumPoolInvestors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minTraderCommission",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "maxTraderCommissions",
        type: "uint256[]",
      },
    ],
    name: "setTraderCommissionPercentages",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "threshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "slope",
        type: "uint256",
      },
    ],
    name: "setTraderLeverageParams",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalBlacklistTokens",
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
    name: "totalWhitelistTokens",
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
