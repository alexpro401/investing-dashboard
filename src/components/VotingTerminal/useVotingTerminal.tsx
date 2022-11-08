import { ZERO } from "constants/index"
import { useDelegatedERC721Tokens, useERC721Tokens } from "hooks/useERC721List"
import useGovBalance from "hooks/useGovBalance"
import useGovPoolTokensInfo from "hooks/useGovPoolTokensInfo"
import useNftPower from "hooks/useNftPower"
import {
  IGovNftBalance,
  IGovTokenBalance,
} from "interfaces/contracts/IGovUserKeeper"
import { useCallback, useMemo, useState } from "react"
import { useERC20Data } from "state/erc20/hooks"

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
      return tokenBalance?.totalBalance.add(
        tokenBalanceDelegated?.totalBalance || ZERO
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

  const [selectedNfts, setSelectedNfts] = useState<number[]>([])

  const [{ tokenAddress, nftAddress }] = useGovPoolTokensInfo(daoPoolAddress)
  const { ERC20Balance, ERC721Balance } = useGovMemberBalance(
    daoPoolAddress,
    withDelegated
  )
  const power = useNftPower({ daoPoolAddress })
  const [fromData] = useERC20Data(tokenAddress)

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

  const handleSelect = useCallback((ids: string[]) => {
    setSelectedNfts(ids.map((nft) => Number(nft)))
  }, [])

  const toggleDelegated = (state: boolean) => {
    if (!state) {
      setSelectedNfts((prev) =>
        prev.filter((id) => !delegatedTokens.includes(id))
      )
    }
    setWithDelegated(state)
  }

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
    selectedNfts,
    handleSelect,
    withDelegated,
    toggleDelegated,
    selectOpen,
    setSelectOpen,
  }
}

export default useVotingTerminal
