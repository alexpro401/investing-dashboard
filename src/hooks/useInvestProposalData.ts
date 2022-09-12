import { IInvestorClaims } from "./../interfaces/thegraphs/investors"
import { useQuery } from "urql"
import { IInvestProposal } from "interfaces/thegraphs/invest-pools"
import { InvestProposalQuery } from "queries"
import { InvestorClaims } from "queries/investors"

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

interface Props {
  proposalId: string
  account?: string | null
  proposalAddress: string
}

export function useInvestProposalClaims({
  proposalAddress,
  account,
  proposalId,
}: Props) {
  const id = `${proposalAddress.toLocaleLowerCase()}${account?.toLocaleLowerCase()}1_${proposalId}`

  const [response] = useQuery<{
    proposalClaims: IInvestorClaims[]
  }>({
    query: InvestorClaims,
    variables: { id },
  })

  return response.data?.proposalClaims
}

export default useInvestProposalData
