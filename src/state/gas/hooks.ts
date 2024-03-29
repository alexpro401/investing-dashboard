import { useWeb3React } from "@web3-react/core"
import { GasPriceResponse } from "api/gas-price/types"
import { isNaN } from "lodash"
import { useCallback } from "react"
import { useSelector } from "react-redux"
import { selectGasByChain } from "./selectors"

const useGasTracker = (): [
  GasPriceResponse | null,
  (gasLimit: number) => string
] => {
  const { chainId } = useWeb3React()

  const gas = useSelector(selectGasByChain(chainId))

  const getGasPrice = useCallback(
    (gasLimit: number) => {
      if (!gas) return "0.00"

      const { UsdPrice, ProposeGasPrice } = gas

      const gasPrice =
        (gasLimit * 1.1 * parseFloat(UsdPrice) * parseFloat(ProposeGasPrice)) /
        1000000000

      if (isNaN(gasPrice)) return "0.00"

      return gasPrice.toFixed(2)
    },
    [gas]
  )

  return [gas, getGasPrice]
}

export default useGasTracker
