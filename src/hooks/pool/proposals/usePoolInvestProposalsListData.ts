import * as React from "react"
import { isEmpty } from "lodash"
import { useWeb3React } from "@web3-react/core"

import {
  getRefreshIntervalByChain,
  useSingleContractMultipleData,
} from "state/multicall/hooks"
import { TraderPoolInvestProposal } from "interfaces/typechain"
import { InvestProposalUtilityIds } from "types"
import { IInvestProposalInfo } from "interfaces/contracts/ITraderPoolInvestProposal"

type Payload = Array<IInvestProposalInfo[0]>

function usePoolInvestProposalsListData(
  poolProposalContract: TraderPoolInvestProposal | null,
  proposalUtilityIdList: InvestProposalUtilityIds[]
): [Payload, boolean] {
  const { chainId } = useWeb3React()

  const callInputs = React.useMemo(() => {
    if (isEmpty(proposalUtilityIdList)) {
      return []
    }
    return proposalUtilityIdList.map((p) => [p.proposalId, 1])
  }, [proposalUtilityIdList])

  const callResults = useSingleContractMultipleData(
    poolProposalContract,
    "getProposalInfos",
    callInputs,
    {
      blocksPerFetch: getRefreshIntervalByChain(chainId, 1),
    }
  )

  const loading = React.useMemo(
    () => callResults.some((callRes) => callRes.loading),
    [callResults]
  )

  const data = React.useMemo(() => {
    if (isEmpty(callResults)) {
      return []
    }

    return callResults.map((callRes) => callRes?.result?.[0]?.[0])
  }, [callResults])

  return [data, loading]
}

export default usePoolInvestProposalsListData
