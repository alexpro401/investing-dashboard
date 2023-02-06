import * as React from "react"
import { isEmpty } from "lodash"

import { RiskyProposalUtilityIds, WrappedRiskyProposalView } from "types"

import {
  useRiskyProposalsData,
  useRiskyProposalsQuery,
  useRiskyProposalContractAddresses,
} from "hooks"

type Response = [Record<string, WrappedRiskyProposalView>, boolean, () => void]

function useRiskyProposalsByPools(pools: string[], pause): Response {
  /**
   * 2) Get risky proposal id's and matched basic pool id's
   *
   * used for UI pagination through risky proposals from all basic pools user invested in
   */
  const [riskyProposalsByPools, riskyProposalsByPoolsLoading, fetchMore] =
    useRiskyProposalsQuery(pools, pause)

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
    useRiskyProposalContractAddresses(_poolsWithRiskyProposals)

  /**
   * 5) Create utility Map _proposalEntityId -> {proposalId, proposalEntityId, basicPoolAddress, proposalContractAddress}
   * to easy access proposal data
   */
  const _proposalEntityIdMapping = React.useMemo<
    Record<string, RiskyProposalUtilityIds>
  >(() => {
    const result = {}
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

        acc[proposalEntityId] = {
          proposalId: Number(_proposalId) - 1,
          proposalEntityId: proposalEntityId,
          basicPoolAddress: p.basicPool.id,
          proposalContractAddress: _proposalContractAddress,
        }
      }

      return acc
    }, result)
  }, [riskyProposalsByPools, proposalContractAddressList])

  /**
   * 6) Fetch proposals data
   */
  const [proposalsData, proposalsDataLoading] = useRiskyProposalsData(
    _proposalEntityIdMapping
  )

  const anyLoading = React.useMemo(
    () =>
      pause ||
      riskyProposalsByPoolsLoading ||
      proposalContractAddressListAnyLoading ||
      proposalsDataLoading,
    [
      pause,
      riskyProposalsByPoolsLoading,
      proposalContractAddressListAnyLoading,
      proposalsDataLoading,
    ]
  )

  return [proposalsData, anyLoading, fetchMore]
}

export default useRiskyProposalsByPools
