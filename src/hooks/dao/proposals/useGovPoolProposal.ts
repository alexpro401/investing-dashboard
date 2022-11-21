import { IGovPool } from "interfaces/typechain/GovPool"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DateUtil } from "utils"
import { IpfsEntity } from "utils/ipfsEntity"
import { createClient, useQuery } from "urql"

const investorGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
})

export const useGovPoolProposal = (
  proposalId: number,
  govPoolAddress: string,
  proposalView: IGovPool.ProposalViewStructOutput
) => {
  const [{ data }] = useQuery({
    query: `
      query {
        daoPools(where: { id: "${govPoolAddress}" }) {
          proposals(where: { proposalId: "${proposalId}" }) {
            id
            proposalId
            creator
            votersVoted
          } 
        }
      }
    `,
    context: investorGraphClient,
  })

  const graphGovPoolProposal = useMemo(
    () => data?.daoPools?.[0]?.proposals?.[0],
    [data]
  )

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const creator = useMemo(() => graphGovPoolProposal?.creator, [data])
  const votedAddresses = useMemo(
    () => graphGovPoolProposal?.votersVoted,
    [data]
  )

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

  const loadDetailsFromSubgraph = useCallback(async () => {
    // await fetching()
  }, [])

  const init = useCallback(async () => {
    try {
      await loadDetailsFromIpfs()
      await loadDetailsFromSubgraph()
    } catch (error) {}
  }, [loadDetailsFromIpfs, loadDetailsFromSubgraph])

  useEffect(() => {
    init()
  }, [init, proposalView])

  const votesTotalNeed = useMemo(() => 222, [])

  const votesFor = useMemo(
    () => proposalView.proposal.core.votesFor,
    [proposalView]
  )

  const isInsurance = useMemo(() => {
    return false
  }, [proposalView])

  const isDistribution = useMemo(() => {
    return true
  }, [proposalView])

  return {
    creator,
    votedAddresses,
    name,
    description,

    proposalType,
    voteEnd,
    votesTotalNeed,
    votesFor,

    isInsurance,
    isDistribution,
  }
}
