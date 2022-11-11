import { IGovNftExactBalance } from "./../interfaces/contracts/IGovUserKeeper"
import { ZERO_ADDR } from "constants/index"
import { useMemo, useState } from "react"
import { useAPI } from "api"
import { useActiveWeb3React } from "hooks"
import { useGovPoolVotingAssets, useGovBalance } from "hooks/dao"
import { useDebounce } from "react-use"

// user WALLET tokens + DAO pool tokens
export const useERC721Tokens = (daoPoolAddress?: string) => {
  const nftBalance = useGovBalance<IGovNftExactBalance>({
    daoPoolAddress,
    method: "nftExactBalance",
  })

  return useMemo(
    () =>
      nftBalance?.nfts ? nftBalance?.nfts.map((nft) => nft.toNumber()) : [],
    [nftBalance]
  )
}

// only user WALLET tokens
export const useOwnedERC721Tokens = (daoPoolAddress?: string) => {
  const [{ nftAddress }] = useGovPoolVotingAssets(daoPoolAddress)
  const { account, chainId } = useActiveWeb3React()
  const [ids, setIds] = useState<number[]>([])
  const api = useAPI()

  const [] = useDebounce(
    async () => {
      if (!api || !account || !chainId) return

      if (!nftAddress || nftAddress === ZERO_ADDR) return

      try {
        const data = await api.nft.getNftsByWallet(
          account!,
          chainId!,
          nftAddress
        )

        setIds(data)
      } catch (e) {
        console.error("useOwnedERC721Tokens error: ", e)
      }
    },
    100,
    [api, account, chainId, nftAddress]
  )

  return ids
}

// only DAO pool tokens
export const useLockedERC721Tokens = (daoPoolAddress?: string) => {
  const ownedList = useOwnedERC721Tokens(daoPoolAddress)

  const nftBalance = useGovBalance<IGovNftExactBalance>({
    daoPoolAddress,
    method: "nftExactBalance",
  })

  const balance = useMemo(
    () =>
      nftBalance?.nfts ? nftBalance?.nfts.map((nft) => nft.toNumber()) : [],
    [nftBalance]
  )

  return useMemo(
    () => balance.filter((id) => !ownedList.includes(id)),
    [balance, ownedList]
  )
}

// DAO pool user delegated tokens
export const useDelegatedERC721Tokens = (daoPoolAddress?: string) => {
  const nftBalance = useGovBalance<IGovNftExactBalance>({
    daoPoolAddress,
    method: "nftExactBalance",
    isMicroPool: true,
  })

  return useMemo(
    () =>
      nftBalance?.nfts ? nftBalance.nfts.map((nft) => nft.toNumber()) : [],
    [nftBalance]
  )
}

// tokens that user granted to someone
export const useGrantedERC721Tokens = (daoPoolAddress?: string) => {
  // own nft balance without delegated (used to filter out delegated tokens)
  const nftBalance = useGovBalance<IGovNftExactBalance>({
    daoPoolAddress,
    method: "nftExactBalance",
  })

  // delegated nft + own nft
  const nftWithDelegatedBalance = useGovBalance<IGovNftExactBalance>({
    daoPoolAddress,
    method: "nftExactBalance",
    useDelegated: true,
  })

  const balance = useMemo(
    () =>
      nftBalance?.nfts ? nftBalance.nfts.map((nft) => nft.toNumber()) : [],
    [nftBalance]
  )

  const delegatedBalance = useMemo(
    () =>
      nftWithDelegatedBalance?.nfts
        ? nftWithDelegatedBalance.nfts.map((nft) => nft.toNumber())
        : [],
    [nftWithDelegatedBalance]
  )

  return useMemo(
    () => delegatedBalance.filter((id) => !balance.includes(id)),
    [balance, delegatedBalance]
  )
}
