import { FC, useCallback, useContext, useEffect, useState } from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { isNil, debounce } from "lodash"

import CreateInsuranceAccidentCardHead from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardHead"
import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"

import {
  Content,
  CreateInsuranceAccidentCard as CIACard,
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
  const { form, insuranceAccidentExist } = useContext(
    InsuranceAccidentCreatingContext
  )

  const [, poolData] = usePoolContract(form?.pool.get)
  const [baseTokenData] = useERC20Data(poolData?.parameters.baseToken)

  const [isDateOpen, setDateOpen] = useState<boolean>(false)
  const [timeframe, setTimeframe] = useState(TIMEFRAMES["M"])

  const [_searchBlock, _setSearchBlock] = useState(undefined)
  const [_searchDate, _setSearchdate] = useState(undefined)

  const [history, historyLoading, updateHistory] = usePriceHistory(
    form?.pool.get,
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
    _setSearchdate(undefined)
    _setSearchBlock(undefined)
  }, [timeframe])

  useEffect(() => {
    if (currentPoint !== undefined && form) {
      form?.block.set(currentPoint.payload.block)
      form?.date.set(String(currentPoint.payload.timestamp))
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
        _setSearchdate(value)
      }
      debounce(updateHistory, 750)
      form?.[name].set(value)
    },
    [form, updateHistory]
  )

  return (
    <>
      <Content>
        <CIACard.Container>
          <CreateInsuranceAccidentCardHead
            icon={<CreateInsuranceAccidentCardStepNumber number={2} />}
            title="Determine the price of insured event"
          />
          <CIACard.Description>
            <p>
              Введите блок или дату перед страховым случаем
              <br />
              (когда все было норм).
            </p>
          </CIACard.Description>
        </CIACard.Container>

        <CIACard.Container m="24px 0 0">
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
              value={form?.block.get}
              onChange={(v) => onFieldChange("block", v)}
            />
            <div>
              <Input
                disabled
                theme="clear"
                value={format(
                  expandTimestamp(Number(form?.date.get)),
                  DATE_TIME_FORMAT
                )}
                placeholder="DD/MM/YYYY, HH"
                onClick={() => setDateOpen(!isDateOpen)}
              />
            </div>
          </InputGroup>
        </CIACard.Container>
      </Content>
      {!isNil(insuranceAccidentExist) && (
        <InsuranceAccidentExist
          isOpen={insuranceAccidentExist.get}
          onClose={() => insuranceAccidentExist.set(false)}
        />
      )}
      <DatePicker
        isOpen={isDateOpen}
        timestamp={expandTimestamp(Number(form?.date.get))}
        toggle={() => setDateOpen(false)}
        onChange={(v) => onFieldChange("date", String(v))}
      />
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
