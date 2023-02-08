export enum ROUTE_PATHS {
  welcome = "/welcome",
  privacyPolicy = "/privacy-policy",
  serviceTerms = "/service-terms",
  meInvestor = "/me/investor",
  meTrader = "/me/trader",
  notifications = "/notifications",
  topMembers = "/top-members/*",

  poolSwap = "/pool/swap/:poolAddress/:inputToken/:outputToken/*",
  poolInvest = "/pool/invest/:poolAddress",
  poolProfile = "/pool/profile/:poolAddress/*",

  riskyProposalCreate = "/create-risky-proposal/:poolAddress/:tokenAddress/*",
  riskyProposalInvest = "/invest-risky-proposal/:poolAddress/:proposalId",
  riskyProposalSwap = "/swap-risky-proposal/:poolAddress/:proposalId/:direction",

  investment = "investment/*",
  investmentProposalCreate = "/create-invest-proposal/:poolAddress",
  investmentProposalInvest = "/invest-investment-proposal/:poolAddress/:proposalId",
  investmentProposalWithdraw = "/withdraw-investment-proposal/:poolAddress/:proposalId",

  dividendsPay = "/pay-dividends-investment-proposal/:poolAddress/:proposalId/*",

  createFund = "/create-fund",
  createFundBasic = "/create-fund/basic/*",
  createFundInvestment = "/create-fund/investment/*",
  createFundDao = "/create-fund/dao/*",
  createFundSuccess = "/success/:poolAddress",

  fundPositions = "/fund-positions/:poolAddress/*",

  insurance = "insurance",
  insuranceCreate = "insurance/create",

  daoList = "/dao/list/*",
  daoItem = "/dao/:daoAddress",
  daoDelegation = "/dao/:daoAddress/delegation/*",
  daoClaim = "/dao/:daoAddress/claim/*",
  daoWithdraw = "/dao/:daoPoolAddress/withdraw",
  daoDelegatee = "/dao/:daoPoolAddress/delegate/:delegatee",
  daoUnDelegatee = "/dao/:daoPoolAddress/undelegate/:delegatee",

  daoProfile = "/dao/:daoAddress/*",

  daoProposalCreateSelectType = "/dao/:daoAddress/create-proposal",
  daoProposalCreateCustom = "/dao/:daoAddress/create-proposal/custom",
  daoProposalCreateProfile = "/dao/:daoAddress/create-proposal/change-dao-settings",
  daoProposalCreateTokenDistribution = "/dao/:daoAddress/create-proposal/token-distribution",
  daoProposalCreateValidatorSettings = "/dao/:daoAddress/create-proposal/validator-settings",
  daoProposalCreateTokenSale = "/dao/:daoAddress/create-proposal/token-sale",

  daoProposalCreateInternalSelectType = "/dao/:daoAddress/create-proposal/change-voting-settings",
  daoProposalCreateInternalGlobal = "/dao/:daoAddress/create-proposal/change-voting-settings/global-voting",
  daoProposalCreateInternalTokenDistribution = "/dao/:daoAddress/create-proposal/change-voting-settings/token-distribution",
  daoProposalCreateInternalCustom = "/dao/:daoAddress/create-proposal/change-voting-settings/custom/:executorAddress",

  daoProposalCreateInternalValidatorsSelectType = "/dao/:daoAddress/create-validator-proposal",
  daoProposalCreateInternalValidatorsSettings = "/dao/:daoAddress/create-validator-proposal/validator-settings",
  daoProposalCreateInternalValidatorsVotingSettings = "/dao/:daoAddress/create-validator-proposal/voting-settings",

  daoProposalCreateCustomSelectType = "/dao/:daoAddress/create-custom-proposal/:executorAddress",
  daoProposalCreateCustomABI = "/dao/:daoAddress/create-custom-proposal/abi/:executorAddress",
  daoProposalCreateCustomWalletConnect = "/dao/:daoAddress/create-custom-proposal/wallet-connect/:executorAddress",
  daoProposalCreateCustomManual = "/dao/:daoAddress/create-custom-proposal/manual/:executorAddress",

  daoProposalList = "/dao/:daoAddress/proposals/*",
  daoProposalItem = "/dao/:daoAddress/proposal/:proposalId",
  daoProposalVoting = "/dao/:daoPoolAddress/vote/:proposalId",
  daoProposalValidatorsVote = "/dao/:daoPoolAddress/validators-vote/:proposalId",
}
