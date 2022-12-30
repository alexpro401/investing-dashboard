import * as React from "react"
import { CircleSpinner } from "react-spinners-kit"
import theme, { Center } from "theme"

const ChartFallback: React.FC<{ h?: string }> = ({ h }) => {
  return (
    <div style={{ height: h ?? "120px" }}>
      <Center>
        <CircleSpinner color={theme.statusColors.success} />
      </Center>
    </div>
  )
}

export default ChartFallback
