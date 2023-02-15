import * as React from "react"
import { useWeb3React } from "@web3-react/core"
import {
  useGetPoolsUserInvestedIn,
  useInvestProposalsContractAddressesList,
  useInvestorInvestProposalsListQuery,
  useInvestorInvestProposalsListData,
} from "hooks"

import { isEmpty } from "lodash"
import { InvestProposalUtilityIds, WrappedInvestProposalView } from "types"

const useInvestorInvestProposalsList = (
  invested: boolean
): [WrappedInvestProposalView[], boolean, () => void] => {
  const { account } = useWeb3React()

  const [poolsUserInvestedIn, poolsUserInvestedInLoading] =
    useGetPoolsUserInvestedIn(account, "INVEST_POOL")

  const [
    { data: proposalsQuery, loading: loadingProposalsListQuery },
    fetchMore,
    resetProposals,
  ] = useInvestorInvestProposalsListQuery(
    poolsUserInvestedIn,
    invested,
    poolsUserInvestedInLoading
  )

  const _poolsWithProposals = React.useMemo(
    () => [...new Set(proposalsQuery?.map((p) => p.investPool.id))],
    [proposalsQuery]
  )

  const [proposalContractAddressList, proposalContractAddressListAnyLoading] =
    useInvestProposalsContractAddressesList(_poolsWithProposals)

  const utilityIds = React.useMemo<InvestProposalUtilityIds[]>(() => {
    if (isEmpty(proposalsQuery) || isEmpty(proposalContractAddressList)) {
      return []
    }

    return proposalsQuery.map((p) => {
      const proposalEntityId = String(p.id).toLowerCase()

      const _proposalContractAddress = proposalContractAddressList.find((id) =>
        proposalEntityId.includes(id)
      )

      return {
        proposalId: Number(p.proposalId) - 1,
        proposalEntityId: proposalEntityId,
        investPoolAddress: p.investPool.id,
        proposalContractAddress: _proposalContractAddress,
        investPoolBaseTokenAddress: p.investPool.baseToken,
      } as InvestProposalUtilityIds
    })
  }, [proposalsQuery, proposalContractAddressList])

  const [proposalsData, proposalsDataLoading] =
    useInvestorInvestProposalsListData(utilityIds)

  const anyLoading = React.useMemo(
    () =>
      loadingProposalsListQuery ||
      proposalContractAddressListAnyLoading ||
      proposalsDataLoading,
    [
      loadingProposalsListQuery,
      proposalContractAddressListAnyLoading,
      proposalsDataLoading,
    ]
  )

  const [investProposalsList, setInvestProposalsList] = React.useState<
    WrappedInvestProposalView[]
  >([])

  React.useEffect(() => {
    if (
      anyLoading ||
      isEmpty(proposalsQuery) ||
      isEmpty(utilityIds) ||
      isEmpty(proposalsData)
    ) {
      return
    }

    const _proposalsList: WrappedInvestProposalView[] = proposalsQuery.map(
      (proposal, index) => {
        const _utilityIds = utilityIds[index]
        const _proposalData = proposalsData[index]

        return {
          id: proposal.id,
          payloadQuery: proposal,
          payloadContract: _proposalData,
          utilityIds: _utilityIds,
        }
      }
    )
    // 	generate investProposalsList
    setInvestProposalsList(_proposalsList)
  }, [anyLoading, proposalsData, proposalsQuery, utilityIds])

  React.useEffect(() => {
    setInvestProposalsList([])
    resetProposals()
  }, [invested])

  return [investProposalsList, anyLoading, fetchMore]
}
export default useInvestorInvestProposalsList
