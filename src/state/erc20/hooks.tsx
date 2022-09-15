import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import { ERC20 } from "abi"
import { isAddress } from "utils"
import { Token } from "interfaces"
import { useActiveWeb3React } from "hooks"
import useContract from "hooks/useContract"

import { addToken } from "state/erc20/actions"
import { selectERC20Data } from "state/erc20/selectors"

export function useERC20Data(
  address: string | undefined
): [Token | null, boolean, () => void] {
  const dispatch = useDispatch()
  const { chainId } = useActiveWeb3React()

  const [loading, setLoading] = useState(true)

  const contract = useContract(address, ERC20)
  const ERC20Data = useSelector(selectERC20Data(chainId, address))

  const init = useCallback(async () => {
    if (!address || !isAddress(address) || !chainId || !contract) {
      return
    }

    setLoading(true)
    try {
      const symbol = await contract.symbol()
      const decimals = await contract.decimals()
      const name = await contract.name()

      dispatch(
        addToken({ params: { address, symbol, decimals, name, chainId } })
      )
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [address, chainId, contract, dispatch])

  useEffect(() => {
    if (ERC20Data !== null) {
      setLoading(false)
      return
    }

    ;(async () => await init())()
  }, [ERC20Data, init])

  return [ERC20Data, loading, init]
}
