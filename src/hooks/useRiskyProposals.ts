import { useCallback, useEffect, useState } from "react"
import { useRiskyProposalContract } from "hooks/useContract"
import { Contract } from "@ethersproject/contracts"
import debounce from "lodash.debounce"

import { IRiskyProposal } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { IRiskyProposalInvestmentsInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"

import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

export function useRiskyProposals(
  poolAddress?: string
): [{ data: IRiskyProposal[]; loading: boolean }, () => void] {
  const [proposals, setProposals] = useState<IRiskyProposal[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [allFetched, setAllFetched] = useState<boolean>(false)

  const [riskyProposal] = useRiskyProposalContract(poolAddress)

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
): [IRiskyProposal | undefined, Contract | null, string, () => void] {
  const [proposal, setProposal] = useState<IRiskyProposal | undefined>()
  const [update, setUpdate] = useState(false)
  const [riskyProposal, proposalAddress] = useRiskyProposalContract(poolAddress)

  const refresh = useCallback(() => {
    setUpdate(!update)
  }, [update])

  useEffect(() => {
    if (!riskyProposal || !index) return
    ;(async () => {
      const data = await riskyProposal.getProposalInfos(
        index,
        parseFloat(index) + 1
      )
      setProposal(data[0])
    })()
  }, [index, riskyProposal, update])

  return [proposal, riskyProposal, proposalAddress, refresh]
}

export function useActiveInvestmentsInfo(
  poolAddress?: string,
  account?: string | null | undefined,
  index?: string
) {
  const [info, setInfo] = useState<IRiskyProposalInvestmentsInfo | undefined>()
  const [riskyProposal] = useRiskyProposalContract(poolAddress)

  useEffect(() => {
    if (!riskyProposal || !index || !account) return
    ;(async () => {
      try {
        const data = await riskyProposal.getActiveInvestmentsInfo(
          account,
          index,
          1
        )
        if (data.length) {
          setInfo(data[0])
        }
      } catch {}
    })()
  }, [riskyProposal, index, account])

  return info
}

export default useRiskyProposals
