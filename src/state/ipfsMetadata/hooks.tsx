import { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { isNil } from "lodash"

import { getIpfsData } from "utils/ipfs"

import {
  selectInsuranceAccident,
  selectInsuranceAccidentByPool,
  selectInsuranceAccidents,
  selectinvestProposalMetadata,
  selectPoolMetadata,
  selectUserMetadata,
} from "./selectors"
import { addInsuranceAccident, addPool, addProposal, addUser } from "./actions"
import { IInvestProposalMetadata, IUserMetadata } from "./types"
import { InsuranceAccident } from "interfaces/insurance"
import { useInsuranceContract } from "contracts"
import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

export function usePoolMetadata(poolId, hash) {
  const dispatch = useDispatch()
  const poolMetadata = useSelector(selectPoolMetadata(poolId, hash))
  const [loading, setLoading] = useState(false)

  const fetchPoolMetadata = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getIpfsData(hash)
      if (data) {
        dispatch(addPool({ params: { poolId, hash, ...data } }))
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [dispatch, hash, poolId])

  useEffect(() => {
    if (!poolId || !hash) return
    if (poolMetadata === null) {
      fetchPoolMetadata()
    }
  }, [poolId, hash, poolMetadata, dispatch, fetchPoolMetadata])

  return [{ poolMetadata, loading }, { fetchPoolMetadata }]
}

export function useUserMetadata(
  hash
): [
  { userMetadata: IUserMetadata | null; loading: boolean },
  { fetchUserMetadata: () => void }
] {
  const dispatch = useDispatch()
  const userMetadata = useSelector(selectUserMetadata(hash))
  const [loading, setLoading] = useState(false)

  const fetchUserMetadata = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getIpfsData(hash)
      if (data) {
        dispatch(addUser({ params: { hash, ...data } }))
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [dispatch, hash])

  useEffect(() => {
    if (!hash) return
    if (userMetadata === null) {
      fetchUserMetadata()
    }
  }, [hash, userMetadata, dispatch, fetchUserMetadata])

  return [{ userMetadata, loading }, { fetchUserMetadata }]
}

export function useInvestProposalMetadata(
  poolId,
  hash
): [
  { investProposalMetadata: IInvestProposalMetadata | null; loading: boolean },
  { fetchInvestProposalMetadata: () => void }
] {
  const dispatch = useDispatch()
  const investProposalMetadata = useSelector(
    selectinvestProposalMetadata(poolId, hash)
  )
  const [loading, setLoading] = useState(false)

  const fetchInvestProposalMetadata = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getIpfsData(hash)
      if (data) {
        dispatch(addProposal({ params: { hash, poolId, data } }))
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [dispatch, hash, poolId])

  useEffect(() => {
    if (!hash) return
    if (investProposalMetadata === null) {
      fetchInvestProposalMetadata()
    }
  }, [hash, investProposalMetadata, dispatch, fetchInvestProposalMetadata])

  return [{ investProposalMetadata, loading }, { fetchInvestProposalMetadata }]
}

interface InsuranceAccidentMetadataResult {
  insuranceAccidentMetadata: InsuranceAccident | null
  loading: boolean
}
interface InsuranceAccidentMetadataMethods {
  fetchInsuranceAccidentMetadata: () => void
}
type InsuranceAccidentMetadataResponse = [
  InsuranceAccidentMetadataResult,
  InsuranceAccidentMetadataMethods
]

export function useInsuranceAccidentMetadata(
  hash
): InsuranceAccidentMetadataResponse {
  const dispatch = useDispatch()
  const insuranceAccidentMetadata = useSelector(selectInsuranceAccident(hash))
  const [loading, setLoading] = useState(false)

  const fetchInsuranceAccidentMetadata = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getIpfsData(hash)
      if (data) {
        dispatch(addInsuranceAccident({ params: { hash, data } }))
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [dispatch, hash])

  useEffect(() => {
    if (isNil(hash) || isNil(insuranceAccidentMetadata)) return
    ;(async () => await fetchInsuranceAccidentMetadata())()
  }, [
    hash,
    dispatch,
    insuranceAccidentMetadata,
    fetchInsuranceAccidentMetadata,
  ])

  return [
    { insuranceAccidentMetadata, loading },
    { fetchInsuranceAccidentMetadata },
  ]
}

interface InsuranceAccidentsResponse {
  loading: boolean
  total: number
  data: Record<string, InsuranceAccident>
  insuranceAccidentByPool: InsuranceAccident | null
}

interface InsuranceAccidentsMethods {
  fetch: () => void
  fetchAll: () => void
  getInsuranceAccidentByPool: (pool: string) => void
}

export const useInsuranceAccidents = (): [
  InsuranceAccidentsResponse,
  InsuranceAccidentsMethods
] => {
  const dispatch = useDispatch()
  const insurance = useInsuranceContract()

  const [loading, setLoading] = useState<boolean>(true)
  const [total, setTotal] = useState<number>(0)
  const [offset, setOffset] = useState<number>(0)
  const [limit, setLimit] = useState<number>(DEFAULT_PAGINATION_COUNT)

  const [searchPool, setSearchPool] = useState("")

  const data = useSelector(selectInsuranceAccidents())

  const insuranceAccidentByPool = useSelector(
    selectInsuranceAccidentByPool(searchPool)
  )

  const _saveAccidentToStore = async (hash) => {
    const accidentData = await getIpfsData(hash)

    dispatch(
      addInsuranceAccident({
        params: { hash, data: accidentData },
      })
    )
  }

  const fetchTotalCount = useCallback(async () => {
    if (isNil(insurance)) return

    const totalActiveAccidents = await insurance.ongoingClaimsCount()
    setTotal(Number(totalActiveAccidents.toString()))

    return totalActiveAccidents
  }, [insurance])

  const fetch = useCallback(async () => {
    if (isNil(insurance)) return

    setLoading(true)

    const activeAccidents = await insurance.listOngoingClaims(offset, limit)

    for (const accidentId of activeAccidents) {
      await _saveAccidentToStore(accidentId)
    }

    setOffset((prevOffset) => prevOffset + activeAccidents.length)
    setLoading(false)
  }, [insurance, _saveAccidentToStore])

  const fetchAll = useCallback(async () => {
    if (isNil(insurance)) return

    setLoading(true)

    const totalActiveAccidents = await fetchTotalCount()
    const totalNormalized = Number(totalActiveAccidents?.toString())

    setTotal(totalNormalized)

    const activeAccidents = await insurance.listOngoingClaims(
      offset,
      totalNormalized
    )

    for (const accidentId of activeAccidents) {
      await _saveAccidentToStore(accidentId)
    }

    setOffset(activeAccidents.length)
    setLoading(false)
  }, [insurance, _saveAccidentToStore])

  const getInsuranceAccidentByPool = useCallback(
    (pool) => {
      setSearchPool(pool)
      return insuranceAccidentByPool
    },
    [insuranceAccidentByPool]
  )

  useEffect(() => {
    if (isNil(insurance)) return
    ;(async () => {
      setLoading(true)
      await fetchTotalCount()
      setLoading(false)
    })()
  }, [insurance])

  return [
    {
      loading,
      total,
      data,
      insuranceAccidentByPool,
    },
    { fetch, fetchAll, getInsuranceAccidentByPool },
  ]
}
