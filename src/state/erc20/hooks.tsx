import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { ERC20 } from "abi"
import { isAddress } from "utils"
import { Token } from "interfaces"
import { useActiveWeb3React } from "hooks"
import useContract from "hooks/useContract"

import { addToken } from "state/erc20/actions"
import { selectERC20Data } from "state/erc20/selectors"
import { ZERO_ADDR } from "constants/index"

export function useERC20Data(
  address: string | undefined
): [Token | null, boolean, () => void] {
  const dispatch = useDispatch()
  const { chainId } = useActiveWeb3React()

  const [storedAddress, setAddress] = useState("")
  const [loading, setLoading] = useState(true)

  const contract = useContract(storedAddress, ERC20)
  const ERC20Data = useSelector(selectERC20Data(chainId, storedAddress))

  const init = useCallback(async () => {
    if (!storedAddress || !isAddress(storedAddress) || !chainId || !contract) {
      return
    }

    setLoading(true)
    try {
      const symbol = await contract.symbol()
      const decimals = await contract.decimals()
      const name = await contract.name()

      dispatch(
        addToken({
          params: { address: storedAddress, symbol, decimals, name, chainId },
        })
      )
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [storedAddress, chainId, contract, dispatch])

  useEffect(() => {
    if (ERC20Data !== null) {
      setLoading(false)
      return
    }

    ;(async () => await init())()
  }, [ERC20Data, init])

  // check address and save
  useEffect(() => {
    if (!isAddress(address)) {
      setAddress("")
      return
    }

    if (
      String(address).toLocaleLowerCase() === storedAddress ||
      address === ZERO_ADDR
    ) {
      setAddress("")
      return
    }

    try {
      setAddress(String(address).toLocaleLowerCase())
    } catch (e) {}
  }, [address, storedAddress])

  return [ERC20Data, loading, init]
}
