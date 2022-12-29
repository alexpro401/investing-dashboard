import { FC, useContext, useEffect, useMemo } from "react"
import { isEmpty, isNil } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { v4 as uuidv4 } from "uuid"
import { BigNumber } from "@ethersproject/bignumber"
import { useSelector } from "react-redux"

import * as S from "../styled/step-check-settings"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"

import {
  StepsRoot,
  CreateInsuranceAccidentTopCard,
  CreateInsuranceAccidentTopCardHead,
  CreateInsuranceAccidentTopCardDescription,
} from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import theme, { Flex, Text } from "theme"
import { normalizeBigNumber } from "utils"
import {
  addBignumbers,
  divideBignumbers,
  multiplyBignumbers,
} from "utils/formulas"
import usePoolInvestorsByDay from "hooks/usePoolInvestorsByDay"
import useInvestorsInsuranceHistory from "hooks/useInvestorsInsuranceHistory"
import useInvestorsLpHistory from "hooks/useInvestorsLpHistory"
import PoolPriceDiff from "components/PoolPriceDiff"
import { ZERO } from "constants/index"
import useInvestorsLastPoolPosition from "hooks/useInvestorsLastPoolPosition"
import { InsuranceAccidentMembersTable } from "common"
import { selectPoolByAddress } from "state/pools/selectors"
import { AppState } from "state"
import { usePoolPriceHistoryDiff } from "hooks/usePool"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { selectDexeAddress } from "state/contracts/selectors"
import { useBreakpoints } from "hooks"
import Tooltip from "components/Tooltip"

function useInvestorsInAccident() {
  const { account } = useWeb3React()

  const dexeAddress = useSelector(selectDexeAddress)
  const dexePriceUSD = useTokenPriceOutUSD({
    tokenAddress: dexeAddress,
  })

  const { form } = useContext(InsuranceAccidentCreatingContext)
  const { date, pool } = form

  const [poolInvestors] = usePoolInvestorsByDay(date.get, pool.get)

  const investors = useMemo(() => {
    if (
      isNil(account) ||
      isNil(poolInvestors.data) ||
      isNil(poolInvestors.data.traderPoolHistories)
    ) {
      return undefined
    }

    const _investors = poolInvestors.data?.traderPoolHistories.reduce(
      (acc, h) => [...acc, ...h.investors],
      [] as string[]
    )

    if (!_investors?.includes(String(account).toLocaleLowerCase())) {
      return [String(account).toLocaleLowerCase(), ..._investors]
    }

    return _investors
  }, [poolInvestors, account])

  const [insuranceHistory] = useInvestorsInsuranceHistory(date.get, investors)

  const [lpHistory] = useInvestorsLpHistory(
    date.get,
    !isEmpty(pool.get) ? [pool.get] : undefined,
    investors,
    (data) =>
      data.reduce(
        (acc, { investor, lpHistory, ...rest }) => ({
          ...acc,
          [investor.id]: { lpHistory: lpHistory, ...rest },
        }),
        {}
      )
  )

  const [lpCurrent] = useInvestorsLastPoolPosition(
    pool.get,
    investors,
    (data) =>
      data.reduce(
        (acc, { investor, ...rest }) => ({
          ...acc,
          [investor.id]: { ...rest },
        }),
        {}
      )
  )

  const loading = useMemo(
    () =>
      isNil(investors) ||
      insuranceHistory.fetching ||
      lpHistory.fetching ||
      lpCurrent.fetching,
    [investors, insuranceHistory, lpHistory, lpCurrent]
  )
  const noData = useMemo(
    () =>
      isNil(insuranceHistory.data) ||
      isEmpty(insuranceHistory.data) ||
      isNil(lpHistory.data) ||
      isEmpty(lpHistory.data) ||
      isNil(lpCurrent.data) ||
      isEmpty(lpCurrent.data),
    [insuranceHistory, lpHistory, lpCurrent]
  )

  const investorsIncludingInAccident = useMemo(() => {
    if (loading || noData || isNil(account) || dexePriceUSD.isZero()) {
      return []
    }

    return insuranceHistory.data
      .sort((a1) =>
        a1.investor.id === String(account).toLocaleLowerCase() ? -1 : 1
      )
      .reduce((acc, h) => {
        return {
          ...acc,
          [h.investor.id]: {
            ...h,
            poolPositionBeforeAccident: lpHistory.data[h.investor.id],
            poolPositionOnAccidentCreation: lpCurrent.data[h.investor.id],
            stakeUSD: multiplyBignumbers(
              [BigNumber.from(h.stake).mul(10), 18],
              [dexePriceUSD, 18]
            ).toString(),
          },
        }
      }, {})
  }, [
    loading,
    noData,
    insuranceHistory,
    lpHistory,
    lpCurrent,
    account,
    dexePriceUSD,
  ])

  const totals = useMemo(() => {
    const InitialTotals = {
      users: "0",
      lp: { render: `LP 0`, value: ZERO },
      loss: {
        render: `$ 0`,
        value: ZERO,
      },
      coverage: {
        render: `DEXE 0`,
        value: ZERO,
      },
      coverageUSD: {
        render: `0`,
        value: ZERO,
      },
    }
    if (loading || noData) {
      return InitialTotals
    }

    function calcLossOnIteration(prevLoss, currentLPInvest, currentLPDivest) {
      const currentLPVolume = divideBignumbers(
        [BigNumber.from(currentLPInvest), 18],
        [BigNumber.from(currentLPDivest), 18]
      ).abs()

      return addBignumbers([prevLoss, 18], [currentLPVolume, 18])
    }

    const res = insuranceHistory.data.reduce(
      (res, h) => {
        const lp = lpHistory.data[h.investor.id]
        const { totalLPInvestVolume, totalLPDivestVolume } =
          lpCurrent.data[h.investor.id]

        return {
          ...res,
          lp: addBignumbers(
            [res.lp, 18],
            [BigNumber.from(lp.lpHistory[0].currentLpAmount), 18]
          ),
          loss: calcLossOnIteration(
            res.loss,
            totalLPInvestVolume,
            totalLPDivestVolume
          ),
          coverage: addBignumbers(
            [res.coverage, 18],
            [BigNumber.from(h.stake).mul(10), 18]
          ),
          coverageUSD: addBignumbers(
            [res.coverageUSD, 18],
            [BigNumber.from(h.stake).mul(10), 18]
          ),
        }
      },
      { lp: ZERO, loss: ZERO, coverage: ZERO, coverageUSD: ZERO }
    )

    return {
      users: String(insuranceHistory.data.length),
      lp: { render: `LP ${normalizeBigNumber(res.lp, 18, 2)}`, value: res.lp },
      loss: {
        render: `$ ${normalizeBigNumber(res.loss, 18, 2)}`,
        value: res.loss,
      },
      coverage: {
        render: `DEXE ${normalizeBigNumber(res.coverage, 18, 2)}`,
        value: res.coverage,
      },
      coverageUSD: {
        render: normalizeBigNumber(res.coverageUSD, 18, 2),
        value: res.coverageUSD,
      },
    }
  }, [loading, noData, insuranceHistory, lpHistory, lpCurrent, dexePriceUSD])

  return {
    data: investorsIncludingInAccident,
    loading,
    noData,
    totals,
  }
}

