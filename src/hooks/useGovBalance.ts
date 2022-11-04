import { BigNumber } from "@ethersproject/bignumber"
import { ZERO_ADDR } from "./../constants/index"
import { useCallback, useEffect, useState } from "react"
import { useGovUserKeeperContract } from "contracts"
import { useWeb3React } from "@web3-react/core"
import { ZERO } from "constants/index"

type methods = "tokenBalance" | "nftBalance" | "nftExactBalance"

interface Props {
  daoPoolAddress?: string
  isMicroPool?: boolean
  useDelegated?: boolean
  method: methods
}

const useGovBalance = <T>({
  daoPoolAddress,
  isMicroPool = false,
  useDelegated = false,
  method,
}: Props): T | undefined => {
  const { account } = useWeb3React()
  const [balance, setBalance] = useState<any>()
  const userKeeper = useGovUserKeeperContract(daoPoolAddress)

  const getGovTokenBalance = useCallback(async () => {
    try {
      const _balance = await userKeeper![method](
        account!,
        isMicroPool,
        useDelegated
      )
      setBalance(_balance)
    } catch (error) {
      console.log("getGovTokenBalance error: ", error)
    }
  }, [account, isMicroPool, method, useDelegated, userKeeper])

  useEffect(() => {
    const isEmpty = daoPoolAddress === ZERO_ADDR

    if (!userKeeper || !account || isEmpty) return

    getGovTokenBalance()
  }, [account, daoPoolAddress, getGovTokenBalance, userKeeper])

  return balance
}

export default useGovBalance
