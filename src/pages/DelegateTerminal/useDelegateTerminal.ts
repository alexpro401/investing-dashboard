import { ZERO } from "constants/index"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { useERC721Tokens, useOwnedERC721Tokens } from "hooks/useERC721List"
import { useCallback, useMemo, useState } from "react"
import {
  useGovPoolUserVotingPower,
  useGovPoolMemberBalance,
  useGovPoolHelperContracts,
  useGovPoolVotingAssets,
  useGovPoolDelegate,
  useGovPoolDeposit,
} from "hooks/dao"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { multiplyBignumbers } from "utils/formulas"
import { useERC20Data } from "state/erc20/hooks"
import {
  useActiveWeb3React,
  useERC20Allowance,
  useERC721Allowance,
} from "hooks"
import { useGovPoolWithdrawableAssetsQuery } from "hooks/dao/useGovPoolWithdrawableAssets"
import { useNavigate } from "react-router-dom"
import { isAddress } from "utils"

export enum ButtonTypes {
  UNLOCK = "UNLOCK",
  INUFICIENT_TOKEN_BALANCE = "INUFICIENT_TOKEN_BALANCE",
  EMPTY_AMOUNT = "EMPTY_AMOUNT",
  DEPOSIT = "DEPOSIT",
  SUBMIT = "SUBMIT",
}

