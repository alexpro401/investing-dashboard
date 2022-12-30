import { ZERO } from "consts"
import { useInsuranceContract } from "contracts"
import { useCallback, useEffect, useState } from "react"

export const useInsuranceAmount = (account?: string | null) => {
  const insurance = useInsuranceContract()
  const [insuranceAmount, setInsuranceAmount] = useState(ZERO)

  const fetchInsuranceBalance = useCallback(async () => {
    if (!account) return

    const userInsurance = await insurance?.getInsurance(account)

    if (!userInsurance) return
    setInsuranceAmount(userInsurance[1])
  }, [account, insurance])

  useEffect(() => {
    if (!insurance) return

    fetchInsuranceBalance().catch(console.error)
  }, [insurance, fetchInsuranceBalance])

  return insuranceAmount
}

export default useInsuranceAmount
