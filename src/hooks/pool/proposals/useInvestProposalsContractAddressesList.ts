import * as React from "react"
import { Interface } from "@ethersproject/abi"
import { useWeb3React } from "@web3-react/core"
import { InvestTraderPool as InvestTraderPool_ABI } from "abi"
import {
  getRefreshIntervalByChain,
  useMultipleContractSingleData,
} from "state/multicall/hooks"

const InvestTraderPool_Interface = new Interface(InvestTraderPool_ABI)

function useInvestProposalsContractAddressesList(
  poolsAddressList: string[]
): [string[], boolean] {
  const { chainId } = useWeb3React()
  const proposalPoolAddressListResults = useMultipleContractSingleData(
    poolsAddressList,
    InvestTraderPool_Interface,
    "proposalPoolAddress",
    undefined,
    {
      blocksPerFetch: getRefreshIntervalByChain(chainId, 1),
    }
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

export default useInvestProposalsContractAddressesList
