import { ZERO_ADDR } from "constants/index"
import { useEffect, useState } from "react"
import { useAPI } from "api"
import { useActiveWeb3React } from "hooks"

export const useOwnedERC721Tokens = (nftAddress?: string) => {
  const { account, chainId } = useActiveWeb3React()
  const [ids, setIds] = useState<string[]>([])
  const api = useAPI()

  useEffect(() => {
    if (!api || !account || !chainId) return

    if (!nftAddress || nftAddress === ZERO_ADDR) return
    ;(async () => {
      try {
        const data = await api.nft.getNftsByWallet(account, chainId, nftAddress)

        setIds(data)
      } catch (e) {
        console.error("useOwnedERC721Tokens error: ", e)
      }
    })()
  }, [account, api, chainId, nftAddress])

  return ids
}

export const useLockedERC721Tokens = () => {
  return
}

export const useDelegatedERC721Tokens = () => {
  return
}

export const useGrantedERC721Tokens = () => {
  return
}
