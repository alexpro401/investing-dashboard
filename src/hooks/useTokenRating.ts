import axios from "axios"
import { useCallback } from "react"
import { ChainNameById } from "constants/chains"

function useTokenRating() {
  return useCallback(async (chainId, tokenAddress) => {
    const price = await axios.get(
      `https://api-staging.kattana.trade/tokens/${ChainNameById[chainId]}/${tokenAddress}/score`
    )

    if (price && price.data.points) {
      return price.data.points
    } else {
      return 0
    }
  }, [])
}

export default useTokenRating
