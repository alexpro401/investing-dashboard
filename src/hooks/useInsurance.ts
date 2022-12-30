import { useQuery } from "urql"
import { isEmpty, isNil } from "lodash"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"
import { useCallback, useEffect, useMemo, useState } from "react"

import { ZERO } from "consts"
import { InsurancDueDay } from "queries/investors"
import { Insurance } from "interfaces/thegraphs/investors"
import { selectDexeAddress } from "state/contracts/selectors"
import { useInsuranceContract, usePriceFeedContract } from "contracts"
import useTokenPriceOutUSD from "./useTokenPriceOutUSD"
import { InsuranceAccidentInvestorsTotalsInfo } from "../interfaces/insurance"
import { divideBignumbers, multiplyBignumbers } from "../utils/formulas"
import { parseTransactionError } from "../utils"
import useError from "./useError"

interface IValues {
  stakeDexe: BigNumber
  insuranceDexe: BigNumber
  insuranceUSD: BigNumber
}

export function useInsurance(): [IValues, boolean, () => void] {
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

    setLoading(false)
    if (!price) return
    setInsuranceAmountUSD(price[0])
  }, [dexeAddress, insuranceAmount, priceFeed])

  const fetchInsuranceBalance = useCallback(async () => {
    setLoading(true)
    const userInsurance = await insurance!.getInsurance(account!)
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

export const useInsuranceDueDay = (
  day
): [{ data: Insurance; loading: boolean; error: any }, () => void] => {
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
      data: pause
        ? ({} as Insurance)
        : response?.data?.insuranceHistories[0] ?? ({} as Insurance),
      loading: response.fetching,
      error: response.error,
    },
    refetch,
  ]
}

export const useInsuranceAccidentTotals = (
  investorsTotals: InsuranceAccidentInvestorsTotalsInfo
) => {
  const [, setError] = useError()
  const insurance = useInsuranceContract()
  const dexeAddress = useSelector(selectDexeAddress)
  const dexePrice = useTokenPriceOutUSD({
    tokenAddress: dexeAddress,
  })

  const [insuranceTreasuryDEXE, setInsuranceTreasuryDEXE] = useState(ZERO)

  const insuranceTreasuryUSD = useTokenPriceOutUSD({
    tokenAddress: dexeAddress,
    amount: insuranceTreasuryDEXE,
  })

  const totalLossDEXE = useMemo(() => {
    if (
      isNil(dexePrice) ||
      isNil(investorsTotals) ||
      BigNumber.from(investorsTotals.loss).isZero()
    ) {
      return ZERO
    }

    return divideBignumbers(
      [BigNumber.from(investorsTotals.loss), 18],
      [BigNumber.from(dexePrice), 18]
    )
  }, [dexePrice, investorsTotals])

  const totalLossUSD = useMemo(() => {
    if (
      isNil(investorsTotals) ||
      BigNumber.from(investorsTotals.loss).isZero()
    ) {
      return ZERO
    }

    return BigNumber.from(investorsTotals.loss)
  }, [investorsTotals])

  const totalCoverageDEXE = useMemo(() => {
    if (
      isNil(investorsTotals) ||
      BigNumber.from(investorsTotals.coverage).isZero()
    ) {
      return ZERO
    }

    return BigNumber.from(investorsTotals.coverage)
  }, [investorsTotals])

  const totalCoverageUSD = useMemo(() => {
    if (
      isNil(dexePrice) ||
      isNil(investorsTotals) ||
      BigNumber.from(investorsTotals.coverage).isZero()
    ) {
      return ZERO
    }

    return multiplyBignumbers(
      [BigNumber.from(investorsTotals.coverage), 18],
      [BigNumber.from(dexePrice), 18]
    )
  }, [investorsTotals, dexePrice])

  useEffect(() => {
    if (!insurance) {
      return
    }
    ;(async () => {
      try {
        const maxTreasuryPayout = await insurance.getMaxTreasuryPayout()

        if (!isNil(maxTreasuryPayout)) {
          setInsuranceTreasuryDEXE(maxTreasuryPayout)
        }
      } catch (error: any) {
        if (!!error && !!error.data && !!error.data.message) {
          setError(error.data.message)
        } else {
          const errorMessage = parseTransactionError(error.toString())
          !!errorMessage && setError(errorMessage)
        }
      }
    })()
  }, [insurance])

  return {
    insuranceTreasuryDEXE,
    insuranceTreasuryUSD,

    totalLossDEXE,
    totalLossUSD,

    totalCoverageDEXE,
    totalCoverageUSD,
  }
}
