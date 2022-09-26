import { useQuery } from "urql"
import { isEmpty } from "lodash"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"
import { useCallback, useEffect, useMemo, useState } from "react"

import { ZERO } from "constants/index"
import { InsurancDueDay } from "queries/investors"
import { Insurance } from "interfaces/thegraphs/investors"
import { selectDexeAddress } from "state/contracts/selectors"
import { useInsuranceContract, usePriceFeedContract } from "hooks/useContract"

interface IValues {
  stakeDexe: BigNumber
  insuranceDexe: BigNumber
  insuranceUSD: BigNumber
}

function useInsurance(): [IValues, boolean, () => void] {
  const { account } = useWeb3React()
  const priceFeed = usePriceFeedContract()
  const insurance = useInsuranceContract()

  const dexeAddress = useSelector(selectDexeAddress)

  const [loading, setLoading] = useState(true)

  const [stakeAmount, setStakeAmount] = useState(ZERO)
  const [insuranceAmount, setInsuranceAmount] = useState(ZERO)
  const [insuranceAmountUSD, setInsuranceAmountUSD] = useState(ZERO)

  const fetchInsuranceAmountInUSD = useCallback(async () => {
    setLoading(true)
    const price = await priceFeed?.getNormalizedPriceOutUSD(
      dexeAddress,
      insuranceAmount
    )

    setInsuranceAmountUSD(price[0])
    setLoading(false)
  }, [dexeAddress, insuranceAmount, priceFeed])

  const fetchInsuranceBalance = useCallback(async () => {
    setLoading(true)
    const userInsurance = await insurance?.getInsurance(account)
    setStakeAmount(userInsurance[0])
    setInsuranceAmount(userInsurance[1])
    setLoading(false)
  }, [account, insurance])

  useEffect(() => {
    if (!insurance || !account) return

    fetchInsuranceBalance().catch(console.log)
  }, [insurance, account, fetchInsuranceBalance])

  useEffect(() => {
    if (!priceFeed || !account) return

    fetchInsuranceAmountInUSD().catch(console.log)
  }, [priceFeed, account, insuranceAmount, fetchInsuranceAmountInUSD])

  return [
    {
      stakeDexe: stakeAmount,
      insuranceDexe: insuranceAmount,
      insuranceUSD: insuranceAmountUSD,
    },
    loading,
    fetchInsuranceBalance,
  ]
}

export default useInsurance

export const useInsuranceDueDay = (
  day
): [
  { data: Insurance | undefined | null; loading: boolean; error: any },
  () => void
] => {
  const { account } = useWeb3React()

  const pause = useMemo(() => !account || !day || isEmpty(day), [day, account])

  const [response, refetch] = useQuery<{
    insuranceHistories: Insurance[]
  }>({
    query: InsurancDueDay,
    variables: { account, day },
    pause,
  })

  return [
    {
      data: pause ? undefined : response?.data?.insuranceHistories[0] ?? null,
      loading: response.fetching,
      error: response.error,
    },
    refetch,
  ]
}
