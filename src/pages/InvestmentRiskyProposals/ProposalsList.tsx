import { FC, useMemo, useState, useEffect, useRef } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider } from "urql"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import { InvestorRiskyProposalsQuery } from "queries"
import useQueryPagination from "hooks/useQueryPagination"
import { useTraderPoolRiskyProposalContract } from "contracts"

import LoadMore from "components/LoadMore"
import RiskyProposalCard from "components/cards/proposal/Risky"

import S from "./styled"
import { IRiskyProposalInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { isNil } from "lodash"

const poolsClient = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
})

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
    if (!proposalPool || !poolAddress) return
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

  const variables = useMemo(
    () => ({ activePools: activePools ?? [] }),
    [activePools]
  )

  const prepareNewData = (d) =>
    d.proposals.map((p) => ({
      id: String(p.id).slice(42),
      poolAddress: p.basicPool.id,
    }))

  const [{ data, loading }, fetchMore] = useQueryPagination(
    InvestorRiskyProposalsQuery,
    variables,
    isNil(activePools),
    prepareNewData
  )

  const loader = useRef<any>()

  // manually disable scrolling *refresh this effect when ref container disappeared from DOM
  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  if (!account || !activePools || !data || (data.length === 0 && loading)) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (data && data.length === 0 && !loading) {
    return (
      <S.Content>
        <S.WithoutData>No proposal yet</S.WithoutData>
      </S.Content>
    )
  }

  return (
    <>
      <S.List ref={loader}>
        {data.map((p) => (
          <RiskyProposalCardInitializer
            key={p.poolAddress + p.id}
            account={account}
            proposalId={Number(p.id) - 1}
            poolAddress={p.poolAddress}
          />
        ))}
        <LoadMore
          isLoading={loading && !!data.length}
          handleMore={fetchMore}
          r={loader}
        />
      </S.List>
    </>
  )
}

const InvestmentRiskyProposalsListWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <InvestmentRiskyProposalsList {...props} />
    </GraphProvider>
  )
}

export default InvestmentRiskyProposalsListWithProvider
