import { FC, useMemo } from "react"
import { v4 as uuidv4 } from "uuid"
import { useTranslation } from "react-i18next"
import { useWeb3React } from "@web3-react/core"
import { SpiralSpinner } from "react-spinners-kit"
import { isEmpty, isNil } from "lodash"

import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { usePoolContract, usePoolRiskyPositionsList } from "hooks"

import { Center } from "theme"
import Tooltip from "components/Tooltip"
import LoadMore from "components/LoadMore"
import { NoDataMessage, CardPoolRiskyPosition } from "common"

import * as S from "./styled"

interface IProps {
  poolAddress?: string
  closed: boolean
}

const PoolRiskyPositionsList: FC<IProps> = ({ poolAddress, closed }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const [, poolInfo] = usePoolContract(poolAddress)

  const [{ poolMetadata }] = usePoolMetadata(
    poolAddress,
    poolInfo?.parameters.descriptionURL
  )

  const [{ data, loading }, fetchMore] = usePoolRiskyPositionsList(
    poolAddress ?? "",
    closed
  )

  const isTrader = useMemo<boolean>(() => {
    if (!account || !poolInfo) {
      return false
    }

    return account === poolInfo.parameters.trader
  }, [account, poolInfo])

  return (
    <>
      {isNil(poolInfo) || isEmpty(data) ? (
        loading ? (
          <Center>
            <SpiralSpinner size={30} loading />
          </Center>
        ) : (
          <NoDataMessage />
        )
      ) : (
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

          <S.InvestorRiskyPositionsListBody>
            {data.map((p) => (
              <CardPoolRiskyPosition
                key={p.id}
                payload={p}
                isTrader={isTrader}
                poolInfo={poolInfo}
                poolMetadata={poolMetadata}
              />
            ))}
            <LoadMore isLoading={loading} handleMore={fetchMore} />
          </S.InvestorRiskyPositionsListBody>
        </S.RiskyPositionsListWrp>
      )}
    </>
  )
}

export default PoolRiskyPositionsList
