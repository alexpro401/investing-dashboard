import * as React from "react"
import { isEmpty } from "lodash"
import { Interface } from "@ethersproject/abi"
import { useWeb3React } from "@web3-react/core"

import { InvestProposalUtilityIds } from "types"
import { TraderPoolInvestProposal as TraderPoolInvestProposal_ABI } from "abi"
import {
  getRefreshIntervalByChain,
  useMultipleContractMultipleData,
} from "state/multicall/hooks"
import { IInvestProposalInfo } from "interfaces/contracts/ITraderPoolInvestProposal"

const TraderPoolInvestProposal_Interface = new Interface(
  TraderPoolInvestProposal_ABI
)

type Payload = Array<IInvestProposalInfo[0]>

function useInvestorInvestProposalsListData(
  proposalUtilityIdList: InvestProposalUtilityIds[]
): [Payload, boolean] {
  const { chainId } = useWeb3React()

  const proposalContractAddressList = React.useMemo(() => {
    if (isEmpty(proposalUtilityIdList)) {
      return []
    }
    return proposalUtilityIdList.map((p) => p.proposalContractAddress)
  }, [proposalUtilityIdList])

  const callInputs = React.useMemo(() => {
    if (isEmpty(proposalUtilityIdList)) {
      return []
    }
    return proposalUtilityIdList.map((p) => [p.proposalId, 1])
  }, [proposalUtilityIdList])

  const callResults = useMultipleContractMultipleData(
    proposalContractAddressList,
    TraderPoolInvestProposal_Interface,
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

export default useInvestorInvestProposalsListData
