import * as React from "react"
import { useWeb3React } from "@web3-react/core"
import { isEmpty, isEqual, isNil } from "lodash"
import { BigNumber } from "@ethersproject/bignumber"

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
import { useCorePropertiesContract } from "contracts"
import { ZERO } from "consts"

type Response = [Array<WrappedRiskyProposalView>, boolean, () => void]

function useRiskyProposalsList(pools: string[], pause: boolean): Response {
  const { account } = useWeb3React()
  const corePropertiesContract = useCorePropertiesContract()

  const [maximumPoolInvestors, setMaximumPoolInvestors] =
    React.useState<BigNumber>(ZERO)
  const [maximumPoolInvestorsLoading, setMaximumPoolInvestorsLoading] =
    React.useState<boolean>(true)

  const loadMaxPoolInvestors = React.useCallback(async () => {
    if (!corePropertiesContract || pause) return ZERO
    try {
      setMaximumPoolInvestorsLoading(true)
      return corePropertiesContract.getMaximumPoolInvestors()
    } catch (e) {
      console.error("Failed to load maximum pool investors")
      return ZERO
    }
  }, [corePropertiesContract, pause])

  React.useEffect(() => {
    loadMaxPoolInvestors()
      .then((res) => setMaximumPoolInvestors(res))
      .then(() => setMaximumPoolInvestorsLoading(false))
  }, [loadMaxPoolInvestors])

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
      maximumPoolInvestorsLoading ||
      riskyProposalsByPoolsLoading ||
      proposalContractAddressListAnyLoading ||
      proposalsDataLoading ||
      activeInvestmentsInfoLoading ||
      tokenMarkPricesLoading ||
      poolInfoLoading,
    [
      pause,
      maximumPoolInvestorsLoading,
      riskyProposalsByPoolsLoading,
      proposalContractAddressListAnyLoading,
      proposalsDataLoading,
      activeInvestmentsInfoLoading,
      tokenMarkPricesLoading,
      poolInfoLoading,
    ]
  )

  const proposals = React.useMemo(() => {
    if (
      anyLoading ||
      isNil(account) ||
      isEmpty(proposalsData) ||
      isEmpty(activeInvestmentsInfo) ||
      isEmpty(tokenMarkPrices) ||
      isEmpty(poolInfos)
    ) {
      return []
    }

    return proposalUtilityIdList.map<WrappedRiskyProposalView>(
      (utilityIds, index) => {
        const poolInfo = poolInfos[utilityIds.basicPoolAddress]!

        const isTrader = isEqual(
          String(account).toLowerCase(),
          String(poolInfo.parameters.trader).toLowerCase()
        )
        return {
          id: utilityIds.proposalEntityId,
          proposal: proposalsData[index],
          userActiveInvestmentsInfo: activeInvestmentsInfo[index],
          proposalTokenMarkPrice:
            tokenMarkPrices[utilityIds.proposalTokenAddress],
          utilityIds: utilityIds,
          poolInfo: poolInfo,
          isTrader: isTrader,
          maximumPoolInvestors: maximumPoolInvestors,
        }
      }
    )
  }, [
    account,
    anyLoading,
    proposalUtilityIdList,
    proposalsData,
    activeInvestmentsInfo,
    tokenMarkPrices,
    poolInfos,
    maximumPoolInvestors,
  ])

  return [proposals, anyLoading, fetchMore]
}

export default useRiskyProposalsList
