import { useCallback, useEffect, useState } from "react"
import { useRiskyProposalContract } from "hooks/useContract"
import { Contract } from "@ethersproject/contracts"
import debounce from "lodash.debounce"

import { RiskyProposal } from "constants/interfaces_v2"
import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

export function useRiskyProposals(
  poolAddress?: string
): [{ data: RiskyProposal[]; loading: boolean }, () => void] {
  const [proposals, setProposals] = useState<RiskyProposal[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [allFetched, setAllFetched] = useState<boolean>(false)

  const [traderPoolRiskyProposal] = useRiskyProposalContract(poolAddress)

  const fetchProposals = useCallback(async () => {
    if (traderPoolRiskyProposal !== null && !allFetched) {
      setFetching(true)
      try {
        const data = await traderPoolRiskyProposal.getProposalInfos(
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
  }, [allFetched, offset, traderPoolRiskyProposal])

  useEffect(() => {
    if (!traderPoolRiskyProposal || proposals.length > 0) return
    fetchProposals()
  }, [traderPoolRiskyProposal])

  return [{ data: proposals, loading: fetching }, debounce(fetchProposals, 100)]
}

export function useRiskyProposal(
  poolAddress?: string,
  index?: string
): [RiskyProposal | undefined, Contract | null, string, () => void] {
  const [proposal, setProposal] = useState<RiskyProposal | undefined>()
  const [update, setUpdate] = useState(false)
  const [traderPoolRiskyProposal, proposalAddress] =
    useRiskyProposalContract(poolAddress)

  const refresh = useCallback(() => {
    setUpdate(!update)
  }, [update])

  useEffect(() => {
    if (!traderPoolRiskyProposal || !index) return
    ;(async () => {
      const data = await traderPoolRiskyProposal.getProposalInfos(
        index,
        parseFloat(index) + 1
      )
      setProposal(data[0])
    })()
  }, [index, traderPoolRiskyProposal, update])

  return [proposal, traderPoolRiskyProposal, proposalAddress, refresh]
}

export default useRiskyProposals
