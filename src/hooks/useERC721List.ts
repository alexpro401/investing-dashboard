import { useMemo, useState } from "react"
import { useDebounce } from "react-use"
import { useAPI } from "api"

import { IGovNftExactBalance } from "interfaces/contracts/IGovUserKeeper"
import { ZERO_ADDR } from "constants/index"

import { useActiveWeb3React } from "hooks"
import useERC721TokenOwnerMulticall from "hooks/useERC721TokenOwner"
import {
  useGovPoolVotingAssets,
  useGovBalance,
  useGovPoolHelperContracts,
} from "hooks/dao"

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

export const useERC721TokensList = (daoPoolAddress?: string) => {
  const { account } = useActiveWeb3React()
  const { govUserKeeperAddress } = useGovPoolHelperContracts(daoPoolAddress)
  const [{ nftAddress }] = useGovPoolVotingAssets(daoPoolAddress)
  const tokenIds = useERC721Tokens(daoPoolAddress)

  const [erc721OwnerById] = useERC721TokenOwnerMulticall({
    contractAddress: nftAddress,
    tokenIds: tokenIds,
  })

  const ownedERC721 = useMemo(
    () =>
      tokenIds.filter((id) => {
        try {
          return (
            erc721OwnerById[id]?.toLocaleLowerCase() ===
            account?.toLocaleLowerCase()
          )
        } catch {
          return false
        }
      }),
    [erc721OwnerById, tokenIds, account]
  )

  const depositedERC721 = useMemo(
    () =>
      tokenIds.filter((id) => {
        try {
          return (
            erc721OwnerById[id]?.toLocaleLowerCase() ===
            govUserKeeperAddress.toLocaleLowerCase()
          )
        } catch {
          return false
        }
      }),
    [erc721OwnerById, tokenIds, govUserKeeperAddress]
  )

  return useMemo(
    () => ({
      ownedERC721,
      depositedERC721,
    }),
    [ownedERC721, depositedERC721]
  )
}

// only user WALLET tokens
export const useOwnedERC721Tokens = (daoPoolAddress?: string) => {
  const [{ nftAddress }] = useGovPoolVotingAssets(daoPoolAddress)
  const { account, chainId } = useActiveWeb3React()
  const [ids, setIds] = useState<number[]>([])
  const { NFTAPI } = useAPI()

  const [] = useDebounce(
    async () => {
      if (!NFTAPI || !account || !chainId) return

      if (!nftAddress || nftAddress === ZERO_ADDR) return

      try {
        const data = await NFTAPI.getNftsByWallet(
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
    [NFTAPI, account, chainId, nftAddress]
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
