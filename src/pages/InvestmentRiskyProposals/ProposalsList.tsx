import { FC, useMemo, useState, useEffect } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { v4 as uuidv4 } from "uuid"

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

interface IRiskyCardInitializer {
  account: string
  poolAddress: string
  proposalId: number
}

function RiskyProposalCardInitializer({
  account,
  poolAddress,
  proposalId,
}: IRiskyCardInitializer) {
  const proposalPool = useTraderPoolRiskyProposalContract(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [proposal, setProposal] = useState<IRiskyProposalInfo[0] | null>(null)

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  useEffect(() => {
    if (!proposalPool || !poolAddress || isNil(proposalId)) return
    ;(async () => {
      try {
        const data = await proposalPool.getProposalInfos(proposalId, 1)
        if (data && data[0]) {
          setProposal(data[0])
        }
      } catch (error) {
        console.log(error)
      }
    })()
  }, [poolAddress, proposalId, proposalPool])

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
    formatter: (d) =>
      map(d.proposals, (p) => ({
        ...p,
        id: String(p.id).charAt(String(p.id).length - 1),
      })),
  })

  if (!account || !activePools || !data || (data.length === 0 && loading)) {
    return (
      <Center>
        <PulseSpinner />
      </Center>
    )
  }

  if (data && data.length === 0 && !loading) {
    return <NoDataMessage />
  }

  return (
    <>
      {data.map((p) => (
        <RiskyProposalCardInitializer
          key={uuidv4()}
          account={account}
          proposalId={Number(p.id) - 1}
          poolAddress={p.basicPool.id}
        />
      ))}
      <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
    </>
  )
}

export default InvestmentRiskyProposalsList
