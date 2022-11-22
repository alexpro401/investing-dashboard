import { useCallback } from "react"
import { useAPI } from "api"

function useTokenRating() {
  const { TokenAPI } = useAPI()

  return useCallback(
    async (chainId, tokenAddress) => {
      const price = await TokenAPI.getTokenScore(chainId, tokenAddress)

      if (price && price.points) {
        return price.points
      } else {
        return 0
      }
    },
    [TokenAPI]
  )
}

export default useTokenRating
