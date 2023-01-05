import { getAmountColor, Text } from "theme"

interface Props {
  pnl: string | number
  fontSize?: number
  lineHeight?: string
}

const PNLIndicator = ({ pnl, fontSize, lineHeight }: Props) => {
  return (
    <Text
      fz={fontSize || 10}
      lh={lineHeight || "12px"}
      color={getAmountColor(pnl)}
    >
      {Number(pnl) > 0 ? "+" : null}
      {pnl}%
    </Text>
  )
}

export default PNLIndicator
