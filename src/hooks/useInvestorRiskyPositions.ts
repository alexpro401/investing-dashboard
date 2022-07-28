import { useQuery } from "urql"
import {
  IInvestorRiskyPositions,
  IRiskyPositionCard,
} from "constants/interfaces_v2"
import { InvestorRiskyPositionsQuery } from "queries"

function useInvestorRiskyPositions(
  poolAddressList?: string[],
  closed?: boolean
) {
  const [response, executeQuery] = useQuery<{
    proposals: IInvestorRiskyPositions[]
  }>({
    query: InvestorRiskyPositionsQuery,
    variables: { poolAddressList, closed },
  })

  if (response.fetching) {
    return null
  }

  if (!response.data || !response.data.proposals) {
    return []
  }

  return response.data?.proposals.reduce((acc, p) => {
    if (p.positions.length) {
      const positionBase = {
        proposal: p.id,
        token: p.token,
        pool: p.basicPool,
      }

      const positions = p.positions.map((_p) => ({ ...positionBase, ..._p }))

      return [...acc, ...positions]
    }
    return acc
  }, [] as IRiskyPositionCard[])
}

export default useInvestorRiskyPositions
