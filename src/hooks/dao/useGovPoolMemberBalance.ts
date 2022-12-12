import { useMemo } from "react"
import { useGovBalance } from "hooks/dao"
import { ZERO } from "constants/index"

import {
  IGovNftBalance,
  IGovTokenBalance,
} from "interfaces/contracts/IGovUserKeeper"
import { useGovBalanceMulticall } from "./useGovBalance"
import { useActiveWeb3React } from "hooks"
import {
  useDelegatedERC721Tokens,
  useERC721TokensList,
} from "hooks/useERC721List"

export const useERC20GovBalance = (daoPoolAddress?: string) => {
  const { account } = useActiveWeb3React()

  const erc20Params = useMemo(
    () =>
      account
        ? [{ voter: account, isMicroPool: false, useDelegated: false }]
        : [],
    [account]
  )

  const erc20DelegatedParams = useMemo(
    () =>
      account
        ? [{ voter: account, isMicroPool: true, useDelegated: false }]
        : [],
    [account]
  )

  const [erc20Balances] = useGovBalanceMulticall<IGovTokenBalance>({
    daoPoolAddress,
    params: erc20Params,
    method: "tokenBalance",
  })

  const [erc20BalanceDelegated] = useGovBalanceMulticall<IGovTokenBalance>({
    daoPoolAddress,
    params: erc20DelegatedParams,
    method: "tokenBalance",
  })

  const erc20DepositedBalance = useMemo(() => {
    if (!erc20Balances || !erc20Balances[0]) return ZERO

    return erc20Balances[0].totalBalance.sub(erc20Balances[0].ownedBalance)
  }, [erc20Balances])

  const erc20OwnedBalance = useMemo(() => {
    if (!erc20Balances || !erc20Balances[0]) return ZERO

    return erc20Balances[0].ownedBalance
  }, [erc20Balances])

  const erc20DelegatedBalance = useMemo(() => {
    if (!erc20BalanceDelegated || !erc20BalanceDelegated[0]) return ZERO

    return erc20BalanceDelegated[0].totalBalance
  }, [erc20BalanceDelegated])

  return useMemo(() => {
    return {
      walletBalance: erc20OwnedBalance,
      poolBalance: erc20DepositedBalance,
      delegatedBalance: erc20DelegatedBalance,
    }
  }, [erc20OwnedBalance, erc20DepositedBalance, erc20DelegatedBalance])
}

export const useERC721GovBalance = (daoPoolAddress?: string) => {
  const { ownedERC721, depositedERC721 } = useERC721TokensList(daoPoolAddress)
  const delegatedERC721 = useDelegatedERC721Tokens(daoPoolAddress)

  return useMemo(() => {
    return {
      walletBalance: ownedERC721,
      poolBalance: depositedERC721,
      delegatedBalance: delegatedERC721,
    }
  }, [ownedERC721, depositedERC721, delegatedERC721])
}

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
