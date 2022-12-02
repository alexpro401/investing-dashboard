import { useMemo } from "react"
import { useGovBalance } from "hooks/dao"
import { ZERO } from "constants/index"

import {
  IGovNftBalance,
  IGovTokenBalance,
} from "interfaces/contracts/IGovUserKeeper"

// fetches tokens & nfts balances for specific user for DAO pool
// *hint "tokenBalance" & "nftBalance" methods returns balances stored on user wallet & DAO pool
// in case when withDelegated === "true" - array will be filled with delegated tokens
const useGovPoolMemberBalance = (
  daoPoolAddress?: string,
  withDelegated?: boolean
) => {
  const tokenBalance = useGovBalance<IGovTokenBalance>({
    daoPoolAddress,
    method: "tokenBalance",
  })

  const tokenBalanceDelegated = useGovBalance<IGovTokenBalance>({
    daoPoolAddress,
    method: "tokenBalance",
    isMicroPool: true,
  })

  const nftBalance = useGovBalance<IGovNftBalance>({
    daoPoolAddress,
    method: "nftBalance",
    isMicroPool: false,
  })

  const nftBalanceWithDelegated = useGovBalance<IGovNftBalance>({
    daoPoolAddress,
    method: "nftBalance",
    isMicroPool: true,
  })

  const tokenBalanceLocked = useMemo(() => {
    if (!tokenBalance) return ZERO

    return tokenBalance.totalBalance.sub(tokenBalance.ownedBalance)
  }, [tokenBalance])

  const ERC20Balance = useMemo(() => {
    if (withDelegated) {
      return (
        tokenBalance?.totalBalance.add(
          tokenBalanceDelegated?.totalBalance || ZERO
        ) || ZERO
      )
    }

    return tokenBalance?.totalBalance || ZERO
  }, [tokenBalance, tokenBalanceDelegated, withDelegated])

  const ERC721Balance = useMemo(() => {
    if (withDelegated) {
      return (
        nftBalance?.totalBalance.add(
          nftBalanceWithDelegated?.totalBalance || ZERO
        ) || ZERO
      )
    }

    return nftBalance?.totalBalance || ZERO
  }, [nftBalance, nftBalanceWithDelegated, withDelegated])

  return {
    ERC20Balance,
    ERC721Balance,
    tokenBalance,
    tokenBalanceLocked,
    tokenBalanceDelegated,
    nftBalance,
    nftBalanceWithDelegated,
  }
}

export default useGovPoolMemberBalance
