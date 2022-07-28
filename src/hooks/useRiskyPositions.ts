import { useQuery } from "urql"
import {
  IRiskyProposalQuery,
  IRiskyPositionCard,
} from "constants/interfaces_v2"
import { RiskyProposalsQuery } from "queries"

function useRiskyPositions(address?: string, closed?: boolean) {
  const [response, executeQuery] = useQuery<{
    basicPool: IRiskyProposalQuery
  }>({
    query: RiskyProposalsQuery,
    variables: { address, closed },
  })

  if (response.fetching) {
    return null
  }

  if (!response.data || !response.data.basicPool.proposals) {
    return []
  }

  return response.data.basicPool.proposals.reduce<IRiskyPositionCard[]>(
    (acc, p) => {
      if (p.positions && p.positions.length) {
        const positions = p?.positions.map((_p) => ({
          ..._p,
          token: p.token,
          pool: p.basicPool,
        }))
        return [...acc, ...positions]
      }
      return acc
    },
    []
  )
}

export default useRiskyPositions
