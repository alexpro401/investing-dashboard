import { useCallback, useEffect, useState } from "react"
import { RiskyProposal } from "constants/interfaces_v2"
import { useRiskyProposalContract } from "hooks/useContract"
import { Contract } from "ethers"

function useRiskyProposals(poolAddress?: string): RiskyProposal[] {
  const [proposals, setProposals] = useState<RiskyProposal[]>([])

  const [traderPoolRiskyProposal] = useRiskyProposalContract(poolAddress)

  useEffect(() => {
    if (!traderPoolRiskyProposal) return
    ;(async () => {
      const data = await traderPoolRiskyProposal.getProposalInfos(0, 100)
      setProposals(data)
    })()
  }, [traderPoolRiskyProposal])

  return proposals
}

export function useRiskyProposal(
  poolAddress?: string,
  index?: string
): [RiskyProposal | undefined, Contract | null, () => void] {
  const [proposal, setProposal] = useState<RiskyProposal | undefined>()
  const [update, setUpdate] = useState(false)
  const [traderPoolRiskyProposal] = useRiskyProposalContract(poolAddress)

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

  return [proposal, traderPoolRiskyProposal, refresh]
}

export default useRiskyProposals
