import { useEffect, useState, useCallback } from "react"
import debounce from "lodash.debounce"

import { InvestProposal } from "interfaces/thegraphs/invest-pools"
import {
  IInvestProposalInvestmentsInfo,
  IInvestProposalRewards,
} from "interfaces/contracts/ITraderPoolInvestProposal"
import { useInvestProposalContract } from "hooks/useContract"
import { DEFAULT_PAGINATION_COUNT } from "constants/misc"
import useForceUpdate from "./useForceUpdate"

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
    if (!traderPoolInvestProposal || proposals.length > 0) {
      return
    }
    fetchProposals()
  }, [traderPoolInvestProposal, fetchProposals, proposals])

  return [{ data: proposals, loading: fetching }, debounce(fetchProposals, 100)]
}

export function useInvestProposal(
  poolAddress?: string,
  index?: string
): [InvestProposal | undefined, () => void] {
  const [updateObserver, update] = useForceUpdate()
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
  }, [index, traderPoolInvestProposal, updateObserver])

  return [proposal, update]
}

export function useActiveInvestmentsInfo(
  poolAddress?: string,
  account?: string | null | undefined,
  index?: string
) {
  const [info, setInfo] = useState<IInvestProposalInvestmentsInfo | undefined>()
  const [proposal] = useInvestProposalContract(poolAddress)

  useEffect(() => {
    if (!proposal || !index || !account) return
    ;(async () => {
      try {
        const data = await proposal.getActiveInvestmentsInfo(account, index, 1)
        if (data.length) {
          setInfo(data[0])
        }
      } catch {}
    })()
  }, [proposal, index, account])

  return info
}

export function useRewards({ poolAddress, account, proposalId }) {
  const [investProposal] = useInvestProposalContract(poolAddress)
  const [rewards, setRewards] = useState<IInvestProposalRewards | undefined>()

  const fetchAndUpdateData = useCallback(async () => {
    if (!investProposal || !account || !proposalId) return

    const data = await investProposal.getRewards(
      [parseFloat(proposalId) + 1],
      account
    )

    setRewards(data)
  }, [account, investProposal, proposalId])

  useEffect(() => {
    fetchAndUpdateData().catch(console.log)
  }, [fetchAndUpdateData])

  return rewards
}

export default useInvestProposals
