import { useQuery } from "urql"
import { IRiskyPositionExchange } from "constants/interfaces_v2"
import { RiskyProposalExchangesQuery } from "queries"

interface Exchanges {
  exchanges: IRiskyPositionExchange[]
}

function useRiskyPositionExchanges(address?: string): IRiskyPositionExchange[] {
  const [response, executeQuery] = useQuery<{
    proposalExchangeHistories: Exchanges[]
  }>({
    query: RiskyProposalExchangesQuery,
    variables: { address },
  })

  if (!response.data || !response.data?.proposalExchangeHistories) {
    return []
  }

  const res = response.data.proposalExchangeHistories.reduce(
    (acc, exchanges) => {
      if (exchanges.exchanges && exchanges.exchanges.length > 0) {
        return [...acc, ...exchanges.exchanges]
      }
      return acc
    },
    [] as IRiskyPositionExchange[]
  )

  return res
}

export default useRiskyPositionExchanges
