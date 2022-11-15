import { FC, useMemo, useEffect, useRef } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider } from "urql"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"
import { isNil } from "lodash"

import { useActiveWeb3React } from "hooks"
import { usePoolContract } from "hooks/usePool"
import useRiskyPosition from "hooks/useRiskyPosition"
import useQueryPagination from "hooks/useQueryPagination"
import { InvestorProposalsPositionsQuery } from "queries"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { InvestorRiskyPositionWithVests } from "interfaces/thegraphs/investors"

import LoadMore from "components/LoadMore"
import RiskyInvestorPositionCard from "components/cards/position/RiskyInvestor"

import S from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_BASIC_POOLS_API_URL || "",
})

interface IRiskyCardInitializer {
  position: InvestorRiskyPositionWithVests
}

const RiskyPositionCardInitializer: FC<IRiskyCardInitializer> = ({
  position,
}) => {
  const data = useRiskyPosition({
    proposalAddress: position.proposalContract.id,
    // Must subtract 2
    // because in useRiskyPosition add 1 (positionId have shift of one between contract and graph)
    // but here we use id from graph
    proposalId: String(Number(position.proposalId) - 1),
    closed: position.isClosed,
  })

  const poolAddress = useMemo(() => {
    if (isNil(data)) return ""
    return data.proposal.basicPool.id
  }, [data])

  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const positionDTO = useMemo(() => {
    if (isNil(position) || isNil(data)) {
      return undefined
    }

    return {
      ...position,
      token: data.proposal.token,
      pool: {
        id: data.proposal.basicPool.id,
        baseToken: data.proposal.basicPool.baseToken,
      },
    }
  }, [position, data])

  if (!position || !poolInfo || !poolMetadata || !positionDTO) {
    return null
  }

  return (
    <RiskyInvestorPositionCard
      position={positionDTO}
      poolInfo={poolInfo}
      poolMetadata={poolMetadata}
      proposalId={position.proposalId}
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
  const pause = useMemo(
    () => isNil(closed) || isNil(account),
    [closed, account]
  )

  const [{ data, loading }, fetchMore] =
    useQueryPagination<InvestorRiskyPositionWithVests>(
      InvestorProposalsPositionsQuery,
      variables,
      pause,
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
            <RiskyPositionCardInitializer key={p.id} position={p} />
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
