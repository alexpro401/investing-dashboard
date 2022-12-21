import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { BigNumber } from "@ethersproject/bignumber"
import { debounce } from "lodash"

import { Flex } from "theme"
import CreateInsuranceAccidentPoolCard from "./CreateInsuranceAccidentPoolCard"
import CreateInsuranceAccidentPoolsSortButton from "./CreateInsuranceAccidentPoolsSortButton"
import { CreateInsuranceAccidentPoolsStyled as CIAPools } from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"
import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import CreateInsuranceAccidentNoInvestments from "./CreateInsuranceAccidentNoInvestments"
import { useWindowSize } from "react-use"
import PoolStatisticCard from "components/cards/PoolStatistic"

type FilterTVL = "ask" | "desc"

function sortByTVLCb(p1, p2, filter: FilterTVL) {
  const f1 = BigNumber.from(p1.priceHistory[0]?.usdTVL ?? "0")
  const f2 = BigNumber.from(p2.priceHistory[0]?.usdTVL ?? "0")

  if (f1.lt(f2)) {
    return filter === "ask" ? -1 : 1
  } else if (f1.gt(f2)) {
    return filter === "ask" ? 1 : -1
  } else {
    return 0
  }
}

interface Props {
  loading: boolean
  total: number
  payload: IPoolQuery[]
}

const CreateInsuranceAccidentPools: FC<Props> = ({
  loading,
  total,
  payload,
}) => {
  const { form, insurancePoolHaveTrades } = useContext(
    InsuranceAccidentCreatingContext
  )
  const { pool } = form

  const [noInvestments, setNoInvestments] = useState<boolean>(false)
  const [filterTVL, setFilterTVL] = useState<FilterTVL | undefined>(undefined)
  const toggleFilterTVL = useCallback(() => {
    switch (filterTVL) {
      case undefined:
        setFilterTVL("ask")
        break
      case "ask":
        setFilterTVL("desc")
        break
      case "desc":
      default:
        setFilterTVL(undefined)
    }
  }, [filterTVL])

  const onTogglePool = useCallback(
    (poolData: IPoolQuery) => {
      if (!poolData) return

      const same = pool.get === poolData.id
      pool.set(same ? "" : poolData.id)
    },
    [pool]
  )

  useEffect(() => {
    if (!payload || payload.length === 0) {
      return
    }

    if (pool.get === "") {
      insurancePoolHaveTrades.set(false)
    } else {
      const poolQuery = payload.filter((p) => p.id === pool.get)

      if (poolQuery[0]) {
        insurancePoolHaveTrades.set(Number(poolQuery[0].totalTrades) > 0)
      }
    }
  }, [pool.get, payload])

  useEffect(() => {
    debounce(() => {
      setNoInvestments(!loading && payload.length === 0)
    }, 100)
  }, [loading, payload])

  const { width: windowWidth } = useWindowSize()
  const isMobile = useMemo(() => windowWidth < 1194, [windowWidth])

  console.log(payload)

  const list = useMemo(() => {
    if (loading || (!loading && payload.length === 0)) {
      const items = Array(5).fill(null)
      return items.map((_, i) => (
        <CreateInsuranceAccidentPoolCard
          key={i}
          pool={_}
          onToggle={() => {
            return
          }}
          active={false}
        />
      ))
    }

    if (filterTVL === undefined) {
      return payload
        .sort((a, b) => (a.creationTime > b.creationTime ? -1 : 1))
        .map((p) =>
          isMobile ? (
            <CreateInsuranceAccidentPoolCard
              key={p.id}
              pool={p}
              onToggle={() => onTogglePool(p)}
              active={pool.get === p.id}
            />
          ) : (
            <CIAPools.Card
              key={p.id}
              onClick={() => onTogglePool(p)}
              active={pool.get === p.id}
            >
              <PoolStatisticCard data={p} isMobile={isMobile} />
            </CIAPools.Card>
          )
        )
    }

    return payload
      .sort((a, b) => sortByTVLCb(a, b, filterTVL))
      .map((p) =>
        isMobile ? (
          <CreateInsuranceAccidentPoolCard
            key={p.id}
            pool={p}
            onToggle={() => onTogglePool(p)}
            active={pool.get === p.id}
          />
        ) : (
          <CIAPools.Card
            key={p.id}
            onClick={() => onTogglePool(p)}
            active={pool.get === p.id}
          >
            <PoolStatisticCard data={p} isMobile={isMobile} />
          </CIAPools.Card>
        )
      )
  }, [loading, pool, payload, onTogglePool, filterTVL, isMobile])

  return (
    <>
      <CIAPools.Container>
        <Flex full ai="center" jc="space-between" gap="12" m="32px 0 16px">
          <CIAPools.Title>All funds I invested in: {total}</CIAPools.Title>
          <CreateInsuranceAccidentPoolsSortButton
            filter={filterTVL}
            onClick={toggleFilterTVL}
          />
        </Flex>
        <div>{list}</div>
      </CIAPools.Container>
      <CreateInsuranceAccidentNoInvestments
        open={noInvestments}
        setOpen={setNoInvestments}
      />
    </>
  )
}

export default CreateInsuranceAccidentPools
