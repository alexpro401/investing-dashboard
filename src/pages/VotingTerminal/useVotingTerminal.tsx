import { ZERO } from "constants/index"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import {
  useDelegatedERC721Tokens,
  useERC721Tokens,
  useOwnedERC721Tokens,
} from "hooks/useERC721List"
import { useCallback, useMemo, useState } from "react"
import {
  useGovPoolUserVotingPower,
  useGovPoolVote,
  useGovPoolMemberBalance,
} from "hooks/dao"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { multiplyBignumbers } from "utils/formulas"
import useERC20Allowance from "hooks/useERC20Allowance"
import { useERC20Data } from "state/erc20/hooks"

import { useGovUserKeeperAddress, useGovPoolVotingAssets } from "hooks/dao"
import useERC721Allowance from "hooks/useERC721Allowance"
import { useActiveWeb3React } from "hooks"

export enum ButtonTypes {
  UNLOCK = "UNLOCK",
  INUFICIENT_TOKEN_BALANCE = "INUFICIENT_TOKEN_BALANCE",
  EMPTY_AMOUNT = "EMPTY_AMOUNT",
  SUBMIT = "SUBMIT",
}

// controller for page Voting Terminal
const useVotingTerminal = (daoPoolAddress?: string) => {
  const { account } = useActiveWeb3React()
  // UI controlls
  const [withDelegated, setWithDelegated] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  // form state
  const [ERC20Amount, setERC20Amount] = useState(ZERO)
  const [ERC20Price, setERC20Price] = useState(ZERO)
  const [ERC721Amount, setERC721Amount] = useState<number[]>([])

  const userKeeperAddress = useGovUserKeeperAddress(daoPoolAddress)
  const [{ tokenAddress, nftAddress }] = useGovPoolVotingAssets(daoPoolAddress)
  const { vote, voteDelegated } = useGovPoolVote(daoPoolAddress)
  const { ERC20Balance, ERC721Balance, tokenBalance, tokenBalanceDelegated } =
    useGovPoolMemberBalance(daoPoolAddress, withDelegated)

  const [fromData] = useERC20Data(tokenAddress)
  const priceUSD = useTokenPriceOutUSD({ tokenAddress })

  const ERC721OwnedBalance = useOwnedERC721Tokens(daoPoolAddress)

  const ERC20LockedBalance = useMemo(
    () =>
      tokenBalance?.totalBalance.sub(tokenBalance?.ownedBalance || ZERO) ||
      ZERO,
    [tokenBalance]
  )

  const ERC20LockedAndDelegatedBalance = useMemo(
    () =>
      tokenBalanceDelegated?.totalBalance.add(ERC20LockedBalance) ||
      ERC20LockedBalance,
    [tokenBalanceDelegated, ERC20LockedBalance]
  )

  const { allowances: ERC20Allowances, updateAllowance: updateERC20Allowance } =
    useERC20Allowance([tokenAddress], userKeeperAddress)

  const {
    allowances: ERC721Allowances,
    updateAllowance: updateERC721Allowance,
  } = useERC721Allowance(nftAddress, ERC721OwnedBalance, userKeeperAddress)

  // get power for all nfts
  const [userOwnedPower] = useGovPoolUserVotingPower({
    daoAddress: daoPoolAddress || "",
    address: account,
  })
  const [userDelegatedPower] = useGovPoolUserVotingPower({
    address: account,
    daoAddress: daoPoolAddress || "",
    isMicroPool: true,
  })

  // user nfts ids lists
  const userTokens = useERC721Tokens(daoPoolAddress)
  const delegatedTokens = useDelegatedERC721Tokens(daoPoolAddress)

  // merge all lists in one
  const allNftsId = useMemo(() => {
    if (withDelegated) {
      return [...userTokens, ...delegatedTokens].map((v) => v.toString())
    }

    return [...userTokens].map((v) => v.toString())
  }, [userTokens, delegatedTokens, withDelegated])

  // merge all power in one
  const allNftsPower = useMemo(() => {
    if (withDelegated) {
      return [...userOwnedPower.nftPower, ...userDelegatedPower.nftPower].map(
        (v) => v.toString()
      )
    }

    return [...userOwnedPower.nftPower].map((v) => v.toString())
  }, [userDelegatedPower.nftPower, userOwnedPower.nftPower, withDelegated])

  const nftPowerMap = useMemo(() => {
    return allNftsId.reduce((acc, id, index) => {
      return {
        ...acc,
        [id]: allNftsPower[index],
      }
    }, {})
  }, [allNftsId, allNftsPower])

  const isDelegatedERC20Used = useMemo(() => {
    if (withDelegated) {
      return (
        ERC20Amount.gt(ZERO) && tokenBalanceDelegated?.totalBalance.gt(ZERO)
      )
    }

    return false
  }, [ERC20Amount, tokenBalanceDelegated, withDelegated])

  const isDepositedERC20Used = useMemo(() => {
    if (withDelegated) {
      return ERC20Amount.gt(tokenBalanceDelegated?.totalBalance || ZERO)
    }

    return ERC20Amount.gt(ZERO) && ERC20LockedBalance.gt(ZERO)
  }, [ERC20Amount, tokenBalanceDelegated, withDelegated, ERC20LockedBalance])

  const isOwnedERC20Used = useMemo(() => {
    if (withDelegated) {
      return ERC20Amount.gt(ERC20LockedAndDelegatedBalance)
    }

    return ERC20Amount.gt(ERC20LockedBalance)
  }, [
    ERC20Amount,
    ERC20LockedBalance,
    withDelegated,
    ERC20LockedAndDelegatedBalance,
  ])

  const isERC20Approved = useMemo(() => {
    if (!isOwnedERC20Used) return true

    return ERC20Allowances[tokenAddress]?.gte(
      ERC20Amount.sub(
        withDelegated ? ERC20LockedAndDelegatedBalance : ERC20LockedBalance
      )
    )
  }, [
    ERC20Amount,
    ERC20Allowances,
    ERC20LockedAndDelegatedBalance,
    isOwnedERC20Used,
    tokenAddress,
    ERC20LockedBalance,
    withDelegated,
  ])

  const delegatedERC721Selected = useMemo(() => {
    return ERC721Amount.filter((id) => delegatedTokens.includes(id))
  }, [ERC721Amount, delegatedTokens])

  const ownedERC721Selected = useMemo(() => {
    return ERC721Amount.filter((id) => ERC721OwnedBalance.includes(id))
  }, [ERC721Amount, ERC721OwnedBalance])

  const unapprowedERC721Selected = useMemo(() => {
    return ownedERC721Selected.filter(
      (id) => ERC721Allowances[id] !== userKeeperAddress
    )
  }, [ERC721Allowances, ownedERC721Selected, userKeeperAddress])

  // UI data
  const formInfo = useMemo(() => {
    return {
      erc20: {
        address: tokenAddress,
        symbol: fromData?.symbol,
        decimal: fromData?.decimals,
        balance: ERC20Balance,
      },
      erc721: {
        address: nftAddress,
        balance: ERC721Balance,
      },
    }
  }, [fromData, nftAddress, tokenAddress, ERC20Balance, ERC721Balance])

  // UI button variations
  const buttonType = useMemo(() => {
    if (ERC20Amount.isZero() && ERC721Amount.length === 0) {
      return ButtonTypes.EMPTY_AMOUNT
    }

    if (ERC20Amount.gt(ERC20Balance)) {
      return ButtonTypes.INUFICIENT_TOKEN_BALANCE
    }

    if (!isERC20Approved || !!unapprowedERC721Selected.length) {
      return ButtonTypes.UNLOCK
    }

    return ButtonTypes.SUBMIT
  }, [
    ERC20Amount,
    ERC721Amount.length,
    ERC20Balance,
    isERC20Approved,
    unapprowedERC721Selected.length,
  ])

  const toggleDelegated = useCallback(
    (state: boolean) => {
      if (!state) {
        setERC721Amount((prev) =>
          prev.filter((id) => !delegatedTokens.includes(id))
        )
      }
      setWithDelegated(state)
    },
    [delegatedTokens]
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
        ? ERC20LockedAndDelegatedBalance
        : ERC20LockedBalance
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
    isERC20Approved,
    unapprowedERC721Selected,
    withDelegated,
    ERC20LockedAndDelegatedBalance,
    ERC20LockedBalance,
    ERC20Amount,
    updateERC20Allowance,
    tokenAddress,
    updateERC721Allowance,
  ])

  const handleVote = useCallback(
    (proposalId: number) => {
      // calculate erc20 deposit amount without locked and delegated balance
      const depositAmount = isOwnedERC20Used
        ? ERC20Amount.sub(
            isDelegatedERC20Used
              ? ERC20LockedAndDelegatedBalance
              : ERC20LockedBalance
          )
        : ZERO

      // calculate erc20 vote amount without delegated balance
      const voteAmount = isDepositedERC20Used
        ? ERC20Amount.sub(tokenBalanceDelegated?.totalBalance || ZERO)
        : ERC20Amount

      const depositNfts = ownedERC721Selected
      const voteNftIds = ERC721Amount

      return vote(
        proposalId,
        depositAmount,
        depositNfts,
        voteAmount,
        voteNftIds
      )
    },
    [
      ERC721Amount,
      ownedERC721Selected,
      ERC20Amount,
      ERC20LockedAndDelegatedBalance,
      ERC20LockedBalance,
      isDepositedERC20Used,
      isDelegatedERC20Used,
      isOwnedERC20Used,
      tokenBalanceDelegated,
      vote,
    ]
  )

  const handleVoteDelegated = useCallback(
    (proposalId: number) => {
      // calculate erc20 vote amount without delegated balance
      const voteAmount = ERC20Amount.gt(
        tokenBalanceDelegated?.totalBalance || ZERO
      )
        ? tokenBalanceDelegated?.totalBalance || ZERO
        : ERC20Amount

      const voteNftIds = delegatedERC721Selected

      return voteDelegated(proposalId, voteAmount, voteNftIds)
    },
    [ERC20Amount, tokenBalanceDelegated, voteDelegated, delegatedERC721Selected]
  )

  // wraps default vote and vote delegated functions
  const handleSubmit = useCallback(
    async (proposalId?: string) => {
      const id = Number(proposalId)

      if (isNaN(id)) return

      await handleVote(id)

      if (isDelegatedERC20Used || delegatedERC721Selected.length > 0) {
        await handleVoteDelegated(id)
      }
    },
    [
      handleVote,
      handleVoteDelegated,
      isDelegatedERC20Used,
      delegatedERC721Selected,
    ]
  )

  return {
    formInfo,
    allNftsId,
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
