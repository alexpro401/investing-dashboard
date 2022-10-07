import { useCallback, useEffect, useState } from "react"
import { useTraderPoolRiskyProposalContract } from "contracts"
import { useProposalAddress } from "hooks/useContract"
import { debounce } from "lodash"

import { ProposalsResponse } from "interfaces/abi-typings/TraderPoolRiskyProposal"
import { IRiskyProposalInvestmentsInfo } from "interfaces/contracts/ITraderPoolRiskyProposal"
import { TraderPoolRiskyProposalType } from "interfaces/abi-typings"

import { DEFAULT_PAGINATION_COUNT } from "constants/misc"

export function useRiskyProposals(
  poolAddress?: string
): [{ data: ProposalsResponse[]; loading: boolean }, () => void] {
  const [proposals, setProposals] = useState<ProposalsResponse[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [fetching, setFetching] = useState<boolean>(true)
  const [allFetched, setAllFetched] = useState<boolean>(false)

  const proposalAddress = useProposalAddress(poolAddress)
  const riskyProposal = useTraderPoolRiskyProposalContract(proposalAddress)

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
): [
  ProposalsResponse | undefined,
  TraderPoolRiskyProposalType | null,
  string,
  () => void
] {
  const [proposal, setProposal] = useState<ProposalsResponse | undefined>()
  const [update, setUpdate] = useState(false)
  const proposalAddress = useProposalAddress(poolAddress)
  const riskyProposal = useTraderPoolRiskyProposalContract(proposalAddress)

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
  const proposalAddress = useProposalAddress(poolAddress)
  const riskyProposal = useTraderPoolRiskyProposalContract(proposalAddress)

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
