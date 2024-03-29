import { ZERO } from "consts"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { useCallback, useMemo, useState } from "react"
import {
  useGovPoolHelperContracts,
  useGovPoolUserVotingPower,
  useGovPoolWithdraw,
  useGovPoolWithdrawableAssets,
} from "hooks/dao"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { multiplyBignumbers } from "utils/formulas"
import { useERC20Data } from "state/erc20/hooks"

import { useGovPoolVotingAssets } from "hooks/dao"
import { useActiveWeb3React } from "hooks"

export enum ButtonTypes {
  INUFICIENT_TOKEN_BALANCE = "INUFICIENT_TOKEN_BALANCE",
  EMPTY_AMOUNT = "EMPTY_AMOUNT",
  SUBMIT = "SUBMIT",
}

// controller for page Voting Terminal
const useVotingTerminal = (daoPoolAddress?: string) => {
  const { account } = useActiveWeb3React()
  // UI controlls
  const [selectOpen, setSelectOpen] = useState(false)
  const { withdraw } = useGovPoolWithdraw(daoPoolAddress)

  // form state
  const [ERC20Amount, setERC20Amount] = useState(ZERO)
  const [ERC20Price, setERC20Price] = useState(ZERO)
  const [ERC721Amount, setERC721Amount] = useState<number[]>([])

  const { govUserKeeperAddress } = useGovPoolHelperContracts(daoPoolAddress)
  const [{ tokenAddress, nftAddress, haveToken, haveNft }] =
    useGovPoolVotingAssets(daoPoolAddress)

  const [fromData] = useERC20Data(tokenAddress)
  const priceUSD = useTokenPriceOutUSD({ tokenAddress })

  const withdrawableAssets = useGovPoolWithdrawableAssets({
    daoPoolAddress,
    delegator: account,
  })

  const ERC20Balance = useMemo(
    () => withdrawableAssets?.tokens || ZERO,
    [withdrawableAssets]
  )

  const ERC721Balance = useMemo(
    () => withdrawableAssets?.nfts[1] || ZERO,
    [withdrawableAssets]
  )

  // get power for all nfts
  const [userOwnedPower] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress || "",
    address: account,
  })

  // merge all lists in one
  const allNftsId = useMemo(() => {
    return withdrawableAssets?.nfts[0].map((v) => v.toString()) || []
  }, [withdrawableAssets])

  // merge all power in one
  const allNftsPower = useMemo(() => {
    return [...userOwnedPower.nftIds].map((v) => v.toString())
  }, [userOwnedPower.nftIds])

  const nftPowerMap = useMemo(() => {
    return allNftsId.reduce((acc, id, index) => {
      return {
        ...acc,
        [id]: allNftsPower[index],
      }
    }, {})
  }, [allNftsId, allNftsPower])

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
        totalPower,
      },
    }
  }, [
    haveToken,
    haveNft,
    fromData,
    nftAddress,
    tokenAddress,
    ERC20Balance,
    ERC721Balance,
    totalPower,
  ])

  // UI button variations
  const buttonType = useMemo(() => {
    if (ERC20Amount.isZero() && ERC721Amount.length === 0) {
      return ButtonTypes.EMPTY_AMOUNT
    }

    if (ERC20Amount.gt(ERC20Balance)) {
      return ButtonTypes.INUFICIENT_TOKEN_BALANCE
    }

    return ButtonTypes.SUBMIT
  }, [ERC20Amount, ERC721Amount.length, ERC20Balance])

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

  // wraps default vote and vote delegated functions
  const handleSubmit = useCallback(async () => {
    if (!account) return

    await withdraw(account, ERC20Amount, ERC721Amount)
  }, [ERC20Amount, ERC721Amount, account, withdraw])

  return {
    account,
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
    handleSubmit,
  }
}

export default useVotingTerminal
