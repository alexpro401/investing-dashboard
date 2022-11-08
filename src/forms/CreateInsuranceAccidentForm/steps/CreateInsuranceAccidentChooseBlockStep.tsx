import { FC, useCallback, useContext, useEffect, useState } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { isNil, isEmpty } from "lodash"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"

import { Card, CardDescription, CardHead } from "common"

import {
  StepsRoot,
  StepsBottomNavigation,
} from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import InsuranceAccidentChart from "components/InsuranceAccidentChart"
import InsuranceAccidentExist from "modals/InsuranceAccidentExist"
import { usePoolContract } from "hooks/usePool"

import {
  TIMEFRAME_AGREGATION_CODES,
  TIMEFRAME_FROM_DATE,
  TIMEFRAME_LIMIT_CODE,
  TIMEFRAMES,
} from "constants/history"
import { usePriceHistory } from "state/pools/hooks"
import { generatePoolPnlHistory, getLP, getPNL } from "utils/formulas"
import { useERC20Data } from "state/erc20/hooks"
import TimeframeList from "components/TimeframeList"
import { expandTimestamp } from "utils"
import Input from "components/Input"
import { format } from "date-fns"
import { DATE_TIME_FORMAT } from "constants/time"
import DatePicker from "components/DatePicker"
import { InputGroup } from "../styled"
import Skeleton from "components/Skeleton"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const CreateInsuranceAccidentChooseBlockStep: FC = () => {
  const { form, insuranceAccidentExist, chart } = useContext(
    InsuranceAccidentCreatingContext
  )

  const { block, pool, date } = form
  const { forPool, timeframe, data, point } = chart

  const [, poolData] = usePoolContract(pool.get)
  const [baseTokenData] = useERC20Data(poolData?.parameters.baseToken)

  const [isDateOpen, setDateOpen] = useState<boolean>(false)

  const [pause, setPause] = useState(true)
  const [history, historyLoading] = usePriceHistory(
    pool.get,
    TIMEFRAME_AGREGATION_CODES[timeframe.get],
    TIMEFRAME_LIMIT_CODE[timeframe.get],
    !isNil(date.get) && !isEmpty(date.get)
      ? Number(date.get)
      : TIMEFRAME_FROM_DATE[timeframe.get],
    !isEmpty(block.get) ? Number(block.get) : undefined,
    pause
  )

  const historyFormatted = generatePoolPnlHistory(
    !isEmpty(data.get) ? data.get : undefined
  )

  useEffect(() => {
    if (history && history.length > 0) {
      const activeLabel = 1
      const payload = history[activeLabel] ?? {}
      const price = getLP(String(payload?.baseTVL), String(payload?.supply))

      const newPoint = {
        activeLabel,
        payload: {
          ...payload,
          price,
          pnl: getPNL(price),
        },
      }

      point.set(newPoint)
      data.set(history)
      setPause(true)
    }
  }, [history])

  useEffect(() => {
    if (isEmpty(data.get)) {
      setPause(false)
    }

    if (isEmpty(forPool.get) || pool.get !== forPool.get) {
      timeframe.set(TIMEFRAMES["M"])
      data.set([])
      date.set("")
      block.set("")
      setPause(false)
    }

    return () => {
      forPool.set(pool.get)
    }
  }, [])

  useEffect(() => {
    if (!isEmpty(point.get) && !historyLoading) {
      block.set(point.get.payload.block)
      date.set(String(point.get.payload.timestamp))
    }
  }, [point])

  const onChoosePoint = useCallback(
    (p) => {
      if (
        !isNil(p) &&
        !isNil(p.activeLabel) &&
        point.get.activeLabel !== p.activeLabel &&
        !isNil(p.activePayload[0].payload)
      ) {
        point.set({
          payload: p.activePayload[0].payload ?? {},
          activeLabel: p.activeLabel,
        })
      }
    },
    [point]
  )

  const onFieldChange = useCallback((name, value) => {
    setPause(true)
    if (name === "block") {
      block.set(!value || value.length === 0 ? "" : value)
      date.set("")
      timeframe.set(TIMEFRAMES["M"])
    } else if (name === "date") {
      date.set(value)
      block.set("")
      timeframe.set(TIMEFRAMES["M"])
    }
    setPause(false)
  }, [])

  const onTimeframeChange = useCallback((value) => {
    timeframe.set(value)
    date.set("")
    block.set("")
    setPause(false)
  }, [])

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
            nodeLeft={<CreateInsuranceAccidentCardStepNumber number={2} />}
            title="Determine the price of insured event"
          />
          <CardDescription>
            <p>
              Введите блок или дату перед страховым случаем
              <br />
              (когда все было норм).
            </p>
          </CardDescription>
        </Card>

        <Card>
          <InsuranceAccidentChart
            data={historyFormatted}
            baseToken={baseTokenData}
            onPointClick={onChoosePoint}
            activeDot={point.get}
            loading={
              historyLoading ||
              isNil(historyFormatted) ||
              isEmpty(historyFormatted)
            }
          />

          <TimeframeList current={timeframe.get} set={onTimeframeChange} />
          <InputGroup>
            {isEmpty(block.get) ? (
              <Skeleton h="50px" w="100%" radius="16px 0 0 16px" />
            ) : (
              <Input
                type="number"
                theme="clear"
                inputmode="decimal"
                placeholder="Block"
                value={block.get}
                onChange={(v) => onFieldChange("block", v)}
              />
            )}
            {isEmpty(date.get) ? (
              <Skeleton h="50px" w="100%" radius="0 16px 16px 0" />
            ) : (
              <Input
                disabled
                theme="clear"
                value={format(
                  expandTimestamp(Number(date.get)),
                  DATE_TIME_FORMAT
                )}
                placeholder="DD/MM/YYYY, HH"
                onClick={() => setDateOpen(!isDateOpen)}
              />
            )}
          </InputGroup>
        </Card>
      </StepsRoot>
      <StepsBottomNavigation />

      <DatePicker
        isOpen={isDateOpen}
        timestamp={expandTimestamp(Number(date.get))}
        toggle={() => setDateOpen(false)}
        onChange={(v) => onFieldChange("date", String(v))}
      />
      {!isNil(insuranceAccidentExist) && (
        <InsuranceAccidentExist
          isOpen={insuranceAccidentExist.get}
          onClose={() => insuranceAccidentExist.set(false)}
        />
      )}
    </>
  )
}

const CreateInsuranceAccidentChooseBlockStepWithProvider = (props) => {
  return (
    <GraphProvider value={poolsClient}>
      <CreateInsuranceAccidentChooseBlockStep {...props} />
    </GraphProvider>
  )
}

export default CreateInsuranceAccidentChooseBlockStepWithProvider
