import { IGovPool } from "interfaces/typechain/GovPool"
import { useCallback, useEffect, useMemo, useState } from "react"
import { DateUtil } from "utils"
import { IpfsEntity } from "utils/ipfsEntity"
import { createClient, useQuery } from "urql"
import { useActiveWeb3React } from "hooks"
import {
  useGovPoolExecutor,
  useGovPool,
  useDistributionProposalToken,
} from "hooks/dao"
import { BigNumber } from "@ethersproject/bignumber"

const GovPoolGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
})

export const useGovPoolProposal = (
  proposalId: number,
  govPoolAddress: string,
  proposalView: IGovPool.ProposalViewStructOutput
) => {
  const { govPoolContract } = useGovPool(govPoolAddress)
  const { account } = useActiveWeb3React()

  const [{ data }] = useQuery({
    query: `
      query {
        proposals(where: { pool: "${govPoolAddress}", proposalId: "${proposalId}" }) {
          id
          executor
          creator
          voters
          distributionProposal {
            token
          }
        }
      }
    `,
    context: GovPoolGraphClient,
  })

  const graphGovPoolProposal = useMemo(() => data?.proposals?.[0], [data])

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const [myVotesAmount, setMyVotesAmount] = useState<BigNumber>()

  const requiredQuorum = useMemo(
    () => proposalView?.requiredQuorum,
    [proposalView]
  )

  const creator = useMemo(
    () => graphGovPoolProposal?.creator,
    [graphGovPoolProposal]
  )
  const votedAddresses = useMemo(
    () => graphGovPoolProposal?.voters?.length || 0,
    [graphGovPoolProposal]
  )

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

  const [executor] = useGovPoolExecutor(
    (govPoolAddress || "").toLowerCase(),
    (executors[executors.length - 1] || "").toLowerCase()
  )

  const proposalType = useMemo(() => {
    return executor?.type
  }, [executor])

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

  const loadProposalTotalVotes = useCallback(async () => {
    try {
      const amounts = await govPoolContract?.getTotalVotes(
        proposalId,
        account!,
        false
      )
      const accountVotesAmount = amounts?.[1]
      setMyVotesAmount(accountVotesAmount)
    } catch (error) {
      console.error({ error })
    }
  }, [account, govPoolContract, proposalId])

  const init = useCallback(async () => {
    try {
      await loadDetailsFromIpfs()
      await loadProposalTotalVotes()
    } catch (error) {}
  }, [loadDetailsFromIpfs, loadProposalTotalVotes])

  useEffect(() => {
    init()
  }, [init, proposalView])

  const votesTotalNeed = useMemo(() => requiredQuorum, [requiredQuorum])

  const votesFor = useMemo(
    () => proposalView?.proposal?.core?.votesFor || 0,
    [proposalView]
  )

  const executed = useMemo(
    () => proposalView?.proposal?.core?.executed,
    [proposalView]
  )

  const isInsurance = useMemo(() => {
    return false
  }, [proposalView])

  const isDistribution = useMemo(() => {
    return executor?.type === "distribution"
  }, [executor])

  const distributionProposalTokenAddress = useMemo(
    () => graphGovPoolProposal?.distributionProposal?.[0]?.token,
    [graphGovPoolProposal]
  )

  const distributionProposalToken = useDistributionProposalToken(
    distributionProposalTokenAddress
  )

  return {
    proposalView,

    govPoolAddress,
    proposalId,
    creator,
    votedAddresses,
    name,
    description,
    executors,
    proposalSettings,
    requiredQuorum,
    distributionProposalTokenAddress,
    distributionProposalToken,

    proposalType,
    voteEnd,
    votesTotalNeed,
    votesFor,
    myVotesAmount,

    executed,
    isInsurance,
    isDistribution,
  }
}
