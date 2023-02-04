import * as React from "react"
import { Interface } from "@ethersproject/abi"
import { TraderPool as TraderPool_ABI } from "abi"

import {
  NEVER_RELOAD,
  useMultipleContractSingleData,
} from "state/multicall/hooks"

const TraderPool_Interface = new Interface(TraderPool_ABI)
function useInvestorRiskyProposalContractAddresses(
  poolsWithRiskyProposals: string[]
): [string[], boolean] {
  const proposalPoolAddressListResults = useMultipleContractSingleData(
    poolsWithRiskyProposals,
    TraderPool_Interface,
    "proposalPoolAddress",
    undefined,
    NEVER_RELOAD
  )

  const proposalPoolAddressListAnyLoading = React.useMemo(
    () => proposalPoolAddressListResults.some((r) => r.loading),
    [proposalPoolAddressListResults]
  )

  const proposalPoolAddressList = React.useMemo(
    () =>
      proposalPoolAddressListResults
        ?.filter((r) => !r.loading)
        .map((r) => String(r.result?.[0]).toLowerCase()),
    [proposalPoolAddressListResults]
  )

  return [proposalPoolAddressList, proposalPoolAddressListAnyLoading]
}

export default useInvestorRiskyProposalContractAddresses
