import { useEffect, useState, useCallback } from "react"
import debounce from "lodash.debounce"

import { InvestProposal } from "constants/interfaces_v2"
import { useInvestProposalContract } from "hooks/useContract"
import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

interface IPayload {
  data: InvestProposal[]
  loading: boolean
}

function useInvestProposals(poolAddress?: string): [IPayload, () => void] {
  const [proposals, setProposals] = useState<InvestProposal[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [allFetched, setAllFetched] = useState<boolean>(false)

  const [traderPoolInvestProposal] = useInvestProposalContract(poolAddress)

  const fetchProposals = useCallback(async () => {
    if (traderPoolInvestProposal !== null && !allFetched) {
      setFetching(true)
      try {
        const data = await traderPoolInvestProposal.getProposalInfos(
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
  }, [allFetched, offset, traderPoolInvestProposal])

  useEffect(() => {
    if (!traderPoolInvestProposal || proposals.length > 0) return
    fetchProposals()
  }, [traderPoolInvestProposal])

  return [{ data: proposals, loading: fetching }, debounce(fetchProposals, 100)]
}

export function useInvestProposal(
  poolAddress?: string,
  index?: string
): InvestProposal | undefined {
  const [proposal, setProposal] = useState<InvestProposal | undefined>()
  const [traderPoolInvestProposal] = useInvestProposalContract(poolAddress)

  useEffect(() => {
    if (!traderPoolInvestProposal || !index) return
    ;(async () => {
      try {
        const data = await traderPoolInvestProposal.getProposalInfos(
          parseFloat(index),
          parseFloat(index) + 1
        )
        setProposal(data[0])
      } catch (e) {
        console.log(e)
      }
    })()
  }, [index, traderPoolInvestProposal])

  return proposal
}

export default useInvestProposals