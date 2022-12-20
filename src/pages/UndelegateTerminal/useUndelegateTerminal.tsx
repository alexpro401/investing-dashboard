import { ZERO } from "constants/index"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { useCallback, useMemo, useState } from "react"
import {
  useGovPoolUserVotingPower,
  useGovPoolVotingAssets,
  useGovPoolDelegate,
  useGovPoolWithdrawableAssets,
  useGovPoolHelperContracts,
} from "hooks/dao"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { multiplyBignumbers } from "utils/formulas"
import { useERC20Data } from "state/erc20/hooks"
import { useActiveWeb3React } from "hooks"

export enum ButtonTypes {
  EMPTY_AMOUNT = "EMPTY_AMOUNT",
  SUBMIT = "SUBMIT",
}

// controller for page Undelegate Terminal
const useUndelegateTerminal = (daoPoolAddress?: string, delegatee?: string) => {
  const { account } = useActiveWeb3React()
  // UI controlls
  const [selectOpen, setSelectOpen] = useState(false)

  // form state
  const [ERC20Amount, setERC20Amount] = useState(ZERO)
  const [ERC20Price, setERC20Price] = useState(ZERO)
  const [ERC721Amount, setERC721Amount] = useState<number[]>([])

  const { govUserKeeperAddress } = useGovPoolHelperContracts(daoPoolAddress)
  const { undelegate } = useGovPoolDelegate(daoPoolAddress)
  const [{ tokenAddress, nftAddress, haveToken, haveNft }] =
    useGovPoolVotingAssets(daoPoolAddress)

  const withdrawableAssets = useGovPoolWithdrawableAssets({
    daoPoolAddress,
    delegator: account,
    delegatee,
  })

  const ERC20Balance = withdrawableAssets?.tokens || ZERO
  const ERC721Balance = withdrawableAssets?.nfts[1] || ZERO
  const ERC721Tokens = withdrawableAssets?.nfts[0] || []

  const [fromData] = useERC20Data(tokenAddress)
  const priceUSD = useTokenPriceOutUSD({ tokenAddress })

  // get power for all nfts
  const [delegatedNftPower] = useGovPoolUserVotingPower({
    userKeeperAddress: govUserKeeperAddress,
    address: account,
    useDelegated: true,
  })

  // merge all lists in one
  const allNftsId = useMemo(() => {
    return ERC721Tokens.map((v) => v.toString())
  }, [ERC721Tokens])

  // merge all power in one
  const allNftsPower = useMemo(() => {
    return delegatedNftPower.nftPower.map((v) => v.toString())
  }, [delegatedNftPower.nftPower])

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
        totalPower: totalPower,
        address: account || "",
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
    account,
  ])

  // UI button variations
  const buttonType = useMemo(() => {
    if (ERC20Amount.isZero() && ERC721Amount.length === 0) {
      return ButtonTypes.EMPTY_AMOUNT
    }

    return ButtonTypes.SUBMIT
  }, [ERC20Amount, ERC721Amount.length])

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

  const handleSubmit = useCallback(async () => {
    if (!delegatee) return

    await undelegate(delegatee, ERC20Amount, ERC721Amount)
  }, [ERC20Amount, ERC721Amount, delegatee, undelegate])

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
    handleSubmit,
  }
}

export default useUndelegateTerminal
