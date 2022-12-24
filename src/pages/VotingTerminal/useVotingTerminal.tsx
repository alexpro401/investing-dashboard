import { useCallback, useMemo, useState } from "react"

import { ZERO } from "constants/index"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"

import {
  useGovPoolUserVotingPower,
  useGovPoolVote,
  useGovPoolHelperContracts,
  useGovPoolVotingAssets,
} from "hooks/dao"

import { useActiveWeb3React, useERC721Allowance } from "hooks"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { useERC20Allowance } from "hooks"

import { useERC20Data } from "state/erc20/hooks"
import { multiplyBignumbers } from "utils/formulas"
import useGovPoolUserVotes from "hooks/dao/useGovPoolUserVotes"
import {
  useERC20GovBalance,
  useERC721GovBalance,
} from "hooks/dao/useGovPoolMemberBalance"

// TODO: implement canParticipate hook
export enum ButtonTypes {
  UNVAILABLE = "UNVAILABLE",
  UNLOCK = "UNLOCK",
  INUFICIENT_TOKEN_BALANCE = "INUFICIENT_TOKEN_BALANCE",
  EMPTY_AMOUNT = "EMPTY_AMOUNT",
  SUBMIT = "SUBMIT",
}

// controller for page Voting Terminal
const useVotingTerminal = (daoPoolAddress?: string, proposalId?: string) => {
  const { account } = useActiveWeb3React()

  // UI controlls
  const [withDelegated, setWithDelegated] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  // form state
  const [ERC20Amount, setERC20Amount] = useState(ZERO)
  const [ERC20Price, setERC20Price] = useState(ZERO)
  const [ERC721Amount, setERC721Amount] = useState<number[]>([])

  const { govUserKeeperAddress } = useGovPoolHelperContracts(daoPoolAddress)
  const [{ haveToken, haveNft, tokenAddress, nftAddress }] =
    useGovPoolVotingAssets(daoPoolAddress)
  const { vote, voteDelegated } = useGovPoolVote(daoPoolAddress)

  const erc20Balances = useERC20GovBalance(daoPoolAddress)
  const erc721Balances = useERC721GovBalance(daoPoolAddress)

  const [fromData] = useERC20Data(tokenAddress)
  const priceUSD = useTokenPriceOutUSD({ tokenAddress })

  const { allowances: ERC20Allowances, updateAllowance: updateERC20Allowance } =
    useERC20Allowance([tokenAddress], govUserKeeperAddress)

  const {
    allowances: ERC721Allowances,
    updateAllowance: updateERC721Allowance,
  } = useERC721Allowance(
    nftAddress,
    erc721Balances.walletBalance,
    govUserKeeperAddress
  )

  const [userVotes] = useGovPoolUserVotes({
    daoPoolAddress: daoPoolAddress ?? "",
    params: useMemo(
      () =>
        !proposalId || !account
          ? []
          : [
              { voter: account, proposalId },
              { voter: account, proposalId, isMicroPool: true },
            ],
      [account, proposalId]
    ),
  })

  // get power for all nfts
  const [userOwnedPower] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress || "",
    address: account,
  })
  const [userDelegatedPower] = useGovPoolUserVotingPower({
    address: account,
    userKeeperAddress: govUserKeeperAddress || "",
    isMicroPool: true,
  })

  const ERC20Voted = useMemo(() => {
    if (!account) return ZERO

    try {
      return userVotes[0].tokensVoted || ZERO
    } catch (error) {
      return ZERO
    }
  }, [account, userVotes])

  const ERC20VotedDelegated = useMemo(() => {
    if (!account) return ZERO

    try {
      return userVotes[1].tokensVoted || ZERO
    } catch (error) {
      return ZERO
    }
  }, [account, userVotes])

  const ERC721Voted = useMemo(() => {
    if (!account) return []

    try {
      return userVotes[account].nftsVoted.map((nft) => nft.toString())
    } catch (error) {
      return []
    }
  }, [account, userVotes])

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

  const filteredERC721Ids = useMemo(() => {
    return allNftsId.filter((id) => {
      return !ERC721Voted.includes(id)
    })
  }, [allNftsId, ERC721Voted])

  // merge all power in one
  const allNftsPower = useMemo(() => {
    if (withDelegated) {
      return [...userOwnedPower.nftIds, ...userDelegatedPower.nftIds].map((v) =>
        v.toString()
      )
    }

    return [...userOwnedPower.nftIds].map((v) => v.toString())
  }, [userDelegatedPower.nftIds, userOwnedPower.nftIds, withDelegated])

  const nftPowerMap = useMemo(() => {
    return allNftsId.reduce((acc, id, index) => {
      return {
        ...acc,
        [id]: allNftsPower[index],
      }
    }, {})
  }, [allNftsId, allNftsPower])

  // all token balances with advanced calculations
  const tokenBalances = useMemo(() => {
    const advancedBalances = {
      erc20LockedWithoutVotes: erc20Balances.poolBalance.sub(ERC20Voted),
      erc20DelegatedWithoutVotes:
        erc20Balances.delegatedBalance.sub(ERC20VotedDelegated),
      erc20LockedAndDelegatedBalance: erc20Balances.delegatedBalance.add(
        erc20Balances.poolBalance
      ),
      erc20LockedAndDelegatedBalanceWithoutVotes: erc20Balances.delegatedBalance
        .sub(ERC20VotedDelegated)
        .add(erc20Balances.poolBalance.sub(ERC20Voted)),

      erc721LockedWithoutVotes: erc721Balances.poolBalance.filter(
        (id) => !ERC721Voted.includes(id.toString())
      ),
      erc721LockedAndDelegatedBalance: [
        ...erc721Balances.poolBalance,
        ...erc721Balances.delegatedBalance,
      ],
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
    ERC20Voted,
    ERC20VotedDelegated,
    ERC721Voted,
    erc20Balances.delegatedBalance,
    erc20Balances.poolBalance,
    erc20Balances.walletBalance,
    erc721Balances.delegatedBalance,
    erc721Balances.poolBalance,
    erc721Balances.walletBalance,
    withDelegated,
  ])

  const isOwnedERC20Used = useMemo(() => {
    if (withDelegated) {
      return ERC20Amount.gt(
        tokenBalances.erc20LockedAndDelegatedBalanceWithoutVotes
      )
    }

    if (tokenBalances.erc20LockedWithoutVotes.gt(ZERO)) {
      return ERC20Amount.gt(tokenBalances.erc20LockedWithoutVotes)
    }

    return true
  }, [
    withDelegated,
    tokenBalances.erc20LockedWithoutVotes,
    tokenBalances.erc20LockedAndDelegatedBalanceWithoutVotes,
    ERC20Amount,
  ])

  const isERC20Approved = useMemo(() => {
    if (!isOwnedERC20Used) return true

    return ERC20Allowances[tokenAddress]?.gte(
      ERC20Amount.sub(
        withDelegated
          ? tokenBalances.erc20LockedAndDelegatedBalanceWithoutVotes
          : tokenBalances.erc20LockedWithoutVotes
      )
    )
  }, [
    ERC20Allowances,
    ERC20Amount,
    isOwnedERC20Used,
    tokenAddress,
    tokenBalances,
    withDelegated,
  ])

  const ownedERC721Selected = useMemo(() => {
    return ERC721Amount.filter((id) =>
      erc721Balances.walletBalance.includes(id)
    )
  }, [ERC721Amount, erc721Balances.walletBalance])

  const unapprowedERC721Selected = useMemo(() => {
    return ownedERC721Selected.filter(
      (id) =>
        ERC721Allowances[id].toLocaleLowerCase() !==
        govUserKeeperAddress.toLocaleLowerCase()
    )
  }, [ERC721Allowances, ownedERC721Selected, govUserKeeperAddress])

  const delegatedERC721Selected = useMemo(() => {
    return ERC721Amount.filter((id) =>
      erc721Balances.delegatedBalance.includes(id)
    )
  }, [ERC721Amount, erc721Balances.delegatedBalance])

  // UI data
  const formInfo = useMemo(() => {
    return {
      haveToken,
      haveNft,
      erc20: {
        address: tokenAddress,
        symbol: fromData?.symbol,
        decimal: fromData?.decimals,
        balance: tokenBalances.erc20,
      },
      erc721: {
        address: nftAddress,
        balance: BigNumber.from(tokenBalances.erc721.length),
      },
    }
  }, [fromData, haveNft, haveToken, nftAddress, tokenAddress, tokenBalances])

  // UI button variations
  const buttonType = useMemo(() => {
    // TODO: button type vote unvailable

    if (ERC20Amount.isZero() && ERC721Amount.length === 0) {
      return ButtonTypes.EMPTY_AMOUNT
    }

    if (ERC20Amount.gt(tokenBalances.erc20)) {
      return ButtonTypes.INUFICIENT_TOKEN_BALANCE
    }

    if (!isERC20Approved || !!unapprowedERC721Selected.length) {
      return ButtonTypes.UNLOCK
    }

    return ButtonTypes.SUBMIT
  }, [
    ERC20Amount,
    ERC721Amount.length,
    isERC20Approved,
    tokenBalances.erc20,
    unapprowedERC721Selected.length,
  ])

  const toggleDelegated = useCallback(
    (state: boolean) => {
      if (!state) {
        setERC721Amount((prev) =>
          prev.filter((id) => !erc721Balances.delegatedBalance.includes(id))
        )
      }
      setWithDelegated(state)
    },
    [erc721Balances.delegatedBalance]
  )

  const handleERC20Change = useCallback(
    (targetValue: BigNumberish) => {
      const amount = BigNumber.from(targetValue)
      setERC20Amount(amount)
      setERC20Price(multiplyBignumbers([amount, 18], [priceUSD, 18]))
    },
    [priceUSD]
  )

  const handleERC721Change = useCallback((ids: string[]) => {
    setERC721Amount(ids.map((nft) => Number(nft)))
  }, [])

  const handleApprove = useCallback(() => {
    // approve erc20
    if (!isERC20Approved) {
      const locked = withDelegated
        ? tokenBalances.erc20LockedAndDelegatedBalanceWithoutVotes
        : tokenBalances.erc20LockedWithoutVotes

      const amount = ERC20Amount.sub(locked)

      updateERC20Allowance(tokenAddress, amount)
      return
    }

    // approve erc721
    if (unapprowedERC721Selected.length) {
      const id = unapprowedERC721Selected[0]
      updateERC721Allowance(id)
    }
  }, [
    ERC20Amount,
    isERC20Approved,
    tokenAddress,
    tokenBalances,
    unapprowedERC721Selected,
    updateERC20Allowance,
    updateERC721Allowance,
    withDelegated,
  ])

  const handleVote = useCallback(
    (proposalId: number) => {
      // calculate erc20 deposit amount without locked and delegated and voted balance
      const depositAmount = isOwnedERC20Used
        ? ERC20Amount.sub(
            withDelegated
              ? tokenBalances.erc20LockedAndDelegatedBalanceWithoutVotes
              : tokenBalances.erc20LockedWithoutVotes
          )
        : ZERO

      // calculate erc20 vote amount without delegated balance
      const voteAmount = withDelegated
        ? ERC20Amount.sub(tokenBalances.erc20DelegatedWithoutVotes)
        : ERC20Amount

      const depositNfts = ownedERC721Selected
      const voteNftIds = ERC721Amount.filter(
        (id) => !erc721Balances.delegatedBalance.includes(id)
      )

      return vote(
        proposalId,
        depositAmount,
        depositNfts,
        voteAmount,
        voteNftIds
      )
    },
    [
      isOwnedERC20Used,
      ERC20Amount,
      withDelegated,
      tokenBalances.erc20LockedAndDelegatedBalanceWithoutVotes,
      tokenBalances.erc20LockedWithoutVotes,
      tokenBalances.erc20DelegatedWithoutVotes,
      ownedERC721Selected,
      ERC721Amount,
      vote,
      erc721Balances.delegatedBalance,
    ]
  )

  const handleVoteDelegated = useCallback(
    (proposalId: number) => {
      // calculate erc20 vote amount without delegated balance
      const voteAmount = ERC20Amount.gte(erc20Balances.delegatedBalance)
        ? erc20Balances.delegatedBalance
        : ERC20Amount

      const voteNftIds = delegatedERC721Selected

      return voteDelegated(proposalId, voteAmount, voteNftIds)
    },
    [
      ERC20Amount,
      delegatedERC721Selected,
      erc20Balances.delegatedBalance,
      voteDelegated,
    ]
  )

  // wraps default vote and vote delegated functions
  const handleSubmit = useCallback(async () => {
    const id = Number(proposalId)

    if (isNaN(id)) return

    try {
      await handleVote(id)

      if (!withDelegated) return

      if (
        delegatedERC721Selected.length > 0 ||
        (!ERC20Amount.isZero() &&
          !tokenBalances.erc20DelegatedWithoutVotes.isZero())
      ) {
        await handleVoteDelegated(id)
      }
    } catch (err) {
      console.error(err)
    }
  }, [
    proposalId,
    handleVote,
    withDelegated,
    delegatedERC721Selected.length,
    ERC20Amount,
    tokenBalances.erc20DelegatedWithoutVotes,
    handleVoteDelegated,
  ])

  return {
    formInfo,
    allNftsId: filteredERC721Ids,
    ERC721Amount,
    handleERC721Change,
    withDelegated,
    toggleDelegated,
    selectOpen,
    setSelectOpen,
    handleERC20Change,
    ERC20Amount,
    ERC20Price,
    nftPowerMap,
    buttonType,
    handleApprove,
    handleSubmit,
  }
}

export default useVotingTerminal
