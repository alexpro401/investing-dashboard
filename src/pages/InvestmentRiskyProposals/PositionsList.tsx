import { FC, useMemo, useEffect, useRef } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider } from "urql"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { useActiveWeb3React } from "hooks"
import { RiskyPositionsQuery } from "queries"
import { usePoolContract } from "hooks/usePool"
import useQueryPagination from "hooks/useQueryPagination"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { IRiskyPositionCard } from "interfaces/thegraphs/basic-pools"

import LoadMore from "components/LoadMore"
import RiskyPositionCard from "components/cards/position/Risky"

import S from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

interface IRiskyCardInitializer {
  account: string
  poolAddress: string
  position: IRiskyPositionCard
}

const RiskyPositionCardInitializer: FC<IRiskyCardInitializer> = ({
  account,
  poolAddress,
  position,
}) => {
  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (!position || !poolInfo || !poolMetadata) {
    return null
  }

  return (
    <RiskyPositionCard
      position={position}
      isTrader={isTrader}
      poolInfo={poolInfo}
      poolMetadata={poolMetadata}
    />
  )
}

interface IProps {
  activePools?: string[]
  closed: boolean
}

const InvestmentRiskyPositionsList: FC<IProps> = ({ activePools, closed }) => {
  const { account } = useActiveWeb3React()

  const variables = useMemo(
    () => ({
      poolAddressList: activePools,
      closed,
    }),
    [activePools, closed]
  )

  const prepareNewData = (d): IRiskyPositionCard[] =>
    d.proposalPositions.map((p) => {
      console.log(p)
      const position = {
        ...p,
        token: p.proposal.token,
        pool: p.proposal.basicPool,
        exchanges: p.proposal.exchanges.reduce((acc, e) => {
          if (e.exchanges && e.exchanges.length > 0) {
            return [...acc, ...e.exchanges]
          }
          return acc
        }, []),
      }
      delete position.proposal

      return position
    })

  const [{ data, error, loading }, fetchMore] = useQueryPagination(
    RiskyPositionsQuery,
    variables,
    prepareNewData
  )

  const loader = useRef<any>()

  // manually disable scrolling *refresh this effect when ref container dissapeared from DOM
  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  if (!activePools || !data || !account || (data.length === 0 && loading)) {
    return (
      <S.Content>
        <PulseSpinner />
      </S.Content>
    )
  }

  if (data && data.length === 0 && !loading) {
    return (
      <S.Content>
        <S.WithoutData>
          No {closed ? "closed" : "open"} positions yet
        </S.WithoutData>
      </S.Content>
    )
  }

  return (
    <>
      <S.List ref={loader}>
        {data.map((p) => (
          <RiskyPositionCardInitializer
            key={p.id}
            position={p}
            account={account}
            poolAddress={p.pool.id}
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

const InvestmentRiskyPositionsListWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <InvestmentRiskyPositionsList {...props} />
    </GraphProvider>
  )
}

export default InvestmentRiskyPositionsListWithProvider
