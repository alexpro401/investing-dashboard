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
import { useERC20Data } from "state/erc20/hooks"
import useGovVotingPower from "hooks/useGovVotingPower"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { multiplyBignumbers } from "utils/formulas"

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

  return { ERC20Balance, ERC721Balance }
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

  const [{ tokenAddress, nftAddress }] = useGovPoolTokensInfo(daoPoolAddress)
  const { ERC20Balance, ERC721Balance } = useGovMemberBalance(
    daoPoolAddress,
    withDelegated
  )

  const [fromData] = useERC20Data(tokenAddress)
  const priceUSD = useTokenPriceOutUSD({ tokenAddress })

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
  }
}

export default useVotingTerminal
