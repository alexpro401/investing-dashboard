import { useQuery } from "urql"
import { isEmpty, isNil } from "lodash"
import { useDispatch, useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"
import { useCallback, useEffect, useMemo, useState } from "react"

import { ZERO } from "constants/index"
import { InsurancDueDay } from "queries/investors"
import { Insurance } from "interfaces/thegraphs/investors"
import { selectDexeAddress } from "state/contracts/selectors"
import { useInsuranceContract, usePriceFeedContract } from "hooks/useContract"
import { getIpfsData } from "utils/ipfs"
import { addInsuranceAccident } from "state/ipfsMetadata/actions"
import {
  selectInsuranceAccidentByPool,
  selectInsuranceAccidents,
} from "state/ipfsMetadata/selectors"
import { InsuranceAccident } from "interfaces/insurance"

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

export const useInsuranceAccidents = (): {
  loading: boolean
  total: number
  data: Record<string, InsuranceAccident>
  insuranceAccidentByPool: InsuranceAccident | null
  getInsuranceAccidentByPool: (pool: string) => void
} => {
  const dispatch = useDispatch()
  const insurance = useInsuranceContract()

  const [loading, setLoading] = useState<boolean>(true)
  const [total, setTotal] = useState<number>(0)
  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const fullLoaded = useMemo(() => offset === total, [offset, total])

  const [searchPool, setSearchPool] = useState("")

  const data = useSelector(selectInsuranceAccidents())
  const insuranceAccidentByPool = useSelector(
    selectInsuranceAccidentByPool(searchPool)
  )

  const fetch = useCallback(async () => {
    if (isNil(insurance)) return

    setLoading(true)
    const totalActiveAccidents = await insurance.ongoingClaimsCount()
    setTotal(Number(totalActiveAccidents.toString()))

    const activeAccidents = await insurance.listOngoingClaims(
      offset,
      Number(totalActiveAccidents.toString())
    )

    for (const accidentId of activeAccidents) {
      const accidentData = await getIpfsData(accidentId)

      dispatch(
        addInsuranceAccident({
          params: { hash: accidentId, data: accidentData },
        })
      )
    }

    setOffset(activeAccidents.length)
    setLoading(false)
  }, [insurance])

  const getInsuranceAccidentByPool = useCallback((pool) => {
    setSearchPool(pool)
  }, [])

  useEffect(() => {
    if (isNil(insurance)) return
    ;(async () => {
      setLoading(true)
      await fetch()
      setLoading(false)
    })()
  }, [insurance])

  return {
    loading,
    total,
    data,
    insuranceAccidentByPool,
    getInsuranceAccidentByPool,
  }
}
