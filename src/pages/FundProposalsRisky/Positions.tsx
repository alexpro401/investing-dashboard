import { FC, useMemo, useRef, useEffect } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { useActiveWeb3React } from "hooks"
import { RiskyPositionsQuery } from "queries"
import { usePoolContract } from "hooks/usePool"
import useQueryPagination from "hooks/useQueryPagination"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import LoadMore from "components/LoadMore"
import RiskyPositionCard from "components/cards/position/Risky"

import S from "./styled"
import { IRiskyPosition } from "interfaces/thegraphs/basic-pools"
import { map } from "lodash"
import { graphClientBasicPools } from "utils/graphClient"

interface IProps {
  poolAddress?: string
  closed: boolean
}

const FundPositionsRisky: FC<IProps> = ({ poolAddress, closed }) => {
  const { account } = useActiveWeb3React()
  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const [{ data, loading }, fetchMore] = useQueryPagination<IRiskyPosition>({
    query: RiskyPositionsQuery,
    variables: useMemo(
      () => ({ poolAddressList: [poolAddress], closed }),
      [closed, poolAddress]
    ),
    pause: !poolAddress,
    context: graphClientBasicPools,
    formatter: (d) =>
      map(d.proposalPositions, (p) => ({
        ...p,
        proposal: {
          ...p.proposal,
          exchanges: p.proposal.exchanges[0]
            ? p.proposal.exchanges[0].exchanges
            : [],
        },
      })),
  })

  const loader = useRef<any>()

  useEffect(() => {
    if (!loader.current) return
    disableBodyScroll(loader.current)

    return () => clearAllBodyScrollLocks()
  }, [loader, loading])

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  if (
    !poolAddress ||
    !data ||
    !poolInfo ||
    !poolMetadata ||
    (data.length === 0 && loading)
  ) {
    return (
      <S.ListLoading full ai="center" jc="center">
        <PulseSpinner />
      </S.ListLoading>
    )
  }

  if (data && data.length === 0 && !loading) {
    return (
      <S.ListLoading full ai="center" jc="center">
        <S.WithoutData>No positions</S.WithoutData>
      </S.ListLoading>
    )
  }

  return (
    <S.List ref={loader}>
      {data.map((p) => (
        <RiskyPositionCard
          key={p.id}
          position={p}
          isTrader={isTrader}
          poolInfo={poolInfo}
          poolMetadata={poolMetadata}
        />
      ))}
      <LoadMore
        isLoading={loading && !!data.length}
        handleMore={fetchMore}
        r={loader}
      />
    </S.List>
  )
}

export default FundPositionsRisky
