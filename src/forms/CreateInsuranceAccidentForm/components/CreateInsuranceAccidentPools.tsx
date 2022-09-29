import { FC, useCallback, useContext, useMemo, useState } from "react"
import { BigNumber } from "@ethersproject/bignumber"

import { Flex } from "theme"
import CreateInsuranceAccidentPoolCard from "./CreateInsuranceAccidentPoolCard"
import CreateInsuranceAccidentPoolsSortButton from "./CreateInsuranceAccidentPoolsSortButton"
import { CreateInsuranceAccidentPoolsStyled as CIAPools } from "forms/CreateInsuranceAccidentForm/styled"
import { InsuranceAccidentCreatingContext } from "context/InsuranceAccidentCreatingContext"

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
  payload: any[]
}

const CreateInsuranceAccidentPools: FC<Props> = ({
  loading,
  total,
  payload,
}) => {
  const { form } = useContext(InsuranceAccidentCreatingContext)
  const { pool } = form

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
    (id) => {
      if (!id) return
      pool.set(pool.get === id ? "" : id)
    },
    [pool]
  )

  const list = useMemo(() => {
    if (loading) {
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

    if (!loading && payload.length === 0) {
      return (
        <>
          <p>You not invested in any fond yet.</p>
          <button>Choose pool to invest</button>
        </>
      )
    }

    if (filterTVL === undefined) {
      return payload
        .sort((a, b) => (a.creationTime > b.creationTime ? -1 : 1))
        .map((p) => (
          <CreateInsuranceAccidentPoolCard
            key={p.id}
            pool={p}
            onToggle={() => onTogglePool(p.id)}
            active={pool.get === p.id}
          />
        ))
    }

    return payload
      .sort((a, b) => sortByTVLCb(a, b, filterTVL))
      .map((p) => (
        <CreateInsuranceAccidentPoolCard
          key={p.id}
          pool={p}
          onToggle={() => onTogglePool(p.id)}
          active={pool.get === p.id}
        />
      ))
  }, [loading, pool, payload, onTogglePool, filterTVL])

  return (
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
  )
}

export default CreateInsuranceAccidentPools
