import { useERC721Contract } from "contracts"
import { useCallback, useEffect, useState } from "react"
import { isUndefined } from "lodash"

export const useErc721 = (address: string) => {
  const contract = useERC721Contract(address)

  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [isEnumerable, setIsEnumerable] = useState(false)

  const getName = useCallback(async () => {
    const _res = await contract?.name()
    setName(_res || "")
  }, [contract])

  const getSymbol = useCallback(async () => {
    const _res = await contract?.symbol()
    setSymbol(_res || "")
  }, [contract])

  const checkIsSupportEnumerable = useCallback(async () => {
    const _res = await contract?.supportsInterface("0x780e9d63")
    setIsEnumerable(!isUndefined(_res) ? _res : false)
  }, [contract])

  const loadDetails = useCallback(async () => {
    await Promise.all([getName(), getSymbol(), checkIsSupportEnumerable()])
  }, [checkIsSupportEnumerable, getName, getSymbol])

  useEffect(() => {
    loadDetails()
  }, [address, loadDetails])

  return {
    name,
    symbol,
    isEnumerable,

    getName,
    getSymbol,
    checkIsSupportEnumerable,
    loadDetails,
  }
}
