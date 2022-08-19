import { TIMEFRAMES } from "constants/history"

import S from "./styled"

interface IProps {
  current: string
  set: (tf: string) => void
}

const TimeframeList: React.FC<IProps> = ({ current, set }) => {
  return (
    <S.Container>
      {Object.values(TIMEFRAMES).map((tf) => (
        <S.Item key={tf} onClick={() => set(tf)} active={tf === current}>
          {tf}
        </S.Item>
      ))}
    </S.Container>
  )
}

export default TimeframeList