const CreateInsuranceAccidentCheckSettingsStep: FC = () => {
  const { data, totals, loading, noData } = useInvestorsInAccident()

  const {
    form,
    chart,
    investorsTotals,
    investorsInfo,
    insurancePoolLastPriceHistory,
  } = useContext(InsuranceAccidentCreatingContext)

  const { pool } = form
  const { point } = chart

  const poolData = useSelector((s: AppState) =>
    selectPoolByAddress(s, pool.get)
  )

  const { initialPriceUSD, currentPriceUSD, priceDiffUSD } =
    usePoolPriceHistoryDiff(point.get?.payload, poolData?.priceHistory[0])

  useEffect(() => {
    if (!isNil(poolData)) {
      insurancePoolLastPriceHistory.set(poolData.priceHistory[0] ?? {})
    }
  }, [poolData])

  useEffect(() => {
    if (!loading && !noData) {
      investorsInfo.set(data)
    }
  }, [loading, noData])

  useEffect(() => {
    const emptyTotals = isEmpty(investorsTotals.get)
    const havePayload = !isNil(totals)
    const isSame =
      !isEmpty(investorsTotals.get) &&
      investorsTotals.get.lp === totals.lp.value.toHexString() &&
      investorsTotals.get.loss === totals.loss.value.toHexString() &&
      investorsTotals.get.coverage === totals.coverage.value.toHexString() &&
      investorsTotals.get.coverageUSD === totals.coverageUSD.value.toHexString()

    if ((emptyTotals && havePayload) || (havePayload && !isSame)) {
      investorsTotals.set({
        users: totals.users,
        lp: totals.lp.value.toHexString(),
        loss: totals.loss.value.toHexString(),
        coverage: totals.coverage.value.toHexString(),
        coverageUSD: totals.coverageUSD.value.toHexString(),
      })
    }
  }, [totals])

  const { isMobile } = useBreakpoints()

  return (
    <>
      <StepsRoot>
        <CreateInsuranceAccidentTopCard>
          <CreateInsuranceAccidentTopCardHead
            nodeLeft={
              isMobile && <CreateInsuranceAccidentCardStepNumber number={3} />
            }
            title="Сheck insurance proposal details"
          />
          <CreateInsuranceAccidentTopCardDescription>
            <p>
              тут ви бачете тотал інфу по всім учасникам фонду у яких була
              страховка
            </p>
          </CreateInsuranceAccidentTopCardDescription>
        </CreateInsuranceAccidentTopCard>
        <Flex full>
          <PoolPriceDiff
            initialPriceUSD={initialPriceUSD}
            currentPriceUSD={currentPriceUSD}
            priceDiffUSD={priceDiffUSD}
          />
        </Flex>
        {!isMobile && (
          <Flex full ai={"center"} jc={"flex-start"} m={"34px 0 0"} gap={"8"}>
            <Tooltip id={uuidv4()}>
              Все участники Все участники Все участники Все участники
            </Tooltip>
            <Text fw={700} fz={16} lh={"19px"} color={theme.textColors.primary}>
              Все участники
            </Text>
          </Flex>
        )}
        <S.TableCard>
          <InsuranceAccidentMembersTable
            totals={{
              users: totals.users,
              lp: totals.lp.render,
              loss: totals.loss.render,
              coverage: totals.coverage.render,
            }}
            data={data}
            loading={loading}
            noData={noData}
          />
        </S.TableCard>
      </StepsRoot>
    </>
  )
}

export default CreateInsuranceAccidentCheckSettingsStep
