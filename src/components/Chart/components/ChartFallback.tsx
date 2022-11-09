import * as React from "react"
import { CircleSpinner } from "react-spinners-kit"
import theme, { Center } from "theme"

const ChartFallback: React.FC = () => {
  return (
    <Center>
      <CircleSpinner color={theme.statusColors.success} />
    </Center>
  )
}

export default ChartFallback
