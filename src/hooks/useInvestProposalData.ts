import { useQuery } from "urql"
import { IInvestProposal } from "interfaces/thegraphs/invest-pools"
import { InvestProposalQuery } from "queries"

export function useInvestProposalData(
  proposalId?: string
): IInvestProposal | undefined {
  const [response, executeQuery] = useQuery<{
    proposal: IInvestProposal
  }>({
    query: InvestProposalQuery,
    variables: { proposalId },
  })

  return response.data?.proposal
}

export default useInvestProposalData
