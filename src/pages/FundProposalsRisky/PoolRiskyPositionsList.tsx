import { FC, useMemo } from "react"
import { PulseSpinner } from "react-spinners-kit"

import { useActiveWeb3React } from "hooks"
import { RiskyPositionsQuery } from "queries"
import { usePoolContract } from "hooks/usePool"
import useQueryPagination from "hooks/useQueryPagination"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"

import LoadMore from "components/LoadMore"

import { IRiskyPosition } from "interfaces/thegraphs/basic-pools"
import { map } from "lodash"
import { graphClientBasicPools } from "utils/graphClient"
import { NoDataMessage, CardPoolRiskyPosition } from "common"
import { Flex } from "theme"
import * as S from "./styled"
import Tooltip from "components/Tooltip"
import { v4 as uuidv4 } from "uuid"
import { useTranslation } from "react-i18next"

interface IProps {
  poolAddress?: string
  closed: boolean
}

const PoolRiskyPositionsList: FC<IProps> = ({ poolAddress, closed }) => {
  const { t } = useTranslation()
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
          <S.RiskyPositionsListHeadItem>
            {t("pool-risky-positions-list.label-pool")}
          </S.RiskyPositionsListHeadItem>
          <S.RiskyPositionsListHeadItem>
            {t("pool-risky-positions-list.label-my-volume")}
          </S.RiskyPositionsListHeadItem>
          <S.RiskyPositionsListHeadItem>
            <span>{t("pool-risky-positions-list.label-entry-price")}</span>
            <Tooltip id={uuidv4()}>
              {t("pool-risky-positions-list.tooltip-msg-entry-price")}
            </Tooltip>
          </S.RiskyPositionsListHeadItem>
          <S.RiskyPositionsListHeadItem>
            <span>
              {t(
                closed
                  ? "pool-risky-positions-list.label-closed-price"
                  : "pool-risky-positions-list.label-current-price"
              )}
            </span>
            <Tooltip id={uuidv4()}>
              {t(
                closed
                  ? "pool-risky-positions-list.tooltip-msg-closed-price"
                  : "pool-risky-positions-list.tooltip-msg-current-price"
              )}
            </Tooltip>
          </S.RiskyPositionsListHeadItem>
          <S.RiskyPositionsListHeadItem>
            {t("pool-risky-positions-list.label-pnl")}
          </S.RiskyPositionsListHeadItem>
        </S.RiskyPositionsListHead>
        {data.map((p) => (
          <CardPoolRiskyPosition
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

export default PoolRiskyPositionsList
