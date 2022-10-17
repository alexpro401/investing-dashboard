import { FC, useMemo, useEffect, useRef } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider, useQuery } from "urql"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"
import { isNil, isEmpty } from "lodash"

import { useActiveWeb3React } from "hooks"
import {
  InvestorProposalsPositionsQuery,
  InvestorRiskyPositionByIdQuery,
} from "queries"
import { usePoolContract } from "hooks/usePool"
import useQueryPagination from "hooks/useQueryPagination"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import LoadMore from "components/LoadMore"
import RiskyPositionCard from "components/cards/position/Risky"

import S from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
})

interface IRiskyCardInitializer {
  account: string
  position: any
}

const RiskyPositionCardInitializer: FC<IRiskyCardInitializer> = ({
  account,
  position,
}) => {
  const [{ data, fetching }] = useQuery({
    query: InvestorRiskyPositionByIdQuery,
    variables: {
      id: position.proposalContract.id + position.proposalId + "_0",
    },
    pause: !position,
  })
  const poolAddress = useMemo(() => {
    if (fetching || isNil(data)) return ""
    return data.proposalPosition.proposal.basicPool.id
  }, [data, fetching])

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

  const exchanges = useMemo(() => {
    if (
      isNil(position) ||
      isNil(position.vests) ||
      isEmpty(position.vests) ||
      isNil(data)
    ) {
      return []
    }

    return position.vests.map((v) => ({
      id: v.id,
      hash: v.hash,
      isInvest: v.isInvest,
      timestamp: v.timestamp,
      fromToken: v.isInvest
        ? data.proposalPosition.proposal.basicPool.id
        : data.proposalPosition.proposal.token,
      toToken: v.isInvest
        ? data.proposalPosition.proposal.token
        : data.proposalPosition.proposal.basicPool.id,
      fromVolume: v.isInvest ? v.baseVolume : v.lpVolume,
      toVolume: v.isInvest ? v.lpVolume : v.baseVolume,
      usdVolume: v.usdVolume,
    }))
  }, [position, data])

  const pos = useMemo(() => {
    if (isNil(position) || isNil(data)) {
      return undefined
    }

    return {
      id: data.proposalPosition.id,
      isClosed: position.isClosed,
      totalBaseOpenVolume: data.proposalPosition.totalBaseOpenVolume,
      totalBaseCloseVolume: data.proposalPosition.totalBaseCloseVolume,
      totalPositionOpenVolume: data.proposalPosition.totalPositionOpenVolume,
      totalPositionCloseVolume: data.proposalPosition.totalPositionCloseVolume,
      totalUSDOpenVolume: data.proposalPosition.totalUSDOpenVolume,
      totalUSDCloseVolume: data.proposalPosition.totalUSDCloseVolume,

      token: data.proposalPosition.proposal.token,
      pool: {
        id: data.proposalPosition.proposal.basicPool.id,
        baseToken: data.proposalPosition.proposal.basicPool.baseToken,
      },
      exchanges,
    }
  }, [position, data, exchanges])

  if (!position || !poolInfo || !poolMetadata || !pos) {
    return null
  }

  return (
    <RiskyPositionCard
      position={pos}
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
      address: String(account).toLocaleLowerCase(),
      type: "RISKY_PROPOSAL",
      closed,
    }),
    [closed, account]
  )

  const [{ data, loading }, fetchMore] = useQueryPagination(
    InvestorProposalsPositionsQuery,
    variables,
    (d) => d.proposalPositions
  )

  const loader = useRef<any>()

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
    <GraphProvider value={poolsClient}>
      <>
        <S.List ref={loader}>
          {data.map((p) => (
            <RiskyPositionCardInitializer
              key={p.id}
              position={p}
              account={account}
            />
          ))}
          <LoadMore
            isLoading={loading && !!data.length}
            handleMore={fetchMore}
            r={loader}
          />
        </S.List>
      </>
    </GraphProvider>
  )
}

export default InvestmentRiskyPositionsList
