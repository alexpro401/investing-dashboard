import { useWeb3React } from "@web3-react/core"
import { useAPI } from "api"
import { FC, useCallback, useEffect, useMemo } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "state"
import { updateGasData } from "./actions"

export const GasPriceUpdater: FC = () => {
  const { chainId } = useWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { GasPriceAPI } = useAPI()

  const fetchGasDataBSC = useCallback(async () => {
    return await GasPriceAPI.getGasPrice()
  }, [GasPriceAPI])

  const trackerByChain = useMemo(() => {
    return {
      56: fetchGasDataBSC,
      97: fetchGasDataBSC,
    }
  }, [fetchGasDataBSC])

  const handleGasUpdate = useCallback(async () => {
    if (!chainId) return

    const result = await trackerByChain[chainId]()

    if (result) {
      const gasData =
        chainId === 97 ? { ...result, ProposeGasPrice: "10" } : result

      dispatch(updateGasData({ chainId, response: gasData }))
    }
  }, [chainId, dispatch, trackerByChain])

  // update gas price every 1,5 minutes
  useEffect(() => {
    handleGasUpdate().catch(console.error)
    const interval = setInterval(handleGasUpdate, 90 * 1000)

    return () => clearInterval(interval)
  }, [handleGasUpdate])

  return null
}
