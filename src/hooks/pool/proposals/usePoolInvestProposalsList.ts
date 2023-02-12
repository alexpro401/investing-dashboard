import * as React from "react"
import {
  InvestProposalUtilityIds,
  WrappedInvestProposalView,
} from "types/investPool.types"
import { useTraderPoolInvestProposalContract } from "contracts"
import {
  useProposalAddress,
  usePoolInvestProposalsListQuery,
  usePoolInvestProposalsListData,
} from "hooks"
import { isEmpty } from "lodash"

const usePoolInvestProposalsList = (
  poolAddress: string
): [WrappedInvestProposalView[], boolean, () => void] => {
  console.groupCollapsed("usePoolInvestProposalsList")
  console.time("usePoolInvestProposalsList")
  // 1) get pool proposals contract address and instance
  const poolProposalContractAddress = useProposalAddress(poolAddress)
  const poolProposalContract = useTraderPoolInvestProposalContract(poolAddress)

  // 2) get proposals from graph
  const [{ data: proposalsQuery, loading: proposalsQueryLoading }, fetchMore] =
    usePoolInvestProposalsListQuery(poolAddress)

  // 3) generate InvestProposalUtilityIds
  const utilityIdsList = React.useMemo<InvestProposalUtilityIds[]>(() => {
    if (isEmpty(proposalsQuery) || !poolProposalContractAddress) return []

    return proposalsQuery.map((proposal) => ({
      proposalId: proposal.proposalId ? Number(proposal.proposalId) - 1 : 1,
      proposalEntityId: proposal.id,
      investPoolAddress: proposal.investPool.id,
      proposalContractAddress: poolProposalContractAddress,
      investPoolBaseTokenAddress: proposal.investPool.baseToken,
    }))
  }, [poolProposalContractAddress, proposalsQuery])

  // 4) get proposals using Multicall (poolProposalContract.getProposalInfos)
  const [proposalsData, proposalsDataLoading] = usePoolInvestProposalsListData(
    poolProposalContract,
    utilityIdsList
  )

  const anyLoading = React.useMemo(
    () => proposalsQueryLoading || proposalsDataLoading,
    [proposalsQueryLoading, proposalsDataLoading]
  )

  // 5) generate WrappedInvestProposalView
  const [investProposalsList, setInvestProposalsList] = React.useState<
    WrappedInvestProposalView[]
  >([])

  React.useEffect(() => {
    if (
      anyLoading ||
      isEmpty(proposalsQuery) ||
      isEmpty(utilityIdsList) ||
      isEmpty(proposalsData)
    ) {
      return
    }

    const _proposalsList: WrappedInvestProposalView[] = proposalsQuery.map(
      (proposal, index) => {
        const _utilityIds = utilityIdsList[index]
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
  }, [anyLoading, proposalsData, proposalsQuery, utilityIdsList])

  console.timeEnd("usePoolInvestProposalsList")
  console.groupEnd()
  return [investProposalsList, anyLoading, fetchMore]
}

export default usePoolInvestProposalsList
