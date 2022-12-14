import { useMemo, useState } from "react"

export const useNativeToken = () => {
  const address = useMemo(
    () => "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    []
  )
  const [symbol] = useState("BNB")
  const [decimals] = useState(18)
  const [name] = useState("BNB")

  return {
    address,
    name,
    symbol,
    decimals,
  }
}
