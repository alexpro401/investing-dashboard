import { useForceUpdate } from "hooks/useForceUpdate"
import { parseEther } from "@ethersproject/units"
import { ZERO } from "consts"
import { useInsuranceContract, usePriceFeedContract } from "contracts"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { selectDexeAddress } from "state/contracts/selectors"
import { isAddress } from "utils"
import { multiplyBignumbers } from "utils/formulas"

export const useInsuranceAmount = (account?: string | null) => {
  const insurance = useInsuranceContract()
  const priceFeed = usePriceFeedContract()
  const dexeAddress = useSelector(selectDexeAddress)

  const [insuranceAmount, setInsuranceAmount] = useState(ZERO)
  const [stakeAmount, setStakeAmount] = useState(ZERO)
  const [dexePriceUSD, setDexePriceUSD] = useState(ZERO)

  const [updateObserver, update] = useForceUpdate()

  const insuranceAmountUSD = useMemo(
    () => multiplyBignumbers([insuranceAmount, 18], [dexePriceUSD, 18]),
    [dexePriceUSD, insuranceAmount]
  )
  const fetchDexePrice = useCallback(async () => {
    if (!priceFeed || !isAddress(dexeAddress)) return

    const price = await priceFeed.getNormalizedPriceOutUSD(
      dexeAddress,
      parseEther("1")
    )
    setDexePriceUSD(price[0])
  }, [dexeAddress, priceFeed])

  const fetchInsuranceBalance = useCallback(async () => {
    if (!account || !insurance) return

    const userInsurance = await insurance?.getInsurance(account)

    if (!userInsurance) return
    setInsuranceAmount(userInsurance[1])
    setStakeAmount(userInsurance[0])
  }, [account, insurance])

  // update insurance balance on account change
  useEffect(() => {
    fetchInsuranceBalance().catch(console.error)
  }, [updateObserver, fetchInsuranceBalance])

  // update insurance amount in USD on insuranceAmount change
  useEffect(() => {
    fetchDexePrice().catch(console.log)
  }, [updateObserver, fetchDexePrice])

  return [
    {
      insuranceAmount,
      stakeAmount,
      insuranceAmountUSD,
    },
    update,
  ] as const
}

export default useInsuranceAmount
