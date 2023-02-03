import { useEffect, useState, useCallback, useMemo } from "react"
import { useSelector, useDispatch } from "react-redux"
import { debounce, isEmpty, isNil } from "lodash"

import { getIpfsData } from "utils/ipfs"

import {
  selectDaoPoolMetadata,
  selectInsuranceAccident,
  selectInsuranceAccidentByPool,
  selectInsuranceAccidents,
  selectinvestProposalMetadata,
  selectPoolMetadata,
  selectUserMetadata,
} from "./selectors"
import {
  addDaoPool,
  addInsuranceAccident,
  addPool,
  addProposal,
  addUser,
} from "./actions"
import { IInvestProposalMetadata, IPoolMetadata, IUserMetadata } from "./types"
import { InsuranceAccident } from "interfaces/insurance"
import {
  useGovPoolContract,
  useInsuranceContract,
  useUserRegistryContract,
} from "contracts"
import { DEFAULT_PAGINATION_COUNT } from "consts/misc"
import { shortenAddress } from "utils"
import { IpfsEntity } from "utils/ipfsEntity"
import { IGovPoolDescription } from "types"

export function usePoolMetadata(poolId, hash) {
  const dispatch = useDispatch()
  const poolMetadata = useSelector(selectPoolMetadata(poolId, hash))
  const [cachedPoolMetadata, setCachedPoolMetadata] = useState<IPoolMetadata>()
  const [loading, setLoading] = useState(false)

  const fetchPoolMetadata = useCallback(async () => {
    console.log(poolId, hash)
    try {
      setLoading(true)
      const ipfsData = new IpfsEntity<IPoolMetadata>({
        path: hash,
      })

      const data = await ipfsData.load()

      if (data) {
        dispatch(addPool({ params: { poolId, hash, ...data } }))
        setCachedPoolMetadata(data)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [dispatch, hash, poolId])

  useEffect(() => {
    if (
      !poolId ||
      !hash ||
      (!!poolMetadata?.timestamp &&
        cachedPoolMetadata?.timestamp &&
        poolMetadata?.timestamp === cachedPoolMetadata?.timestamp)
    )
      return

    fetchPoolMetadata()
  }, [
    poolId,
    hash,
    poolMetadata,
    dispatch,
    fetchPoolMetadata,
    cachedPoolMetadata,
  ])

  return [{ poolMetadata, loading }, { fetchPoolMetadata }]
}

export function useUserMetadata(account): [
  {
    userMetadata: IUserMetadata | null
    loading: boolean
    userName: string | null
    userAvatar: string | undefined
  },
  { fetchUserMetadata: (enableLoader: boolean) => void }
] {
  const dispatch = useDispatch()
  const userRegistry = useUserRegistryContract()

  const userMetadata = useSelector(selectUserMetadata(account))

  const [loading, setLoading] = useState(false)

  const userName = useMemo(
    () => userMetadata?.name ?? shortenAddress(account) ?? null,
    [account, userMetadata]
  )

  const userAvatar = useMemo(() => {
    if (
      !isNil(userMetadata) &&
      !isNil(userMetadata.assets) &&
      userMetadata.assets.length > 0
    ) {
      const { assets } = userMetadata
      return assets[assets.length - 1]
    }

    return undefined
  }, [userMetadata])

  const fetchUserMetadata = useCallback(
    async (enableLoader = true) => {
      if (!account || !userRegistry) return
      try {
        if (enableLoader) {
          setLoading(true)
        }
        const userData = await userRegistry.userInfos(account)
        if (!isNil(userData) && !isEmpty(userData.profileURL)) {
          const { profileURL } = userData
          const ipfsData = await getIpfsData(profileURL)

          if (!isNil(ipfsData)) {
            dispatch(
              addUser({
                params: { hash: profileURL, ...ipfsData },
              })
            )
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (enableLoader) {
          setLoading(false)
        }
      }
    },
    [account, userRegistry]
  )

  useEffect(() => {
    if (!account || !userRegistry) return
    ;(async () => {
      if (userMetadata === null) {
        await fetchUserMetadata(true)
      }
    })()
  }, [account, userMetadata, userRegistry])

  return [
    { userMetadata, loading, userName, userAvatar },
    { fetchUserMetadata: debounce(fetchUserMetadata, 100) },
  ]
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
  const [limit] = useState<number>(DEFAULT_PAGINATION_COUNT)

  const [searchPool, setSearchPool] = useState("")

  const data = useSelector(selectInsuranceAccidents())

  const allLoaded = useMemo(() => {
    if (isEmpty(data) && !loading) {
      return false
    }

    return Object.keys(data).length === total
  }, [data, total, loading])

  const insuranceAccidentByPool = useSelector(
    selectInsuranceAccidentByPool(searchPool)
  )

  const _saveAccidentToStore = useCallback(async (hash) => {
    const accidentData = await getIpfsData(hash)

    dispatch(
      addInsuranceAccident({
        params: { hash, data: accidentData },
      })
    )
  }, [])

  const fetchTotalCount = useCallback(async () => {
    if (isNil(insurance)) return

    const totalActiveAccidents = await insurance.acceptedClaimsCount()
    setTotal(Number(totalActiveAccidents.toString()))

    return totalActiveAccidents
  }, [insurance])

  const fetch = useCallback(async () => {
    if (isNil(insurance) || allLoaded || loading) return

    setLoading(true)

    const activeAccidents = await insurance.listAcceptedClaims(offset, limit)

    for (const accidentId of activeAccidents) {
      await _saveAccidentToStore(accidentId)
    }

    setOffset((prevOffset) => prevOffset + activeAccidents.length)
    setLoading(false)
  }, [insurance, _saveAccidentToStore, loading])

  const fetchAll = useCallback(async () => {
    if (isNil(insurance) || allLoaded || loading) return

    setLoading(true)

    const totalActiveAccidents = await fetchTotalCount()
    const totalNormalized = Number(totalActiveAccidents?.toString())

    setTotal(totalNormalized)

    const activeAccidents = await insurance.listAcceptedClaims(
      offset,
      totalNormalized
    )

    for (const accidentId of activeAccidents) {
      await _saveAccidentToStore(accidentId)
    }

    setOffset(activeAccidents.length)
    setLoading(false)
  }, [insurance, _saveAccidentToStore, allLoaded, loading])

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

export function useDaoPoolMetadata(poolId) {
  const dispatch = useDispatch()
  const daoPoolMetadata = useSelector(selectDaoPoolMetadata(poolId))
  const [loading, setLoading] = useState(false)

  const govPoolContract = useGovPoolContract(poolId)

  const fetchDaoPoolMetadata = useCallback(async () => {
    try {
      setLoading(true)
      const hash = await govPoolContract?.descriptionURL()
      const DaoPoolIpfsEntity = new IpfsEntity<IGovPoolDescription>({
        path: hash,
      })
      const data = await DaoPoolIpfsEntity.load()

      if (data && hash) {
        dispatch(addDaoPool({ params: { poolId, hash, ...data } }))
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [dispatch, poolId, govPoolContract])

  useEffect(() => {
    if (!poolId) return
    if (daoPoolMetadata === null) {
      fetchDaoPoolMetadata()
    }
  }, [poolId, daoPoolMetadata, dispatch, fetchDaoPoolMetadata])

  return [{ daoPoolMetadata, loading }, { fetchDaoPoolMetadata }]
}
