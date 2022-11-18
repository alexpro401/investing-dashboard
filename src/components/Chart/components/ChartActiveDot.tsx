import * as React from "react"
import { DotProps } from "recharts"
import { isNil } from "lodash"
import theme from "theme"

interface Props extends DotProps {
  index: any
  activePoint: any
  stroke?: string
}

const ChartActiveDot: React.FC<Props> = (props) => {
  if (
    isNil(props) ||
    isNil(props.cx) ||
    isNil(props.cy) ||
    isNil(props.index) ||
    isNil(props.activePoint) ||
    props.activePoint.activeLabel !== props.index
  ) {
    return null
  }

  const { cx, cy, stroke } = props

  return (
    <svg x={cx - 5.5} y={cy - 5} width="11" height="10" viewBox="0 0 11 10">
      <path
        fill="#181E2C"
        stroke={stroke ?? theme.statusColors.success}
        strokeWidth="1.5"
        d="M1.12966 5C1.12966 7.35408 3.0177 9.25 5.33143 9.25C7.64517 9.25 9.5332 7.35408 9.5332 5C9.5332 2.64592 7.64517 0.75 5.33143 0.75C3.0177 0.75 1.12966 2.64592 1.12966 5Z"
      />
    </svg>
  )
}

export default ChartActiveDot
