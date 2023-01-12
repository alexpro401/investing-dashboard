import { IInvestorClaims } from "interfaces/thegraphs/investors"
import { useQuery } from "urql"
import {
  IInvestProposal,
  IInvestProposalWithdraw,
  IInvestProposalSupply,
} from "interfaces/thegraphs/invest-pools"
import {
  InvestProposalQuery,
  InvestorClaimsQuery,
  InvestProposalWithdrawalsQuery,
  InvestProposalSuppliesQuery,
} from "queries"
import { graphClientInvestors, graphClientInvestPools } from "utils/graphClient"

export function useInvestProposalData(
  proposalId?: string
): IInvestProposal | undefined {
  const [response] = useQuery<{
    proposal: IInvestProposal
  }>({
    query: InvestProposalQuery,
    variables: { proposalId },
    context: graphClientInvestPools,
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
}: Props): IInvestorClaims[] | undefined {
  const id = `${proposalAddress.toLocaleLowerCase()}${account?.toLocaleLowerCase()}1_${proposalId}`

  const [response] = useQuery<{
    proposalClaims: IInvestorClaims[]
  }>({
    query: InvestorClaimsQuery,
    variables: { id },
    context: graphClientInvestors,
  })

  return response.data?.proposalClaims
}

export function useInvestProposalWithdraws(proposalAddress, proposalId) {
  const id = `${proposalAddress.toLocaleLowerCase()}${
    parseFloat(proposalId) + 1
  }`

  const [response] = useQuery<{
    proposal: {
      withdraws: IInvestProposalWithdraw[]
    }
  }>({
    query: InvestProposalWithdrawalsQuery,
    variables: { id },
    context: graphClientInvestPools,
  })

  return response.data?.proposal?.withdraws
}

export function useInvestProposalSupplies(
  proposalAddress,
  proposalId
): [IInvestProposalSupply[] | undefined, string | undefined] {
  const id = `${proposalAddress.toLocaleLowerCase()}${
    parseFloat(proposalId) + 1
  }`

  const [response] = useQuery<{
    proposal: {
      APR: string
      supplies: IInvestProposalSupply[]
    }
  }>({
    query: InvestProposalSuppliesQuery,
    variables: { id },
    context: graphClientInvestPools,
  })

  return [response.data?.proposal?.supplies, response.data?.proposal?.APR]
}

export default useInvestProposalData
