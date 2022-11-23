import { IGovPool } from "interfaces/typechain/GovPool"
import { useCallback, useEffect, useMemo, useState } from "react"
import { bigify, DateUtil } from "utils"
import { IpfsEntity } from "utils/ipfsEntity"
import { createClient, useQuery } from "urql"
import { useActiveWeb3React } from "../../index"

const GovPoolGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
})

export const useGovPoolProposal = (
  proposalId: number,
  govPoolAddress: string,
  proposalView: IGovPool.ProposalViewStructOutput
) => {
  const { account } = useActiveWeb3React()

  const [{ data }] = useQuery({
    query: `
      query {
        proposals(where: { pool: "${govPoolAddress}", proposalId: "${proposalId}" }) {
          id
        }
      }
    `,
    context: GovPoolGraphClient,
  })

  const graphGovPoolProposal = useMemo(() => data?.proposals?.[0], [data])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const creator = useMemo(
    () => graphGovPoolProposal?.creator,
    [graphGovPoolProposal]
  )
  const votedAddresses = useMemo(
    () => graphGovPoolProposal?.voters?.length || 0,
    [graphGovPoolProposal]
  )

  const proposalType = useMemo(() => {
    return proposalView?.proposal.core.settings.executorDescription
  }, [proposalView])

  const voteEnd = useMemo(() => {
    return proposalView?.proposal
      ? (DateUtil.fromTimestamp(
          proposalView?.proposal.core.voteEnd.toNumber(),
          "dd/mm/yy hh:mm:ss"
        ) as string)
      : ""
  }, [proposalView])

  const executors = useMemo(
    () => proposalView?.proposal.executors || [],
    [proposalView]
  )

  const proposalSettings = useMemo(
    () => proposalView?.proposal?.core?.settings || {},
    [proposalView]
  )

  const loadDetailsFromIpfs = useCallback(async () => {
    try {
      const entity = new IpfsEntity<{
        proposalName: string
        proposalDescription: string
      }>({
        path: proposalView?.proposal.descriptionURL,
      })

      const response = await entity.load()

      setName(response.proposalName)
      setDescription(response.proposalDescription)
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

  const votesTotalNeed = useMemo(() => bigify("222", 18), [])

  const votesFor = useMemo(
    () => proposalView?.proposal?.core?.votesFor || 0,
    [proposalView]
  )

  const myVotesAmount = useMemo(() => {
    // const myVotes = graphGovPoolProposal?.votes.filter((el) =>
    //   el.voter.id.includes(account)
    // )
    //
    // console.log(myVotes)
    //
    // return myVotes?.reduce((acc, curr) => {
    //   return (acc += +curr)
    // }, 0)

    return 0
  }, [])

  return {
    creator,
    votedAddresses,
    name,
    description,
    executors,
    proposalSettings,

    proposalType,
    voteEnd,
    votesTotalNeed,
    votesFor,
    myVotesAmount,
  }
}
