import * as React from "react"
import { isEmpty } from "lodash"

import { RiskyProposalUtilityIds, WrappedRiskyProposalView } from "types"

import {
  useRiskyProposalsListQuery,
  useRiskyProposalsListContractAddresses,
  useRiskyProposalsListData,
  useRiskyProposalsListActiveInvestmentInfo,
  useRiskyProposalsListTokenMarkPrice,
  useTraderPoolInfoMulticall,
} from "hooks"
import { IPoolInfo } from "interfaces/contracts/ITraderPool"

type Response = [Array<WrappedRiskyProposalView>, boolean, () => void]

function useRiskyProposalsList(pools: string[], pause: boolean): Response {
  const [riskyProposalsByPools, riskyProposalsByPoolsLoading, fetchMore] =
    useRiskyProposalsListQuery(pools, pause)

  const _poolsWithRiskyProposals = React.useMemo(
    () => [...new Set(riskyProposalsByPools?.map((p) => p.basicPool.id))],
    [riskyProposalsByPools]
  )

  const [proposalContractAddressList, proposalContractAddressListAnyLoading] =
    useRiskyProposalsListContractAddresses(_poolsWithRiskyProposals)

  const proposalUtilityIdList = React.useMemo<RiskyProposalUtilityIds[]>(() => {
    if (
      isEmpty(riskyProposalsByPools) ||
      isEmpty(proposalContractAddressList)
    ) {
      return []
    }

    return riskyProposalsByPools.map((p) => {
      const proposalEntityId = String(p.id).toLowerCase()

      const _proposalContractAddress = proposalContractAddressList.find((id) =>
        proposalEntityId.includes(id)
      )

      const _proposalId = proposalEntityId.replace(
        _proposalContractAddress ?? "",
        ""
      )

      return {
        proposalId: Number(_proposalId) - 1,
        proposalEntityId: proposalEntityId,
        basicPoolAddress: p.basicPool.id,
        proposalContractAddress: _proposalContractAddress,
        proposalTokenAddress: p.token,
      } as RiskyProposalUtilityIds
    })
  }, [riskyProposalsByPools, proposalContractAddressList])

  const [proposalsData, proposalsDataLoading] = useRiskyProposalsListData(
    proposalUtilityIdList
  )

  const [activeInvestmentsInfo, activeInvestmentsInfoLoading] =
    useRiskyProposalsListActiveInvestmentInfo(proposalUtilityIdList)

  const [tokenMarkPrices, tokenMarkPricesLoading] =
    useRiskyProposalsListTokenMarkPrice(proposalUtilityIdList)

  const [poolInfos, poolInfoLoading] = useTraderPoolInfoMulticall<IPoolInfo>(
    _poolsWithRiskyProposals,
    "getPoolInfo"
  )

  const anyLoading = React.useMemo(
    () =>
      pause ||
      riskyProposalsByPoolsLoading ||
      proposalContractAddressListAnyLoading ||
      proposalsDataLoading ||
      activeInvestmentsInfoLoading ||
      tokenMarkPricesLoading ||
      poolInfoLoading,
    [
      pause,
      riskyProposalsByPoolsLoading,
      proposalContractAddressListAnyLoading,
      proposalsDataLoading,
      activeInvestmentsInfoLoading,
      tokenMarkPricesLoading,
      poolInfoLoading,
    ]
  )

  const [proposals, setProposals] = React.useState<WrappedRiskyProposalView[]>(
    []
  )

  React.useEffect(() => {
    if (anyLoading || isEmpty(proposalsData)) {
      return
    }

    const _proposals = proposalUtilityIdList.map<WrappedRiskyProposalView>(
      (utilityIds, index) => ({
        id: utilityIds.proposalEntityId,
        proposal: proposalsData[index],
        userActiveInvestmentsInfo: activeInvestmentsInfo[index],
        proposalTokenMarkPrice:
          tokenMarkPrices[utilityIds.proposalTokenAddress],
        utilityIds: utilityIds,
        poolInfo: poolInfos[utilityIds.basicPoolAddress],
      })
    )

    setProposals(_proposals)
  }, [
    anyLoading,
    proposalUtilityIdList,
    proposalsData,
    activeInvestmentsInfo,
    tokenMarkPrices,
    poolInfos,
  ])

  return [proposals, anyLoading, fetchMore]
}

export default useRiskyProposalsList
