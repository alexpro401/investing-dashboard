import { useMemo } from "react"
import { ZERO } from "consts"

import { IGovTokenBalance } from "interfaces/contracts/IGovUserKeeper"

import {
  useDelegatedERC721Tokens,
  useERC721TokensList,
  useActiveWeb3React,
} from "hooks"

import { useGovBalanceMulticall } from "./useGovBalance"

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