// controller for page Delegate Terminal
const useDelegateTerminal = (daoPoolAddress?: string, delegatee?: string) => {
  const { account } = useActiveWeb3React()
  const [selectOpen, setSelectOpen] = useState(false)

  const navigate = useNavigate()

  const setDelegatee = useCallback(
    (value: string) =>
      isAddress(value) && navigate(`/dao/${daoPoolAddress}/delegate/${value}`),
    [daoPoolAddress, navigate]
  )

  // form state
  const [ERC20Amount, setERC20Amount] = useState(ZERO)
  const [ERC20Price, setERC20Price] = useState(ZERO)
  const [ERC721Amount, setERC721Amount] = useState<number[]>([])

  const { delegate } = useGovPoolDelegate(daoPoolAddress)
  const { govUserKeeperAddress } = useGovPoolHelperContracts(daoPoolAddress)
  const deposit = useGovPoolDeposit(daoPoolAddress ?? "")

  const withdrawableAssets = useGovPoolWithdrawableAssetsQuery({
    daoPoolAddress,
    params: useMemo(() => [{ delegator: account }], [account]),
  })[0]

  const depositedERC20Balance = withdrawableAssets[0] || ZERO
  const depositedERC721Tokens = useMemo(() => {
    try {
      return withdrawableAssets[1][0].map((v: BigNumber) => v.toNumber())
    } catch (error) {
      return []
    }
  }, [withdrawableAssets])

  const [{ tokenAddress, nftAddress, haveToken, haveNft }] =
    useGovPoolVotingAssets(daoPoolAddress)
  const { ERC20Balance, ERC721Balance, tokenBalanceLocked } =
    useGovPoolMemberBalance(daoPoolAddress)

  const [fromData] = useERC20Data(tokenAddress)
  const priceUSD = useTokenPriceOutUSD({ tokenAddress })

  const ERC721OwnedBalance = useOwnedERC721Tokens(daoPoolAddress)

  const { allowances: ERC20Allowances, updateAllowance: updateERC20Allowance } =
    useERC20Allowance([tokenAddress], govUserKeeperAddress)

  const {
    allowances: ERC721Allowances,
    updateAllowance: updateERC721Allowance,
  } = useERC721Allowance(nftAddress, ERC721OwnedBalance, govUserKeeperAddress)

  // get power for all nfts
  const [userOwnedPower] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress,
    address: account,
  })

  // user nfts ids lists
  const userTokens = useERC721Tokens(daoPoolAddress)

  // merge all lists in one
  const allNftsId = useMemo(() => {
    return userTokens.map((v) => v.toString())
  }, [userTokens])

  // merge all power in one
  const allNftsPower = useMemo(() => {
    return userOwnedPower.nftIds.map((v) => v.toString())
  }, [userOwnedPower.nftIds])

  const nftPowerMap = useMemo(() => {
    return allNftsId.reduce((acc, id, index) => {
      return {
        ...acc,
        [id]: allNftsPower[index],
      }
    }, {})
  }, [allNftsId, allNftsPower])

  const isOwnedERC20Used = useMemo(() => {
    return ERC20Amount.gt(tokenBalanceLocked)
  }, [ERC20Amount, tokenBalanceLocked])

  const isERC20Approved = useMemo(() => {
    if (!isOwnedERC20Used) return true

    return ERC20Allowances[tokenAddress]?.gte(
      ERC20Amount.sub(tokenBalanceLocked)
    )
  }, [
    ERC20Amount,
    ERC20Allowances,
    isOwnedERC20Used,
    tokenAddress,
    tokenBalanceLocked,
  ])

  const isERC20Deposited = useMemo(() => {
    return ERC20Amount.lte(depositedERC20Balance)
  }, [ERC20Amount, depositedERC20Balance])

  const ownedERC721Selected = useMemo(() => {
    return ERC721Amount.filter((id) => ERC721OwnedBalance.includes(id))
  }, [ERC721Amount, ERC721OwnedBalance])

  const unapprowedERC721Selected = useMemo(() => {
    return ownedERC721Selected.filter(
      (id) =>
        ERC721Allowances[id].toLocaleLowerCase() !==
          govUserKeeperAddress.toLocaleLowerCase() &&
        !depositedERC721Tokens.includes(id)
    )
  }, [
    ownedERC721Selected,
    ERC721Allowances,
    govUserKeeperAddress,
    depositedERC721Tokens,
  ])

  const undepositedERC721Selected = useMemo(() => {
    return ERC721Amount.filter(
      (id) =>
        !depositedERC721Tokens.includes(id) &&
        !unapprowedERC721Selected.includes(id)
    )
  }, [ERC721Amount, depositedERC721Tokens, unapprowedERC721Selected])

  const totalPower = useMemo(() => {
    return ERC721Amount.reduce(
      (acc, id) => acc.add(nftPowerMap[id] || ZERO),
      ZERO
    ).add(ERC20Amount)
  }, [nftPowerMap, ERC721Amount, ERC20Amount])

  // UI data
  const formInfo = useMemo(() => {
    return {
      haveToken,
      haveNft,
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
      address: {
        totalPower: totalPower,
        delegatee: delegatee,
      },
    }
  }, [
    haveToken,
    haveNft,
    tokenAddress,
    fromData,
    ERC20Balance,
    nftAddress,
    ERC721Balance,
    totalPower,
    delegatee,
  ])

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

    if (!isERC20Deposited || !!undepositedERC721Selected.length) {
      return ButtonTypes.DEPOSIT
    }

    return ButtonTypes.SUBMIT
  }, [
    ERC20Amount,
    ERC20Balance,
    isERC20Approved,
    isERC20Deposited,
    ERC721Amount.length,
    unapprowedERC721Selected.length,
    undepositedERC721Selected.length,
  ])

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
      const amount = !isERC20Deposited
        ? ERC20Amount.sub(depositedERC20Balance)
        : ZERO

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
    isERC20Deposited,
    ERC20Amount,
    depositedERC20Balance,
    updateERC20Allowance,
    tokenAddress,
    updateERC721Allowance,
  ])

  const handleDeposit = useCallback(() => {
    if (!account) return

    const erc20 = !isERC20Deposited
      ? ERC20Amount.sub(depositedERC20Balance)
      : ZERO

    const erc721 = undepositedERC721Selected.length
      ? undepositedERC721Selected
      : []

    return deposit(account, erc20, erc721)
  }, [
    ERC20Amount,
    account,
    deposit,
    depositedERC20Balance,
    isERC20Deposited,
    undepositedERC721Selected,
  ])

  const handleSubmit = useCallback(async () => {
    if (!isERC20Deposited || !!undepositedERC721Selected.length) {
      await handleDeposit()
      return
    }

    if (!delegatee) return

    const erc20Amount = ERC20Amount

    const depositNfts = ERC721Amount

    // TODO: deposit

    await delegate(delegatee, erc20Amount, depositNfts)
  }, [
    isERC20Deposited,
    undepositedERC721Selected.length,
    delegatee,
    ERC20Amount,
    ERC721Amount,
    delegate,
    handleDeposit,
  ])

  return {
    formInfo,
    allNftsId,
    ERC721Amount,
    handleERC721Change,
    selectOpen,
    setSelectOpen,
    handleERC20Change,
    ERC20Amount,
    ERC20Price,
    nftPowerMap,
    buttonType,
    handleApprove,
    handleSubmit,
    setDelegatee,
  }
}

export default useDelegateTerminal
