import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"

import { useActiveWeb3React } from "hooks"
import { RiskyPositionsQuery } from "queries"
import { usePoolContract } from "hooks/usePool"
import useQueryPagination from "hooks/useQueryPagination"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import LoadMore from "components/LoadMore"
import RiskyPositionCard from "components/cards/position/Risky"

import { IRiskyPosition } from "interfaces/thegraphs/basic-pools"
import { map } from "lodash"
import { graphClientBasicPools } from "utils/graphClient"
import { NoDataMessage } from "common"
import { Flex } from "theme"
import * as S from "./styled"
import Tooltip from "components/Tooltip"
import { v4 as uuidv4 } from "uuid"

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
      <Flex full ai="center" jc="center">
        <PulseSpinner />
      </Flex>
    )
  }

  if (data && data.length === 0 && !loading) {
    return <NoDataMessage />
  }

  return (
    <>
      <S.RiskyPositionsListWrp>
        <S.RiskyPositionsListHead>
          <S.RiskyPositionsListHeadItem>Fund</S.RiskyPositionsListHeadItem>
          <S.RiskyPositionsListHeadItem>My Volume</S.RiskyPositionsListHeadItem>
          <S.RiskyPositionsListHeadItem>
            <span>Entry Price</span>
            <Tooltip id={uuidv4()}>Explain Entry Price</Tooltip>
          </S.RiskyPositionsListHeadItem>
          <S.RiskyPositionsListHeadItem>
            <span>Current price</span>
            <Tooltip id={uuidv4()}>Explain Current price</Tooltip>
          </S.RiskyPositionsListHeadItem>
          <S.RiskyPositionsListHeadItem>P&L in %</S.RiskyPositionsListHeadItem>
        </S.RiskyPositionsListHead>
        {data.map((p) => (
          <RiskyPositionCard
            key={p.id}
            position={p}
            isTrader={isTrader}
            poolInfo={poolInfo}
            poolMetadata={poolMetadata}
          />
        ))}
      </S.RiskyPositionsListWrp>

      <LoadMore isLoading={loading && !!data.length} handleMore={fetchMore} />
    </>
  )
}

export default FundPositionsRisky
