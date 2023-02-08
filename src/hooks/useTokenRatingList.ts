import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { useWeb3React } from "@web3-react/core"
import { useTokenRating } from "hooks"

export const useTokenRatingList = (
  tokenAddressList: string[]
): [Record<string, number>, boolean] => {
  const { chainId } = useWeb3React()
  const getTokenRating = useTokenRating()

  const [loading, setLoading] = React.useState<boolean>(true)
  const [tokenRatingList, setTokenRatingList] = React.useState<
    Record<string, number>
  >({})

  const loadTokenRatings = React.useCallback(async () => {
    if (isNil(chainId) || isEmpty(tokenAddressList)) return {}
    try {
      setLoading(true)
      const res = {}

      for (const tokenAddress of tokenAddressList) {
        res[tokenAddress] = await getTokenRating(chainId, tokenAddress)
      }

      return res
    } catch (error) {
      console.error(error)
      return {}
    }
  }, [chainId, getTokenRating, tokenAddressList])

  React.useEffect(() => {
    loadTokenRatings()
      .then((res) => setTokenRatingList(res))
      .finally(() => setLoading(false))
  }, [loadTokenRatings])

  return [tokenRatingList, loading]
}
