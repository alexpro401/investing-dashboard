import { useCallback, useEffect, useState } from "react"
import { useGovUserKeeperContract } from "contracts"
import { useWeb3React } from "@web3-react/core"
import { ZERO } from "constants/index"

interface Props {
  daoPoolAddress?: string
  isMicroPool?: boolean
  useDelegated?: boolean
  method: "tokenBalance" | "nftBalance"
}

const useGovBalance = ({
  daoPoolAddress,
  isMicroPool = false,
  useDelegated = false,
  method,
}: Props) => {
  const { account } = useWeb3React()
  const [balance, setBalance] = useState(ZERO)
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
    if (!userKeeper || !account) return

    getGovTokenBalance()
  }, [account, getGovTokenBalance, userKeeper])

  return balance
}

export default useGovBalance
