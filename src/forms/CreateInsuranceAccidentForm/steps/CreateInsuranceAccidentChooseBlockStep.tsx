import { FC, useCallback, useContext, useEffect, useState } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { isNil, debounce } from "lodash"

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
import { formateChartData, getLP, getPNL } from "utils/formulas"
import { useERC20Data } from "state/erc20/hooks"
import TimeframeList from "components/TimeframeList"
import { expandTimestamp } from "utils"
import Input from "components/Input"
import { format } from "date-fns"
import { DATE_TIME_FORMAT } from "constants/time"
import DatePicker from "components/DatePicker"
import { InputGroup } from "../styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const CreateInsuranceAccidentChooseBlockStep: FC = () => {
  const { form, insuranceAccidentExist, poolPriceHistoryDueDate } = useContext(
    InsuranceAccidentCreatingContext
  )

  const { block, pool, date } = form

  const [, poolData] = usePoolContract(pool.get)
  const [baseTokenData] = useERC20Data(poolData?.parameters.baseToken)

  const [isDateOpen, setDateOpen] = useState<boolean>(false)
  const [timeframe, setTimeframe] = useState(TIMEFRAMES["M"])

  const [_searchBlock, _setSearchBlock] = useState(undefined)
  const [_searchDate, _setSearchDate] = useState(undefined)

  const [history, historyLoading, updateHistory] = usePriceHistory(
    pool.get,
    TIMEFRAME_AGREGATION_CODES[timeframe],
    TIMEFRAME_LIMIT_CODE[timeframe],
    _searchDate ? _searchDate : TIMEFRAME_FROM_DATE[timeframe],
    _searchBlock
  )
  const historyFormatted = formateChartData(history)

  const [currentPoint, setCurrentPoint] = useState<any | undefined>()
  useEffect(() => {
    if (history && history.length > 0) {
      const activeLabel = 1
      const payload = history[activeLabel] ?? {}
      const price = getLP(String(payload?.baseTVL), String(payload?.supply))

      setCurrentPoint({
        activeLabel,
        payload: {
          ...payload,
          price,
          pnl: getPNL(price),
        },
      })
    }
  }, [history])

  useEffect(() => {
    _setSearchDate(undefined)
    _setSearchBlock(undefined)
  }, [timeframe])

  useEffect(() => {
    if (currentPoint !== undefined) {
      const { payload } = currentPoint

      block.set(payload.block)
      date.set(String(payload.timestamp))
      poolPriceHistoryDueDate.set(payload)
    }
  }, [currentPoint])

  const onChoosePoint = useCallback(
    (p) => {
      if (currentPoint && p && currentPoint.activeLabel !== p.activeLabel) {
        setCurrentPoint({
          payload: p.activePayload[0].payload ?? {},
          activeLabel: p.activeLabel,
        })
      }
    },
    [currentPoint]
  )

  const onFieldChange = useCallback(
    (name, value) => {
      if (name === "block") {
        setTimeframe(TIMEFRAMES["M"])
        _setSearchBlock(!value || value.length === 0 ? "0" : value)
      } else if (name === "date") {
        setTimeframe(TIMEFRAMES["M"])
        _setSearchDate(value)
      }
      debounce(updateHistory, 750)
      form[name].set(value)
    },
    [form, updateHistory]
  )

  return (
    <>
      <StepsRoot gap={"24"} dir={"column"} ai={"stretch"} p={"16px"} full>
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
            activeDot={currentPoint}
            loading={historyLoading}
          />

          <TimeframeList current={timeframe} set={setTimeframe} />
          <InputGroup>
            <Input
              type="number"
              theme="clear"
              inputmode="decimal"
              placeholder="Block"
              value={block.get}
              onChange={(v) => onFieldChange("block", v)}
            />
            <div>
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
            </div>
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
