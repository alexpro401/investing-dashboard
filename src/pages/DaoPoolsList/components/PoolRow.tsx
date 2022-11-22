import * as React from "react"
import { areEqual, ListChildComponentProps } from "react-window"
import { IGovPoolQuery } from "interfaces/thegraphs/gov-pools"
import { Indents } from "../styled"
import { To } from "theme"
import { DaoPoolCard } from "common"

interface Props {
  payload: ListChildComponentProps<IGovPoolQuery[]>
  account?: string | null
}

const PoolRow: React.FC<Props> = ({ payload, account }) => {
  const { data, index, style } = payload

  const pool = React.useMemo(() => data[index], [data, index])

  return (
    <Indents style={style}>
      <To to={`/dao/${pool.id}`}>
        <DaoPoolCard data={pool} account={account} index={index} />
      </To>
    </Indents>
  )
}

export default React.memo(PoolRow, areEqual)
