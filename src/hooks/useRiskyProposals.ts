import { useCallback, useEffect, useState } from "react"
import debounce from "lodash.debounce"

import useContract from "hooks/useContract"
import { RiskyProposal } from "constants/interfaces_v2"
import { TraderPool, TraderPoolRiskyProposal } from "abi"
import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

export function useRiskyProposals(
  poolAddress?: string
): [{ data: RiskyProposal[]; loading: boolean }, () => void] {
  const [proposalAddress, setProposalAddress] = useState("")
  const [proposals, setProposals] = useState<RiskyProposal[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [allFetched, setAllFetched] = useState<boolean>(false)

  const traderPool = useContract(poolAddress, TraderPool)
  const traderPoolRiskyProposal = useContract(
    proposalAddress,
    TraderPoolRiskyProposal
  )

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
    if (!traderPool) return
    ;(async () => {
      const address = await traderPool.proposalPoolAddress()
      setProposalAddress(address)
    })()
  }, [traderPool])

  useEffect(() => {
    if (!traderPoolRiskyProposal || proposals.length > 0) return
    fetchProposals()
  }, [traderPoolRiskyProposal])

  return [{ data: proposals, loading: fetching }, debounce(fetchProposals, 100)]
}

export function useRiskyProposal(
  poolAddress?: string,
  index?: string
): RiskyProposal | undefined {
  const proposals = useRiskyProposals(poolAddress)

  if (!index || !proposals) {
    return undefined
  }

  return proposals[index]
}

export default useRiskyProposals
