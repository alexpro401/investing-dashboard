import { FC, useContext, useEffect, useMemo } from "react"
import { isEmpty, isNil } from "lodash"
import { useWeb3React } from "@web3-react/core"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"

import {
  StepsRoot,
  StepsBottomNavigation,
} from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import * as S from "../styled/step-check-settings"
import { Flex, Text } from "theme"
import usePoolPrice from "hooks/usePoolPrice"
import { normalizeBigNumber } from "utils"
import { addBignumbers, divideBignumbers } from "utils/formulas"
import Skeleton from "components/Skeleton"
import usePoolInvestorsByDay from "hooks/usePoolInvestorsByDay"
import useInvestorsInsuranceHistory from "hooks/useInvestorsInsuranceHistory"
import useInvestorsLpHistory from "hooks/useInvestorsLpHistory"
import CreateInsuranceAccidentMemberCard from "../components/CreateInsuranceAccidentMemberCard"
import { BigNumber } from "@ethersproject/bignumber"
import { ZERO } from "constants/index"
import useInvestorsLastPoolPosition from "hooks/useInvestorsLastPoolPosition"
import { Card, CardDescription, CardHead } from "common"
import { InsuranceAccidentInvestor } from "interfaces/insurance"
import { selectPoolByAddress } from "state/pools/selectors"
import { useSelector } from "react-redux"
import { AppState } from "state"
import { usePoolPriceHistoryDiff } from "hooks/usePool"

const TableRowSkeleton = (props) => (
  <S.TableRow gap="12px" {...props}>
    <Skeleton h="13px" />
    <Skeleton h="13px" />
    <Skeleton h="13px" />
    <Skeleton h="13px" />
  </S.TableRow>
)

function useInvestorsInAccident() {
  const { account } = useWeb3React()

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
    if (loading || noData || isNil(account)) {
      return []
    }

    return insuranceHistory.data
      .sort((a1) =>
        a1.investor.id === String(account).toLocaleLowerCase() ? -1 : 1
      )
      .reduce(
        (acc, h) => ({
          ...acc,
          [h.investor.id]: {
            ...h,
            poolPositionBeforeAccident: lpHistory.data[h.investor.id],
            poolPositionOnAccidentCreation: lpCurrent.data[h.investor.id],
          },
        }),
        {}
      )
  }, [loading, noData, insuranceHistory, lpHistory, lpCurrent, account])

  const totals = useMemo(() => {
    const InitialTotals = {
      users: 0,
      lp: { render: `LP 0`, value: ZERO },
      loss: {
        render: `$ 0`,
        value: ZERO,
      },
      coverage: {
        render: `DEXE 0`,
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
        }
      },
      { lp: ZERO, loss: ZERO, coverage: ZERO }
    )

    return {
      users: insuranceHistory.data.length,
      lp: { render: `LP ${normalizeBigNumber(res.lp, 18, 2)}`, value: res.lp },
      loss: {
        render: `$ ${normalizeBigNumber(res.loss, 18, 2)}`,
        value: res.loss,
      },
      coverage: {
        render: `DEXE ${normalizeBigNumber(res.coverage, 18, 2)}`,
        value: res.coverage,
      },
    }
  }, [loading, noData, insuranceHistory, lpHistory, lpCurrent])

  return {
    data: investorsIncludingInAccident,
    loading,
    noData,
    totals,
  }
}

const CreateInsuranceAccidentCheckSettingsStep: FC = () => {
  const { account } = useWeb3React()
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
    usePoolPriceHistoryDiff(point.get?.payload, poolData)

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
      investorsTotals.get.coverage === totals.coverage.value.toHexString()

    if ((emptyTotals && havePayload) || (havePayload && !isSame)) {
      investorsTotals.set({
        lp: totals.lp.value.toHexString(),
        loss: totals.loss.value.toHexString(),
        coverage: totals.coverage.value.toHexString(),
      })
    }
  }, [totals])

  const tableBody = useMemo(() => {
    if (loading) {
      return Array(10)
        .fill(null)
        .map((_, i) => <TableRowSkeleton key={i} />)
    }

    if (!loading && noData) {
      return (
        <Flex full ai="center" jc="center">
          <Text fz={16} fw={500} color="#e4f2ff">
            No investors
          </Text>
        </Flex>
      )
    }

    return (Object.values(data) as InsuranceAccidentInvestor[]).map((h) => {
      const isCurrentUser =
        h.investor.id === String(account).toLocaleLowerCase()
      return (
        <CreateInsuranceAccidentMemberCard
          key={h.investor.id}
          payload={h}
          color={isCurrentUser ? "#2669EB" : undefined}
          fw={isCurrentUser ? 600 : 400}
        />
      )
    })
  }, [account, data, loading, noData])

  return (
    <>
      <StepsRoot
        gap={"24"}
        dir={"column"}
        jc={"flex-start"}
        ai={"stretch"}
        p={"16px"}
        full
      >
        <Card>
          <CardHead
            nodeLeft={<CreateInsuranceAccidentCardStepNumber number={3} />}
            title="Сheck insurance proposal details"
          />
          <CardDescription>
            <p>
              тут ви бачете тотал інфу по всім учасникам фонду у яких була
              страховка
            </p>
          </CardDescription>
        </Card>
        <Flex full>
          <S.PNLGrid>
            <Card>
              <Text fz={16} fw={600} color="#E4F2FF" align="center">
                <>{initialPriceUSD}</>
              </Text>
              <Text fz={13} fw={500} color="#B1C7FC" align="center">
                Initial LP Price
              </Text>
            </Card>
            <Card>
              <Text fz={16} fw={600} color="#E4F2FF" align="center">
                <>{currentPriceUSD}</>
              </Text>
              <Text fz={13} fw={500} color="#B1C7FC" align="center">
                Current Price
              </Text>
            </Card>
            <Card>
              <Text fz={16} fw={600} color="#DB6D6D" align="center">
                <>{priceDiffUSD}</>
              </Text>
              <Text fz={13} fw={500} color="#B1C7FC" align="center">
                Difference
              </Text>
            </Card>
          </S.PNLGrid>
        </Flex>
        <Flex full>
          <S.Table>
            <S.TableHead>
              <S.TableRow>
                <S.TableCell>Members: {totals.users}</S.TableCell>
                <S.TableCell>Amount LP</S.TableCell>
                <S.TableCell>Loss $</S.TableCell>
                <S.TableCell>Сoverage DEXE</S.TableCell>
              </S.TableRow>
            </S.TableHead>
            <S.TableBody>{tableBody}</S.TableBody>
            <S.TableFooter>
              <S.TableRow fw={600}>
                <S.TableCell>Total:</S.TableCell>
                <S.TableCell>{totals.lp.render}</S.TableCell>
                <S.TableCell>{totals.loss.render}</S.TableCell>
                <S.TableCell>{totals.coverage.render}</S.TableCell>
              </S.TableRow>
            </S.TableFooter>
          </S.Table>
        </Flex>
      </StepsRoot>
      <StepsBottomNavigation />
    </>
  )
}

export default CreateInsuranceAccidentCheckSettingsStep
