/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch } from "react-redux"

import { updateWhitelist } from "./actions"
import { AppDispatch } from "state"
import whitelist from "consts/whitelisted"
import { usePriceFeedContract } from "contracts"

export const PriceFeedUpdater: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { chainId } = useWeb3React()

  const priceFeed = usePriceFeedContract()

  useEffect(() => {
    if (!priceFeed) {
      return
    }

    // get whitelist tokens list
    ;(async () => {
      try {
        // const total: number = await priceFeed.totalBaseTokens()
        // const list: string[] = await priceFeed.getBaseTokens(0, total)
        dispatch(updateWhitelist({ params: whitelist[chainId || 0] }))
      } catch (e) {
        console.log(e)
      }
    })()
  }, [priceFeed])
  return null
}

export default {}
