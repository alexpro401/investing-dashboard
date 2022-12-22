import {
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { createClient, Provider as GraphProvider } from "urql"
import { isEmpty, isEqual, isNil } from "lodash"
import { Tooltip } from "recharts"
import { format } from "date-fns"

import CreateInsuranceAccidentCardStepNumber from "forms/CreateInsuranceAccidentForm/components/CreateInsuranceAccidentCardStepNumber"

import { Card, CardDescription, CardHead } from "common"

import { StepsRoot } from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import { usePoolContract, usePoolQuery } from "hooks/usePool"

import {
  CHART_TYPE,
  TIMEFRAME,
  TIMEFRAME_FROM_DATE,
  TIMEFRAME_LIMIT_CODE,
  TIMEFRAME_AGGREGATION_CODE,
} from "constants/chart"
import { usePriceHistory } from "state/pools/hooks"
import { generatePoolPnlHistory, getLP, getPNL } from "utils/formulas"
import { useERC20Data } from "state/erc20/hooks"
import { expandTimestamp } from "utils"
import Input from "components/Input"
import { DATE_FORMAT, DATE_TIME_FORMAT } from "constants/time"
import DatePicker from "components/DatePicker"
import { InputGroup } from "../styled"
import Skeleton from "components/Skeleton"
import Chart from "components/Chart"
import theme, { Text } from "theme"
import { ChartTooltipPnl } from "components/Chart/tooltips"
import { AlertType } from "context/AlertContext"
import { useAlert, useBreakpoints } from "hooks"
import { DEFAULT_ALERT_HIDDEN_TIMEOUT } from "constants/misc"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const CreateInsuranceAccidentChooseBlockStep: FC = () => {
  const { isMobile } = useBreakpoints()
  const [showAlert] = useAlert()
  const { form, chart } = useContext(InsuranceAccidentCreatingContext)

  const { block, pool, date } = form
  const { forPool, timeframe, data, point } = chart

  const [poolQuery] = usePoolQuery(pool.get)
  const [, poolData] = usePoolContract(pool.get)
  const [baseTokenData] = useERC20Data(poolData?.parameters.baseToken)

  const [isDateOpen, setDateOpen] = useState<boolean>(false)

  const [pause, setPause] = useState(true)
  const [history, historyLoading] = usePriceHistory(
    pool.get,
    TIMEFRAME_AGGREGATION_CODE[timeframe.get],
    TIMEFRAME_LIMIT_CODE[timeframe.get],
    !isNil(date.get) && !isEmpty(date.get)
      ? Number(date.get)
      : TIMEFRAME_FROM_DATE[timeframe.get],
    !isEmpty(block.get) ? Number(block.get) : undefined,
    pause
  )

  const historyFormatted = generatePoolPnlHistory(
    !isEmpty(data.get) ? data.get : []
  )

  useEffect(() => {
    if (!historyLoading && isEmpty(history) && isEmpty(data)) {
      const tfList = Object.values(TIMEFRAME)
      const currentTfIndex = tfList.indexOf(timeframe.get)

      if (currentTfIndex > 0) {
        timeframe.set(tfList[currentTfIndex - 1])
      } else {
        showAlert({
          content: "Sorry, but still no tracked data about pool price",
          type: AlertType.warning,
          hideDuration: DEFAULT_ALERT_HIDDEN_TIMEOUT,
        })
      }
    }
  }, [history, historyLoading])

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
      timeframe.set(TIMEFRAME.m)
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
    if (
      !historyLoading &&
      !isNil(point.get.payload?.timestamp) &&
      !isEmpty(point.get.payload?.timestamp)
    ) {
      block.set(point.get.payload.block)
      date.set(String(point.get.payload?.timestamp))
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
        const chosenPoint = {
          payload: p.activePayload[0].payload ?? {},
          activeLabel: p.activeLabel,
        }
        point.set(chosenPoint)
      }
    },
    [point]
  )

  const onFieldChange = useCallback((name, value) => {
    setPause(true)
    if (name === "block") {
      block.set(!value || value.length === 0 ? "" : value)
      date.set("")
      timeframe.set(TIMEFRAME.m)
    } else if (name === "date") {
      date.set(value)
      block.set("")
      timeframe.set(TIMEFRAME.m)
    }
    setPause(false)
  }, [])

  const onTimeframeChange = useCallback((value) => {
    timeframe.set(value)
    date.set("")
    block.set("")
    setPause(false)
  }, [])

  const chartNodeLeft = useMemo(() => {
    let price: ReactNode = <Skeleton w="100px" h="19px" />
    let date: ReactNode = <Skeleton w="120px" h="15px" />

    if (!isEmpty(point.get) && !isNil(point.get.payload.price)) {
      price = `$${point.get.payload.price}`
    }
    if (!isEmpty(point.get) && !isNil(point.get.payload.timestamp)) {
      date = format(expandTimestamp(point.get.payload.timestamp), DATE_FORMAT)
    }

    return (
      <div>
        <Text block fz={16} fw={700} lh="19px" color="#E4F2FF">
          {price}
        </Text>
        <Text block fz={13} fw={500} lh="15px" color="#B1C7FC">
          {date}
        </Text>
      </div>
    )
  }, [point])

  const [_block, _setBlock] = useState(block.get ?? "")

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isEqual(block.get, _block)) {
        onFieldChange("block", _block)
      }
    }, 750)

    return () => clearTimeout(timeout)
  }, [_block])

  useEffect(() => {
    if (!isEqual(block.get, _block)) {
      _setBlock(block.get ?? "")
    }
  }, [block.get])

  return (
    <>
      <StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateInsuranceAccidentCardStepNumber number={2} />}
            title="Determine the price of insured event"
          />
          <CardDescription>
            <p>
              Чтобы определить цену для страховой компенсации выберите дату
              непосредственно до того как произошел страховой случай. Также вы
              можете вписать соответствующий блок.
            </p>
          </CardDescription>
        </Card>

        <Card>
          <Chart
            nodeHeadLeft={chartNodeLeft}
            type={CHART_TYPE.area}
            activePoint={point}
            data={historyFormatted}
            chart={{
              onClick: onChoosePoint,
              stackOffset: "silhouette",
            }}
            chartItems={[
              {
                type: "linear",
                dataKey: "price",
                legendType: "triangle",
                isAnimationActive: false,
                stroke: theme.brandColors.secondary,
              },
            ]}
            timeframe={{ get: timeframe.get, set: onTimeframeChange }}
            timeframePosition="bottom"
            loading={
              historyLoading || (!historyLoading && isNil(historyFormatted))
            }
          >
            <Tooltip
              content={(p) => {
                return <ChartTooltipPnl {...p} baseToken={baseTokenData} />
              }}
            />
          </Chart>

          <InputGroup>
            <Input
              type="number"
              theme="clear"
              inputmode="decimal"
              placeholder="Block"
              value={_block}
              onChange={_setBlock}
            />
            <Input
              disabled
              theme="clear"
              value={
                format(expandTimestamp(Number(date.get)), DATE_TIME_FORMAT) ??
                ""
              }
              placeholder="DD/MM/YYYY, HH"
              onClick={() => setDateOpen(!isDateOpen)}
            />
          </InputGroup>
        </Card>
      </StepsRoot>

      <DatePicker
        isOpen={isDateOpen}
        timestamp={expandTimestamp(Number(date.get))}
        toggle={() => setDateOpen(false)}
        minDate={new Date(expandTimestamp(poolQuery?.creationTime ?? 0))}
        maxDate={new Date()}
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
