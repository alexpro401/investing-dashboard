import { useQuery } from "urql"
import { IInvestorInvestedPools } from "interfaces/thegraphs/invest-pools"
import { InvestorPoolsInvestedForQuery } from "queries"

function useInvestorProposalPools(address?: string, poolType?: string) {
  const [response] = useQuery<{
    investors: IInvestorInvestedPools[]
  }>({
    query: InvestorPoolsInvestedForQuery,
    variables: { address, poolType },
  })

  if (response.data?.investors && response.data?.investors.length === 0) {
    return []
  }

  return response.data?.investors[0].activePools.map((p) => p.id)
}

export default useInvestorProposalPools
