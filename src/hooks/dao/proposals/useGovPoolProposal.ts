import { IGovPool } from "interfaces/typechain/GovPool"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DateUtil } from "utils"
import { IpfsEntity } from "utils/ipfsEntity"

export const useGovPoolProposal = (
  proposalView: IGovPool.ProposalViewStructOutput
) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const proposalType = useMemo(() => {
    return proposalView.proposal.core.settings.executorDescription
  }, [proposalView])

  const voteEnd = useMemo(() => {
    return DateUtil.fromTimestamp(
      proposalView.proposal.core.voteEnd.toNumber(),
      "dd/mm/yy hh:mm:ss"
    ) as string
  }, [proposalView])

  const loadDetailsFromIpfs = useCallback(async () => {
    try {
      const entity = new IpfsEntity<{ name: string; description: string }>({
        path: proposalView.proposal.descriptionURL,
      })

      const response = await entity.load()

      setName(response.name)
      setDescription(response.description)
    } catch (error) {}
  }, [proposalView])

  const init = useCallback(async () => {
    try {
      await loadDetailsFromIpfs()
    } catch (error) {}
  }, [loadDetailsFromIpfs])

  useEffect(() => {
    init()
  }, [init, proposalView])

  const votesFor = useMemo(
    () => proposalView.proposal.core.votesFor.toNumber(),
    [proposalView]
  )

  return {
    name,
    description,

    proposalType,
    voteEnd,
    votesFor,
  }
}
