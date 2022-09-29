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
import { addBignumbers, divideBignumbers, getLP } from "utils/formulas"
import Skeleton from "components/Skeleton"
import usePoolInvestorsByDay from "hooks/usePoolInvestorsByDay"
import useInvestorsInsuranceHistory from "hooks/useInvestorsInsuranceHistory"
import useInvestorsLpHistory from "hooks/useInvestorsLpHistory"
import CreateInsuranceAccidentMemberCard from "../components/CreateInsuranceAccidentMemberCard"
import { BigNumber } from "@ethersproject/bignumber"
import { ZERO } from "constants/index"
import useInvestorsLastPoolPosition from "hooks/useInvestorsLastPoolPosition"
import { Card, CardDescription, CardHead } from "common"

const TableRowSkeleton = (props) => (
  <S.TableRow gap="12px" {...props}>
    <Skeleton h="13px" />
    <Skeleton h="13px" />
    <Skeleton h="13px" />
    <Skeleton h="13px" />
  </S.TableRow>
)

function useCheckSettingsStepPayload() {
  const { account } = useWeb3React()

  const { form } = useContext(InsuranceAccidentCreatingContext)
  const { date, pool } = form

  const [poolInvestors] = usePoolInvestorsByDay(date.get, pool.get)

  const investors = useMemo(() => {
    if (
      isNil(poolInvestors.data) ||
      isNil(poolInvestors.data.traderPoolHistories)
    ) {
      return undefined
    }

    return poolInvestors.data?.traderPoolHistories.reduce((acc, h) => {
      return [...acc, ...h.investors]
    }, [] as string[])
  }, [poolInvestors])

  const [insuranceHistory] = useInvestorsInsuranceHistory(date.get, investors)

  const [lpHistory] = useInvestorsLpHistory(
    date.get,
    !isEmpty(pool.get) ? [pool.get] : undefined,
    investors,
    (data) =>
      data.reduce(
        (acc, { investor, lpHistory, ...rest }) => ({
          ...acc,
          [investor.id]: { lpHistory: lpHistory[0], ...rest },
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

  return {
    insuranceHistory: {
      ...insuranceHistory,
      data: insuranceHistory.data
        ? insuranceHistory.data.sort((a1, a2) =>
            a1.investor.id === String(account).toLocaleLowerCase() ? -1 : 1
          )
        : insuranceHistory.data,
    },
    lpHistory,
    lpCurrent,
  }
}

const CreateInsuranceAccidentCheckSettingsStep: FC = () => {
  const { account } = useWeb3React()
  const { insuranceHistory, lpHistory, lpCurrent } =
    useCheckSettingsStepPayload()

  const { form, poolPriceHistoryDueDate, investorsTotals, investorsInfo } =
    useContext(InsuranceAccidentCreatingContext)

  const { pool } = form

  const [{ priceUSD }] = usePoolPrice(pool.get)

  const initialPrice = useMemo(() => {
    if (isEmpty(poolPriceHistoryDueDate.get)) {
      return <Skeleton w="120px" h="16px" />
    }

    const { baseTVL, supply } = poolPriceHistoryDueDate.get
    const price = getLP(String(baseTVL), String(supply))

    return `$ ${price}`
  }, [poolPriceHistoryDueDate])

  const currentPrice = useMemo(() => {
    if (isNil(priceUSD)) {
      return <Skeleton w="120px" h="16px" />
    }

    return `$ ${normalizeBigNumber(priceUSD, 18, 2)}`
  }, [priceUSD])

  const priceDiff = useMemo(() => {
    if (isEmpty(poolPriceHistoryDueDate.get) || isNil(priceUSD)) {
      return <Skeleton w="120px" h="16px" />
    }

    const { baseTVL, supply } = poolPriceHistoryDueDate.get
    const initial = getLP(String(baseTVL), String(supply))

    const diff = Math.abs(
      Number(normalizeBigNumber(priceUSD, 18, 2)) - Number(initial)
    ).toFixed(2)

    return `$ ${diff}`
  }, [poolPriceHistoryDueDate, priceUSD])

  const accidentMembersCount = useMemo(() => {
    if (insuranceHistory.fetching || isNil(insuranceHistory.data)) {
      return 0
    }
    return insuranceHistory.data.length
  }, [insuranceHistory])

  const prepareTableData = useMemo(() => {
    return (
      insuranceHistory.fetching ||
      lpHistory.fetching ||
      lpCurrent.fetching ||
      isNil(insuranceHistory.data) ||
      isNil(lpHistory.data) ||
      isNil(lpCurrent.data)
    )
  }, [insuranceHistory, lpHistory])

  const totals = useMemo(() => {
    const InitialTotals = {
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
    if (
      insuranceHistory.fetching ||
      lpHistory.fetching ||
      lpCurrent.fetching ||
      isNil(insuranceHistory.data) ||
      isNil(lpHistory.data) ||
      isNil(lpCurrent.data)
    ) {
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
            [BigNumber.from(lp.lpHistory.currentLpAmount), 18]
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
  }, [insuranceHistory, lpHistory, lpCurrent])

  useEffect(() => {
    if (!prepareTableData) {
      investorsInfo.set({
        insuranceHistory: insuranceHistory.data,
        lpHistory: lpHistory.data,
        lpCurrent: lpCurrent.data,
      })
    }
  }, [prepareTableData])

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

  return (
    <>
      <StepsRoot gap={"24"} dir={"column"} ai={"stretch"} p={"16px"} full>
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
                <>{initialPrice}</>
              </Text>
              <Text fz={13} fw={500} color="#B1C7FC" align="center">
                Initial LP Price
              </Text>
            </Card>
            <Card>
              <Text fz={16} fw={600} color="#E4F2FF" align="center">
                <>{currentPrice}</>
              </Text>
              <Text fz={13} fw={500} color="#B1C7FC" align="center">
                Current Price
              </Text>
            </Card>
            <Card>
              <Text fz={16} fw={600} color="#DB6D6D" align="center">
                <>{priceDiff}</>
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
                <S.TableCell>Members: {accidentMembersCount}</S.TableCell>
                <S.TableCell>Amount LP</S.TableCell>
                <S.TableCell>Loss $</S.TableCell>
                <S.TableCell>Сoverage DEXE</S.TableCell>
              </S.TableRow>
            </S.TableHead>
            <S.TableBody>
              {prepareTableData
                ? Array(10)
                    .fill(null)
                    .map((_, i) => <TableRowSkeleton key={i} />)
                : insuranceHistory.data.map((h) => {
                    const isCurrentUser =
                      h.investor.id === String(account).toLowerCase()
                    return (
                      <CreateInsuranceAccidentMemberCard
                        key={h.investor.id}
                        payload={h}
                        lpHistory={lpHistory.data[h.investor.id]}
                        lpCurrent={lpCurrent.data[h.investor.id]}
                        color={isCurrentUser ? "#2669EB" : undefined}
                        fw={isCurrentUser ? 600 : 400}
                      />
                    )
                  })}
            </S.TableBody>
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
