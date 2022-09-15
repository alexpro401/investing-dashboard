import { IInvestorClaims } from "./../interfaces/thegraphs/investors"
import { useQuery } from "urql"
import {
  IInvestProposal,
  IInvestProposalWithdraw,
  IInvestProposalSupply,
} from "interfaces/thegraphs/invest-pools"
import { InvestProposalQuery } from "queries"
import { InvestorClaims } from "queries/investors"
import {
  InvestProposalWithdrawals,
  InvestProposalSupplies,
} from "queries/invest-pools"

export function useInvestProposalData(
  proposalId?: string
): IInvestProposal | undefined {
  const [response] = useQuery<{
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
}: Props): IInvestorClaims[] | undefined {
  const id = `${proposalAddress.toLocaleLowerCase()}${account?.toLocaleLowerCase()}1_${proposalId}`

  const [response] = useQuery<{
    proposalClaims: IInvestorClaims[]
  }>({
    query: InvestorClaims,
    variables: { id },
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
    query: InvestProposalWithdrawals,
    variables: { id },
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
    query: InvestProposalSupplies,
    variables: { id },
  })

  return [response.data?.proposal?.supplies, response.data?.proposal?.APR]
}

export default useInvestProposalData
