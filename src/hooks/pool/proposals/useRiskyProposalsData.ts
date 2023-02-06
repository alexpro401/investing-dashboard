import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { RPC_PROVIDERS } from "consts"
import { useActiveWeb3React } from "hooks/index"
import { getContract } from "utils/getContract"

import { RiskyProposalUtilityIds, WrappedRiskyProposalView } from "types"
import { TraderPoolRiskyProposal as TraderPoolRiskyProposal_ABI } from "abi"

type UtilityMap = Record<string, RiskyProposalUtilityIds>
type ProposalsMap = Record<string, WrappedRiskyProposalView>

function useRiskyProposalsData(
  _riskyProposalUtilityIdsMap: UtilityMap
): [ProposalsMap, boolean] {
  const { library, account, chainId } = useActiveWeb3React()
  const provider = chainId && RPC_PROVIDERS[chainId]

  const [riskyProposalUtilityIdsMap, setRiskyProposalUtilityIdsMap] =
    React.useState<UtilityMap>(_riskyProposalUtilityIdsMap)
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<ProposalsMap>({})

  React.useEffect(() => {
    setRiskyProposalUtilityIdsMap(_riskyProposalUtilityIdsMap)
  }, [_riskyProposalUtilityIdsMap])

  React.useEffect(() => {
    setLoading(true)
    setRiskyProposalUtilityIdsMap({})
    setData({})
  }, [account])

  const proposalsDiff = React.useMemo<UtilityMap>(
    () =>
      Object.entries(riskyProposalUtilityIdsMap).reduce((acc, [key, value]) => {
        if (!data.hasOwnProperty(key)) {
          acc[key] = value
        }

        return acc
      }, {}),
    [riskyProposalUtilityIdsMap, data]
  )

  const fetchProposals = React.useCallback(
    async (entryList: UtilityMap) => {
      if (
        isNil(library) ||
        isNil(account) ||
        isNil(provider) ||
        isEmpty(entryList)
      ) {
        return
      }

      setLoading(true)

      const _proposals: ProposalsMap = {}

      for (const [proposalEntityId, values] of Object.entries(entryList)) {
        const { proposalId, proposalContractAddress } = values
        const proposalContract = await getContract(
          proposalContractAddress,
          TraderPoolRiskyProposal_ABI,
          library || provider,
          account || undefined
        )

        if (proposalContract) {
          const proposals = await proposalContract.getProposalInfos(
            proposalId,
            1
          )

          if (proposals && proposals[0]) {
            _proposals[proposalEntityId] = {
              id: proposalEntityId,
              proposal: proposals[0],
              utilityIds: values,
            }
          }
        }
      }

      setData((prev) => ({ ...prev, ..._proposals }))
      setLoading(false)
    },
    [library, account, provider]
  )

  React.useEffect(() => {
    if (isEmpty(proposalsDiff)) {
      return
    }

    fetchProposals(proposalsDiff)
  }, [fetchProposals, proposalsDiff])

  return [data, loading]
}

export default useRiskyProposalsData
