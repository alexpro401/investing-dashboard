import * as React from "react"
import { isNil } from "lodash"
import { Interface } from "@ethersproject/abi"
import { useWeb3React } from "@web3-react/core"

import { InvestorRiskyProposalsQuery } from "queries"
import { useQueryPagination } from "hooks"
import { graphClientBasicPools } from "utils/graphClient"
import { InvestorRiskyProposal } from "interfaces/thegraphs/investors"
import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import {
  getRefreshIntervalByChain,
  useMultipleContractMultipleData,
  useMultipleContractSingleData,
} from "state/multicall/hooks"

import {
  TraderPool as TraderPool_ABI,
  TraderPoolRiskyProposal as TraderPoolRiskyProposal_ABI,
} from "abi"

const TraderPool_Interface = new Interface(TraderPool_ABI)
const TraderPoolRiskyProposal_Interface = new Interface(
  TraderPoolRiskyProposal_ABI
)

function useInvestorRiskyProposals(
  poolsUserInvestIn?: string[]
): [InvestorRiskyProposal[], IRiskyProposalInfo, boolean, () => void] {
  const { chainId } = useWeb3React()

  const [
    { data: riskyProposalsByPools, loading: riskyProposalsByPoolsLoading },
    fetchMore,
  ] = useQueryPagination<InvestorRiskyProposal>({
    query: InvestorRiskyProposalsQuery,
    variables: React.useMemo(
      () => ({ activePools: poolsUserInvestIn ?? [] }),
      [poolsUserInvestIn]
    ),
    pause: isNil(poolsUserInvestIn),
    context: graphClientBasicPools,
    formatter: (d) => d.proposals,
  })

  const poolsWithRiskyProposals = React.useMemo(
    () => riskyProposalsByPools?.map((p) => p.basicPool.id),
    [riskyProposalsByPools]
  )

  const proposalPoolAddressListResults = useMultipleContractSingleData(
    poolsWithRiskyProposals,
    TraderPool_Interface,
    "proposalPoolAddress",
    undefined,
    { blocksPerFetch: getRefreshIntervalByChain(chainId ?? 0, 1) }
  )

  const proposalPoolAddressListAnyLoading = React.useMemo(
    () => proposalPoolAddressListResults.some((r) => r.loading),
    [proposalPoolAddressListResults]
  )

  const proposalPoolAddressList = React.useMemo(
    () =>
      proposalPoolAddressListAnyLoading
        ? []
        : proposalPoolAddressListResults?.map((r) => r.result?.[0]),
    [proposalPoolAddressListResults, proposalPoolAddressListAnyLoading]
  )

  const callInputs = React.useMemo(
    () =>
      riskyProposalsByPools?.map((p) => [
        Number(String(p.id).charAt(String(p.id).length - 1)) - 1,
        1,
      ]),
    [riskyProposalsByPools]
  )

  const callResults = useMultipleContractMultipleData(
    proposalPoolAddressList,
    TraderPoolRiskyProposal_Interface,
    "getProposalInfos",
    callInputs,
    { blocksPerFetch: getRefreshIntervalByChain(chainId ?? 0, 1) }
  )
  const callResultsAnyLoading = React.useMemo(
    () => callResults.some((r) => r.loading),
    [callResults]
  )

  const proposals = React.useMemo(
    () =>
      callResultsAnyLoading ? [] : callResults.map((r) => r.result?.[0][0]),
    [callResultsAnyLoading, callResults]
  )

  const anyLoading = React.useMemo(
    () =>
      riskyProposalsByPoolsLoading ||
      proposalPoolAddressListAnyLoading ||
      callResultsAnyLoading,
    [
      proposalPoolAddressListAnyLoading,
      riskyProposalsByPoolsLoading,
      callResultsAnyLoading,
    ]
  )

  return [riskyProposalsByPools, proposals, anyLoading, fetchMore]
}

export default useInvestorRiskyProposals
