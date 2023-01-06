import { getAmountColor, Text } from "theme"

/*
  text - without formating
  brackets - with ( ) brackets around text
  filled - with background color
*/

export type PNLType = "text" | "brackets" | "filled"

interface Props {
  pnl: string | number
  fontSize?: number
  lineHeight?: string
  type?: PNLType
}

const PNLIndicator = ({ pnl, fontSize, lineHeight, type = "text" }: Props) => {
  return (
    <Text
      fz={fontSize || 10}
      lh={lineHeight || "12px"}
      color={getAmountColor(pnl)}
    >
      {type === "brackets" && "("}
      <>
        {Number(pnl) > 0 ? "+" : null}
        {pnl}%
      </>
      {type === "brackets" && ")"}
    </Text>
  )
}

export default PNLIndicator
