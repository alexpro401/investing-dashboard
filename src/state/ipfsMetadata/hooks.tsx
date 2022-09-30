import { useEffect, useState, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"

import { getIpfsData } from "utils/ipfs"

import {
  selectInsuranceAccident,
  selectinvestProposalMetadata,
  selectPoolMetadata,
  selectUserMetadata,
} from "./selectors"
import { addInsuranceAccident, addPool, addProposal, addUser } from "./actions"
import { IInvestProposalMetadata, IUserMetadata } from "./types"
import { InsuranceAccident } from "interfaces/insurance"
import { isNil } from "lodash"

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
