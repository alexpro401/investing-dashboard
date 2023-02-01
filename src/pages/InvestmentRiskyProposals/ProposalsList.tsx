import { FC, useMemo, useState, useEffect } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { v4 as uuidv4 } from "uuid"
import { Interface } from "@ethersproject/abi"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import { InvestorRiskyProposalsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { useTraderPoolRiskyProposalContract } from "contracts"

import LoadMore from "components/LoadMore"
import RiskyProposalCard from "components/cards/proposal/Risky"

import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { isNil, map } from "lodash"
import { graphClientBasicPools } from "utils/graphClient"
import { NoDataMessage } from "common"
import { Center } from "theme"
import {
  NEVER_RELOAD,
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

interface IRiskyCardInitializer {
  account: string
  poolAddress: string
  proposalId: number

  proposal: IRiskyProposalInfo[0]
}

function RiskyProposalCardInitializer({
  account,
  poolAddress,
  proposalId,
  proposal,
}: IRiskyCardInitializer) {
  const proposalPool = useTraderPoolRiskyProposalContract(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  // const [proposal, setProposal] = useState<IRiskyProposalInfo[0] | null>(null)

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  // useEffect(() => {
  //   if (!proposalPool || !poolAddress || isNil(proposalId)) return
  //   ;(async () => {
  //     try {
  //       const data = await proposalPool.getProposalInfos(proposalId, 1)
  //       if (data && data[0]) {
  //         setProposal(data[0])
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   })()
  // }, [poolAddress, proposalId, proposalPool])

  if (proposal === null || !poolInfo || !proposalPool) {
    return null
  }

  return (
    <RiskyProposalCard
      proposalId={proposalId}
      poolInfo={poolInfo}
      isTrader={isTrader}
      proposal={proposal}
      poolAddress={poolAddress}
      proposalPool={proposalPool}
    />
  )
}

interface IProps {
  activePools?: string[]
}

const InvestmentRiskyProposalsList: FC<IProps> = ({ activePools }) => {
  const { account } = useActiveWeb3React()

  const [{ data, loading }, fetchMore] = useQueryPagination<{
    id: string
    basicPool: {
      id: string
    }
  }>({
    query: InvestorRiskyProposalsQuery,
    variables: useMemo(
      () => ({ activePools: activePools ?? [] }),
      [activePools]
    ),
    pause: isNil(activePools),
    context: graphClientBasicPools,
    formatter: (d) => d.proposals,
  })

  const pools = useMemo(
    () => (!data || !data.length ? [] : data.map((p) => p.basicPool.id)),
    [data]
  )

  const proposalPoolAddressListResults = useMultipleContractSingleData(
    pools,
    TraderPool_Interface,
    "proposalPoolAddress",
    undefined,
    NEVER_RELOAD
  )

  const proposalPoolAddressListAnyLoading = useMemo(
    () => proposalPoolAddressListResults.some((r) => r.loading),
    [proposalPoolAddressListResults]
  )

  const proposalPoolAddressList = useMemo(() => {
    if (proposalPoolAddressListAnyLoading) {
      return []
    }

    return proposalPoolAddressListResults.map((r) => r.result?.[0])
  }, [proposalPoolAddressListResults, proposalPoolAddressListAnyLoading])

  const callInputs = useMemo(
    () =>
      !data || !data.length
        ? []
        : data.map((p) => [
            Number(String(p.id).charAt(String(p.id).length - 1)) - 1,
            1,
          ]),
    [data]
  )

  const callResults = useMultipleContractMultipleData(
    proposalPoolAddressList,
    TraderPoolRiskyProposal_Interface,
    "getProposalInfos",
    callInputs,
    NEVER_RELOAD
  )

  const anyLoading = useMemo(
    () => callResults.some((r) => r.loading),
    [callResults]
  )
  const proposals = useMemo(
    () => (anyLoading ? [] : callResults.map((r) => r.result?.[0][0])),
    [anyLoading, callResults]
  )

  if (!account || (proposals && proposals.length === 0 && anyLoading)) {
    return (
      <Center>
        <PulseSpinner />
      </Center>
    )
  }

  if (proposals && proposals.length === 0 && !anyLoading) {
    return <NoDataMessage />
  }

  return (
    <>
      {data.map((p, index) => (
        <RiskyProposalCardInitializer
          key={uuidv4()}
          account={account}
          proposalId={Number(String(p.id).charAt(String(p.id).length - 1)) - 1}
          poolAddress={p.basicPool.id}
          proposal={proposals[index]}
        />
      ))}
      <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
    </>
  )
}

export default InvestmentRiskyProposalsList
