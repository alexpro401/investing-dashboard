import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { Interface } from "@ethersproject/abi"
import { useWeb3React } from "@web3-react/core"

import { ZERO } from "consts"
import { RiskyProposalUtilityIds } from "types"
import {
  getRefreshIntervalByChain,
  useMultipleContractMultipleData,
} from "state/multicall/hooks"
import { TraderPoolRiskyProposal as TraderPoolRiskyProposal_ABI } from "abi"
import { IRiskyProposalInvestmentsInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"

const TraderPoolRiskyProposal_Interface = new Interface(
  TraderPoolRiskyProposal_ABI
)

type UtilityMap = Array<RiskyProposalUtilityIds>
type ProposalsMap = Array<IRiskyProposalInvestmentsInfo[0]>

function useRiskyProposalsListActiveInvestmentInfo(
  proposalUtilityIdList: UtilityMap
): [ProposalsMap, boolean] {
  const { account, chainId } = useWeb3React()

  const proposalAddressList = React.useMemo(() => {
    if (isEmpty(proposalUtilityIdList)) {
      return [undefined]
    }
    return Object.values(proposalUtilityIdList).map(
      (p) => p.proposalContractAddress
    )
  }, [proposalUtilityIdList])

  const callInputs = React.useMemo(() => {
    if (isEmpty(proposalUtilityIdList) || isNil(account)) {
      return [undefined]
    }
    return Object.values(proposalUtilityIdList).map((p) => [
      account,
      p.proposalId,
      1,
    ])
  }, [proposalUtilityIdList, account])

  const callResults = useMultipleContractMultipleData(
    proposalAddressList,
    TraderPoolRiskyProposal_Interface,
    "getActiveInvestmentsInfo",
    callInputs,
    {
      blocksPerFetch: getRefreshIntervalByChain(chainId, 1),
    }
  )

  const anyLoading = React.useMemo(
    () => callResults.some((callRes) => callRes.loading),
    [callResults]
  )

  const data = React.useMemo(
    () =>
      callResults.map(
        (callRes) =>
          callRes?.result?.[0]?.[0] ??
          ({
            baseInvested: ZERO,
            baseShare: ZERO,
            lp2Balance: ZERO,
            lpInvested: ZERO,
            positionShare: ZERO,
            proposalId: ZERO,
          } as unknown as IRiskyProposalInvestmentsInfo[0])
      ),
    [callResults]
  )

  return [data, anyLoading]
}

export default useRiskyProposalsListActiveInvestmentInfo
