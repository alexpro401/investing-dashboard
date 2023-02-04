import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { RPC_PROVIDERS } from "consts"
import { useActiveWeb3React } from "hooks/index"
import { getContract } from "utils/getContract"

import { RiskyProposalUtilityIds, WrappedRiskyProposalView } from "types"
import { TraderPoolRiskyProposal as TraderPoolRiskyProposal_ABI } from "abi"

type UtilityMap = Map<string, RiskyProposalUtilityIds>
type ProposalsMap = Map<string, WrappedRiskyProposalView>

function useInvestorRiskyProposalsData(
  _riskyProposalUtilityIdsMap: UtilityMap
): [ProposalsMap, boolean] {
  const { library, account, chainId } = useActiveWeb3React()
  const provider = chainId && RPC_PROVIDERS[chainId]

  const [riskyProposalUtilityIdsMap, setRiskyProposalUtilityIdsMap] =
    React.useState<UtilityMap>(_riskyProposalUtilityIdsMap)
  const [loading, setLoading] = React.useState(true)
  const [data, setData] = React.useState<ProposalsMap>(new Map())

  React.useEffect(() => {
    setRiskyProposalUtilityIdsMap(_riskyProposalUtilityIdsMap)
  }, [_riskyProposalUtilityIdsMap])

  React.useEffect(() => {
    setLoading(true)
    setRiskyProposalUtilityIdsMap(new Map())
    setData(new Map())
  }, [account])

  const proposalsDiff = React.useMemo<UtilityMap>(
    () =>
      new Map(
        [...riskyProposalUtilityIdsMap].filter(([key]) => !data.has(key))
      ),
    [riskyProposalUtilityIdsMap, data]
  )

  const fetchProposals = React.useCallback(
    async (entries: UtilityMap) => {
      if (
        isNil(library) ||
        isNil(account) ||
        isNil(provider) ||
        isEmpty(entries)
      ) {
        return
      }

      setLoading(true)

      const _proposals: ProposalsMap = new Map()

      for (const [proposalEntityId, values] of entries) {
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
            _proposals.set(proposalEntityId, {
              id: proposalEntityId,
              proposal: proposals[0],
              utilityIds: values,
            })
          }
        }
      }

      setData((prev) => new Map([...prev, ..._proposals]))
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

export default useInvestorRiskyProposalsData
