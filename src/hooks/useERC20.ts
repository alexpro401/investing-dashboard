import { Contract } from "@ethersproject/contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { useCallback, useEffect, useState } from "react"

import { isAddress } from "utils"
import { Token } from "interfaces"
import { ZERO } from "constants/index"
import { useActiveWeb3React } from "hooks"
import { useERC20Data } from "state/erc20/hooks"
import { getBalanceOf } from "utils/getContract"
import { useERC20Contract } from "contracts"

// TODO: balance not updating when balance !== null
export function useERC20Balance(
  address: string | undefined
): [BigNumber | null, boolean, () => void] {
  const { account, library } = useActiveWeb3React()

  const [storedAddress, setAddress] = useState("")
  const [balance, setBalance] = useState<BigNumber | null>(null)
  const [loading, setLoading] = useState(true)

  const contract = useERC20Contract(address)

  const init = useCallback(() => {
    if (typeof address !== "string" || address.length !== 42) {
      return
    }
    setLoading(true)
    ;(async () => {
      try {
        const balance = await getBalanceOf({
          tokenAddress: storedAddress,
          library,
          contract,
          account,
        })

        setBalance(balance)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    })()
  }, [account, address, contract, library, storedAddress])

  // check address and save
  useEffect(() => {
    if (!address || String(address).toLocaleLowerCase() === storedAddress) {
      return
    }

    try {
      isAddress(address)
      setAddress(String(address).toLocaleLowerCase())
    } catch (e) {}
  }, [address, storedAddress])

  useEffect(() => {
    if (balance !== null) {
      setLoading(false)
      return
    }

    ;(async () => await init())()
  }, [balance, init])

  return [balance, loading, init]
}

export function useERC20(
  address: string | undefined
): [Contract | null, Token | null, BigNumber, () => void] {
  const { account, library } = useActiveWeb3React()

  const [storedAddress, setAddress] = useState("")

  const contract = useERC20Contract(storedAddress)

  const [tokenData] = useERC20Data(address)
  const [balance, , fetchBalance] = useERC20Balance(address)

  const init = useCallback(() => {
    if (!storedAddress) return
    ;(async () => {
      fetchBalance()
    })()
  }, [fetchBalance, storedAddress])

  // check address and save
  useEffect(() => {
    if (!address || String(address).toLocaleLowerCase() === storedAddress) {
      return
    }

    try {
      isAddress(address)
      setAddress(String(address).toLocaleLowerCase())
    } catch (e) {}
  }, [address, storedAddress])

  useEffect(() => {
    init()
  }, [contract, account, library, init])

  return [contract, tokenData, balance === null ? ZERO : balance, init]
}
