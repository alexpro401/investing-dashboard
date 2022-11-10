import { ZERO } from "constants/index"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { useDelegatedERC721Tokens, useERC721Tokens } from "hooks/useERC721List"
import useGovBalance from "hooks/useGovBalance"
import useGovPoolTokensInfo from "hooks/useGovPoolTokensInfo"
import {
  IGovNftBalance,
  IGovTokenBalance,
} from "interfaces/contracts/IGovUserKeeper"
import { useCallback, useMemo, useState } from "react"
import useGovVotingPower from "hooks/useGovVotingPower"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { multiplyBignumbers } from "utils/formulas"
import useERC20Allowance from "hooks/useERC20Allowance"
import { useERC20 } from "hooks/useERC20"
import { useGovUserKeeperAddress } from "hooks/useGovPool"
import useGovPoolVote from "hooks/useGovPoolVote"

// fetches tokens & nfts balance for specific user of specific DAO pool
const useGovMemberBalance = (
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
    tokenBalanceDelegated,
    nftBalance,
    nftBalanceWithDelegated,
  }
}

export enum ButtonTypes {
  UNLOCK = "UNLOCK",
  INUFICIENT_TOKEN_BALANCE = "INUFICIENT_TOKEN_BALANCE",
  EMPTY_AMOUNT = "EMPTY_AMOUNT",
  SUBMIT = "SUBMIT",
}

// controller for page Voting Terminal
const useVotingTerminal = (daoPoolAddress?: string) => {
  // UI controlls
  const [withDelegated, setWithDelegated] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  // form state
  const [ERC20Amount, setERC20Amount] = useState(ZERO)
  const [ERC20Price, setERC20Price] = useState(ZERO)
  const [ERC721Amount, setERC721Amount] = useState<number[]>([])

  const userKeeperAddress = useGovUserKeeperAddress(daoPoolAddress)
  const [{ tokenAddress, nftAddress }] = useGovPoolTokensInfo(daoPoolAddress)
  const { vote, voteDelegated } = useGovPoolVote(daoPoolAddress)
  const { ERC20Balance, ERC721Balance, tokenBalance, tokenBalanceDelegated } =
    useGovMemberBalance(daoPoolAddress, withDelegated)

  const [, fromData, accountBalance] = useERC20(tokenAddress)
  const priceUSD = useTokenPriceOutUSD({ tokenAddress })

  const { allowances, updateAllowance } = useERC20Allowance(
    [tokenAddress],
    userKeeperAddress
  )

  // get power for all nfts
  const userOwnedPower = useGovVotingPower({ daoPoolAddress })
  const userDelegatedPower = useGovVotingPower({
    daoPoolAddress,
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

    const userLockedBalance = tokenBalance?.totalBalance.sub(accountBalance)

    return ERC20Amount.gt(ZERO) && userLockedBalance?.gt(ZERO)
  }, [
    ERC20Amount,
    accountBalance,
    tokenBalance,
    tokenBalanceDelegated,
    withDelegated,
  ])

  const ERC20LockedBalance = useMemo(
    () => tokenBalance?.totalBalance.sub(accountBalance) || ZERO,
    [accountBalance, tokenBalance]
  )

  const ERC20LockedAndDelegatedBalance = useMemo(
    () =>
      tokenBalanceDelegated?.totalBalance.add(ERC20LockedBalance) ||
      ERC20LockedBalance,
    [tokenBalanceDelegated, ERC20LockedBalance]
  )

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

    return allowances[tokenAddress]?.gte(
      ERC20Amount.sub(
        withDelegated ? ERC20LockedAndDelegatedBalance : ERC20LockedBalance
      )
    )
  }, [
    ERC20Amount,
    allowances,
    ERC20LockedAndDelegatedBalance,
    isOwnedERC20Used,
    tokenAddress,
    ERC20LockedBalance,
    withDelegated,
  ])

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

    if (!isERC20Approved) {
      return ButtonTypes.UNLOCK
    }

    return ButtonTypes.SUBMIT
  }, [ERC20Amount, ERC721Amount.length, ERC20Balance, isERC20Approved])

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

      updateAllowance(tokenAddress, amount)
    }
  }, [
    ERC20Amount,
    ERC20LockedBalance,
    ERC20LockedAndDelegatedBalance,
    isERC20Approved,
    tokenAddress,
    updateAllowance,
    withDelegated,
  ])

  const handleVote = useCallback(() => {
    const proposalId = 9

    // calculate erc20 deposit amount without locked and delegated balance
    const depositAmount = isOwnedERC20Used
      ? ERC20Amount.sub(
          isDelegatedERC20Used
            ? ERC20LockedAndDelegatedBalance
            : ERC20LockedBalance
        )
      : ZERO

    // calculate erc20 vote amount without delegated balance
    const voteAmount =
      isDelegatedERC20Used &&
      ERC20Amount.gt(tokenBalanceDelegated?.totalBalance || ZERO)
        ? ERC20Amount.sub(tokenBalanceDelegated?.totalBalance || ZERO)
        : ERC20Amount

    const depositNfts = []
    const voteNftIds = [8436]

    return vote(proposalId, depositAmount, depositNfts, voteAmount, voteNftIds)
  }, [
    ERC20Amount,
    ERC20LockedAndDelegatedBalance,
    ERC20LockedBalance,
    isDelegatedERC20Used,
    isOwnedERC20Used,
    tokenBalanceDelegated,
    vote,
  ])

  const handleVoteDelegated = useCallback(() => {
    const proposalId = 9

    // calculate erc20 vote amount without delegated balance
    const voteAmount = ERC20Amount.gt(
      tokenBalanceDelegated?.totalBalance || ZERO
    )
      ? tokenBalanceDelegated?.totalBalance || ZERO
      : ERC20Amount

    const voteNftIds = []

    return voteDelegated(proposalId, voteAmount, voteNftIds)
  }, [ERC20Amount, tokenBalanceDelegated, voteDelegated])

  const handleSubmit = useCallback(async () => {
    await handleVote()

    if (isDelegatedERC20Used) {
      await handleVoteDelegated()
    }
  }, [handleVote, handleVoteDelegated, isDelegatedERC20Used])

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
