import { useCallback, useMemo, useState } from "react"

import { ZERO } from "consts"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"

import {
  useActiveWeb3React,
  useERC721Allowance,
  useERC721GovBalance,
  useERC20Allowance,
  useTokenPriceOutUSD,
  useGovPoolVote,
  useGovPoolHelperContracts,
  useGovPoolVotingAssets,
} from "hooks"

import { useERC20Data } from "state/erc20/hooks"
import { multiplyBignumbers } from "utils/formulas"
import { useNftPowerMap } from "./useNftPowerMap"
import { useVotingBalances } from "./useVotingBalances"

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

  const { allNftsId, availableERC721Ids, tokenBalances } = useVotingBalances({
    daoPoolAddress,
    proposalId,
    withDelegated,
    account,
  })

  const nftPowerMap = useNftPowerMap({
    govUserKeeperAddress,
    account,
    withDelegated,
    allNftsId,
  })

  const ERC20DepositAmount = useMemo(() => {
    return ERC20Amount.sub(
      withDelegated
        ? tokenBalances.erc20LockedAndDelegatedBalanceWithoutVotes
        : tokenBalances.erc20LockedWithoutVotes
    )
  }, [
    ERC20Amount,
    withDelegated,
    tokenBalances.erc20LockedAndDelegatedBalanceWithoutVotes,
    tokenBalances.erc20LockedWithoutVotes,
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

    return ERC20Allowances[tokenAddress]?.gte(ERC20DepositAmount)
  }, [ERC20Allowances, ERC20DepositAmount, isOwnedERC20Used, tokenAddress])

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
      updateERC20Allowance(tokenAddress, ERC20DepositAmount)
      return
    }

    // approve erc721
    if (unapprowedERC721Selected.length) {
      const id = unapprowedERC721Selected[0]
      updateERC721Allowance(id)
    }
  }, [
    ERC20DepositAmount,
    isERC20Approved,
    tokenAddress,
    unapprowedERC721Selected,
    updateERC20Allowance,
    updateERC721Allowance,
  ])

  const handleVote = useCallback(
    (proposalId: number) => {
      if (!account) return

      // calculate erc20 deposit amount without locked and delegated and voted balance
      const depositAmount = isOwnedERC20Used ? ERC20DepositAmount : ZERO

      const ERC20AmountExceptDelegated = ERC20Amount.gt(
        tokenBalances.erc20DelegatedWithoutVotes
      )
        ? ERC20Amount.sub(tokenBalances.erc20DelegatedWithoutVotes)
        : ZERO

      // calculate erc20 vote amount without delegated balance
      const voteAmount = withDelegated
        ? ERC20AmountExceptDelegated
        : ERC20Amount

      const depositNfts = ownedERC721Selected
      const voteNftIds = ERC721Amount.filter(
        (id) => !erc721Balances.delegatedBalance.includes(id)
      )

      if (voteAmount.isZero() && voteNftIds.length === 0) return

      return vote(
        account,
        proposalId,
        depositAmount,
        depositNfts,
        voteAmount,
        voteNftIds
      )
    },
    [
      account,
      isOwnedERC20Used,
      ERC20DepositAmount,
      withDelegated,
      ERC20Amount,
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
      const voteAmount = ERC20Amount.gte(tokenBalances.erc20DelegatedBalance)
        ? tokenBalances.erc20DelegatedBalance
        : ERC20Amount

      const voteNftIds = delegatedERC721Selected

      return voteDelegated(proposalId, voteAmount, voteNftIds)
    },
    [
      ERC20Amount,
      delegatedERC721Selected,
      tokenBalances.erc20DelegatedBalance,
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
    } finally {
      setERC20Amount(ZERO)
      setERC721Amount([])
      setERC20Price(ZERO)
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
    availableERC721Ids,
    ERC721Amount,
    ERC721Voted: tokenBalances.erc721TotalVoted,
    ERC20DepositAmount,
    isERC20Approved,
    unapprowedERC721Selected,
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
