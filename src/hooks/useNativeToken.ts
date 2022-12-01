import { useMemo, useState } from "react"

export const useNativeToken = () => {
  const address = useMemo(
    () => "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    []
  )
  const [symbol, setSymbol] = useState("BNB")
  const [decimals, setDecimals] = useState(18)
  const [name, setName] = useState("BNB")

  return {
    address,
    name,
    symbol,
    decimals,
  }
}
