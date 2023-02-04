import * as React from "react"
import { isEmpty } from "lodash"
import { useWeb3React } from "@web3-react/core"

import { RiskyProposalUtilityIds, WrappedRiskyProposalView } from "types"

import {
  useGetPoolsUserInvestedIn,
  useInvestorRiskyProposalsData,
  useInvestorRiskyProposalsQuery,
  useInvestorRiskyProposalContractAddresses,
} from "hooks/index"

type Response = [Map<string, WrappedRiskyProposalView>, boolean, () => void]

function useInvestorRiskyProposals(): Response {
  const { account } = useWeb3React()

  /**
   * 1) Get pools user invested in
   *
   * investor can see risky proposals in any basic pool he invested in
   * that's why we need to get all basic pools user invested in
   *
   */
  const [poolsUserInvestedIn, poolsUserInvestedInLoading] =
    useGetPoolsUserInvestedIn(account, "BASIC_POOL")

  /**
   * 2) Get risky proposal id's and matched basic pool id's
   *
   * used for UI pagination through risky proposals from all basic pools user invested in
   */
  const [riskyProposalsByPools, riskyProposalsByPoolsLoading, fetchMore] =
    useInvestorRiskyProposalsQuery(
      poolsUserInvestedIn,
      poolsUserInvestedInLoading
    )

  /**
   * 3) Get pools where risky proposals exist
   *
   * map risky proposals from step 2 to basic pool id's and remove duplicates
   */
  const _poolsWithRiskyProposals = React.useMemo(
    () => [...new Set(riskyProposalsByPools?.map((p) => p.basicPool.id))],
    [riskyProposalsByPools]
  )

  /**
   * 4) Get proposal contract addresses for pools
   *
   * every basic pool has a proposal contract which can return proposals data
   * we need to get contract addresses for basic pools using data from step 3
   */
  const [proposalContractAddressList, proposalContractAddressListAnyLoading] =
    useInvestorRiskyProposalContractAddresses(_poolsWithRiskyProposals)

  /**
   * 5) Create utility Map _proposalEntityId -> {proposalId, proposalEntityId, basicPoolAddress, proposalContractAddress}
   * to easy access proposal data
   */
  const _proposalEntityIdMapping = React.useMemo<
    Map<string, RiskyProposalUtilityIds>
  >(() => {
    const result = new Map()
    if (
      isEmpty(riskyProposalsByPools) ||
      isEmpty(proposalContractAddressList)
    ) {
      return result
    }

    return riskyProposalsByPools?.reduce((acc, p) => {
      const proposalEntityId = String(p.id).toLowerCase()

      const _proposalContractAddress = proposalContractAddressList.find((id) =>
        proposalEntityId.includes(id)
      )

      if (_proposalContractAddress) {
        const _proposalId = proposalEntityId.replace(
          _proposalContractAddress,
          ""
        )

        acc.set(proposalEntityId, {
          proposalId: Number(_proposalId) - 1,
          proposalEntityId: proposalEntityId,
          basicPoolAddress: p.basicPool.id,
          proposalContractAddress: _proposalContractAddress,
        })
      }

      return acc
    }, result)
  }, [riskyProposalsByPools, proposalContractAddressList])

  /**
   * 6) Fetch proposals data
   */
  const [proposalsData, proposalsDataLoading] = useInvestorRiskyProposalsData(
    _proposalEntityIdMapping
  )

  const anyLoading = React.useMemo(
    () =>
      poolsUserInvestedInLoading ||
      riskyProposalsByPoolsLoading ||
      proposalContractAddressListAnyLoading ||
      proposalsDataLoading,
    [
      poolsUserInvestedInLoading,
      riskyProposalsByPoolsLoading,
      proposalContractAddressListAnyLoading,
      proposalsDataLoading,
    ]
  )

  return [proposalsData, anyLoading, fetchMore]
}

export default useInvestorRiskyProposals
