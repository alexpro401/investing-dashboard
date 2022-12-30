import * as React from "react"
import { map } from "lodash"

import S from "./styled"
import { TIMEFRAME } from "consts/chart"

interface Props {
  current: TIMEFRAME
  set: (timeframe: TIMEFRAME) => void
}

const Timeframe: React.FC<Props> = ({ current, set }) => {
  return (
    <S.Container>
      {map(Object.values(TIMEFRAME), (tf) => (
        <S.Item key={tf} onClick={() => set(tf)} active={tf === current}>
          {tf}
        </S.Item>
      ))}
    </S.Container>
  )
}

export default Timeframe
