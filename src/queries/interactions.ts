const TRANSACTION_DATA = `
	id
  type
  user
  timestamp
  interactionsCount
`

const TRANSACTION_DATA_NON_PERMANENT = `
  exchange { id fromToken toToken }
  vest { id pool baseAmount }
  poolCreate { id }
  proposalEdit { id }
  riskyProposalCreate { id }
  riskyProposalExchange { id }
  riskyProposalVest { id }
  investProposalClaimSupply { id }
  investProposalCreate { id }
  investProposalWithdraw { id }
  insuranceStake { id }
  getPerfomanceFee { id }
  onlyPool { id }
`

export const UserTransactionsQuery = `
  query($offset: Int!, $limit: Int!, $address: String!, $transactionTypes: [Int]!) {
    transactions(
      skip: $offset, first: $limit, 
      where: {user: $address, type_contains: $transactionTypes}, 
      orderBy: timestamp, orderDirection: desc
    ) {
      ${TRANSACTION_DATA}
      ${TRANSACTION_DATA_NON_PERMANENT}
    }
  }
`
