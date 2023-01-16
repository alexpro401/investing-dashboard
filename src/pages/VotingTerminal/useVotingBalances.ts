import { useMemo } from "react"

import { useERC20GovBalance, useERC721GovBalance } from "hooks"
import { useUserVotes } from "./useUserVotes"

export const useVotingBalances = ({
  daoPoolAddress,
  account,
  proposalId,
  withDelegated,
}) => {
  const userVotes = useUserVotes({ daoPoolAddress, proposalId, account })

  const erc20Balances = useERC20GovBalance(daoPoolAddress)
  const erc721Balances = useERC721GovBalance(daoPoolAddress)

  // merge all lists in one
  const allNftsId = useMemo(() => {
    if (withDelegated) {
      return [
        ...erc721Balances.poolBalance,
        ...erc721Balances.walletBalance,
        ...erc721Balances.delegatedBalance,
      ].map((v) => v.toString())
    }

    return [...erc721Balances.poolBalance, ...erc721Balances.walletBalance].map(
      (v) => v.toString()
    )
  }, [erc721Balances, withDelegated])

  const availableERC721Ids = useMemo(() => {
    return allNftsId.filter((id) => {
      return !userVotes.erc721.total.includes(id)
    })
  }, [allNftsId, userVotes.erc721.total])

  // all token balances with advanced calculations
  const tokenBalances = useMemo(() => {
    const advancedBalances = {
      erc20LockedWithoutVotes: erc20Balances.poolBalance.sub(
        userVotes.erc20.owned
      ),
      erc20DelegatedWithoutVotes: erc20Balances.delegatedBalance.sub(
        userVotes.erc20.delegated
      ),
      erc20LockedAndDelegatedBalance: erc20Balances.delegatedBalance.add(
        erc20Balances.poolBalance
      ),
      erc20LockedAndDelegatedBalanceWithoutVotes: erc20Balances.delegatedBalance
        .sub(userVotes.erc20.delegated)
        .add(erc20Balances.poolBalance.sub(userVotes.erc20.owned)),

      erc721LockedWithoutVotes: erc721Balances.poolBalance.filter(
        (id) => !userVotes.erc721.owned.includes(id.toString())
      ),
      erc721LockedAndDelegatedBalance: [
        ...erc721Balances.poolBalance,
        ...erc721Balances.delegatedBalance,
      ],
      erc721TotalVoted: userVotes.erc721.total,
      erc20DelegatedBalance: erc20Balances.delegatedBalance,
    }

    return {
      ...advancedBalances,
      erc20: withDelegated
        ? advancedBalances.erc20LockedAndDelegatedBalanceWithoutVotes.add(
            erc20Balances.walletBalance
          )
        : advancedBalances.erc20LockedWithoutVotes.add(
            erc20Balances.walletBalance
          ),
      erc721: withDelegated
        ? [
            ...advancedBalances.erc721LockedWithoutVotes,
            ...erc721Balances.delegatedBalance,
            ...erc721Balances.walletBalance,
          ]
        : [
            ...advancedBalances.erc721LockedWithoutVotes,
            ...erc721Balances.walletBalance,
          ],
    }
  }, [
    erc20Balances.delegatedBalance,
    erc20Balances.poolBalance,
    erc20Balances.walletBalance,
    erc721Balances.delegatedBalance,
    erc721Balances.poolBalance,
    erc721Balances.walletBalance,
    userVotes.erc20.delegated,
    userVotes.erc20.owned,
    userVotes.erc721.owned,
    userVotes.erc721.total,
    withDelegated,
  ])

  return {
    allNftsId,
    availableERC721Ids,
    tokenBalances,
  }
}
