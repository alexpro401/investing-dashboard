import { useCallback, useEffect, useState } from "react"
import {
  usePoolRegistryContract,
  useTraderPoolRiskyProposalContract,
} from "contracts"
import useProposalAddress from "hooks/useProposalAddress"
import { debounce } from "lodash"

import {
  IRiskyProposalInfo,
  IRiskyProposalInvestmentsInfo,
} from "interfaces/contracts/ITraderPoolRiskyProposal"

import { DEFAULT_PAGINATION_COUNT } from "consts/misc"
import { TraderPoolRiskyProposal } from "interfaces/typechain"
import { isAddress } from "utils"

export function useRiskyProposals(
  poolAddress?: string,
  fetchAll?: boolean
): [{ data: IRiskyProposalInfo; loading: boolean }, () => void] {
  const [proposals, setProposals] = useState<IRiskyProposalInfo>([])
  const [offset, setOffset] = useState<number>(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [allFetched, setAllFetched] = useState<boolean>(false)
  const [isAddressValid, setAddressValid] = useState(false)

  const poolRegistry = usePoolRegistryContract()
  const riskyProposal = useTraderPoolRiskyProposalContract(
    isAddressValid ? poolAddress : ""
  )

  const fetchProposals = useCallback(async () => {
    if (riskyProposal !== null && !allFetched) {
      setFetching(true)
      try {
        const data = await riskyProposal.getProposalInfos(
          offset,
          DEFAULT_PAGINATION_COUNT
        )
        if (data && !!data.length) {
          setProposals((prev) => [...prev, ...data])
          setOffset((prev) => prev + data.length)
        }
        if (data.length < DEFAULT_PAGINATION_COUNT || data.length === 0) {
          setAllFetched(true)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setFetching(false)
      }
    }
  }, [allFetched, offset, riskyProposal])

  useEffect(() => {
    if (!poolRegistry || !poolAddress || !isAddress(poolAddress)) return

    const fetch = async () => {
      const isBasic = await poolRegistry.isBasicPool(poolAddress)
      if (isBasic) {
        setAddressValid(true)
      }
    }

    fetch().catch(console.error)
  }, [poolAddress, poolRegistry])

  useEffect(() => {
    if (!fetchAll || allFetched || fetching || !proposals.length) return

    fetchProposals()
  }, [allFetched, fetchAll, fetchProposals, fetching, proposals])

  useEffect(() => {
    if (!riskyProposal || proposals.length > 0) {
      return
    }
    fetchProposals()
  }, [riskyProposal, proposals, fetchProposals])

  return [{ data: proposals, loading: fetching }, debounce(fetchProposals, 100)]
}

export function useRiskyProposal(
  poolAddress?: string,
  index?: string
): [
  IRiskyProposalInfo[0] | undefined,
  TraderPoolRiskyProposal | null,
  string,
  () => void
] {
  const [proposal, setProposal] = useState<IRiskyProposalInfo[0] | undefined>()
  const [update, setUpdate] = useState(false)
  const proposalAddress = useProposalAddress(poolAddress)
  const riskyProposal = useTraderPoolRiskyProposalContract(poolAddress)

  const refresh = useCallback(() => {
    setUpdate(!update)
  }, [update])

  useEffect(() => {
    if (!riskyProposal || !index) return
    ;(async () => {
      const data = await riskyProposal.getProposalInfos(
        parseFloat(index),
        parseFloat(index) + 1
      )
      setProposal(data[0])
    })()
  }, [index, riskyProposal, update])

  return [proposal, riskyProposal, proposalAddress, refresh]
}

export function useRiskyActiveInvestmentsInfo(
  poolAddress?: string,
  account?: string | null | undefined,
  index?: string
) {
  const [info, setInfo] = useState<
    IRiskyProposalInvestmentsInfo[0] | undefined
  >()
  const riskyProposal = useTraderPoolRiskyProposalContract(poolAddress)

  useEffect(() => {
    if (!riskyProposal || !index || !account) return
    ;(async () => {
      try {
        const data = await riskyProposal.getActiveInvestmentsInfo(
          account,
          index,
          1
        )
        setInfo(data[0])
      } catch {}
    })()
  }, [riskyProposal, index, account])

  return info
}

export default useRiskyProposals
