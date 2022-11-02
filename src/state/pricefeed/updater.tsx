/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import { useDispatch, useSelector } from "react-redux"

import { PriceFeed } from "abi"
import useContract from "hooks/useContract"
import { updateWhitelist } from "./actions"
import { AppDispatch, AppState } from "state"
import whitelist from "constants/whitelisted"
import { ContractsState } from "state/contracts/reducer"

export const PriceFeedUpdater: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { chainId } = useWeb3React()

  const priceFeedAddress = useSelector<AppState, ContractsState["PriceFeed"]>(
    (state) => {
      return state.contracts.PriceFeed
    }
  )

  const priceFeed = useContract(priceFeedAddress, PriceFeed)

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
