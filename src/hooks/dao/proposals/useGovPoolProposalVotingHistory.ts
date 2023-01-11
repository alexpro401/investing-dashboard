import { useMemo } from "react"
import { useQuery } from "urql"
import { graphClientDaoPools } from "utils/graphClient"
import { GovPoolProposalVotesQuery } from "queries"

export const useGovPoolProposalVotingHistory = (
  offset = 0,
  limit = 15,
  govPoolAddress?: string,
  proposalId?: string
) => {
  const ID = useMemo(() => {
    if (!govPoolAddress) return

    return govPoolAddress.concat(
      `${Number(proposalId) < 10 ? `0${proposalId}` : proposalId}000000`
    )
  }, [govPoolAddress, proposalId])

  const [{ data, fetching, error }] = useQuery({
    query: GovPoolProposalVotesQuery,
    variables: useMemo(
      () => ({
        proposalId: ID,
        offset,
        limit,
      }),
      [ID, offset, limit]
    ),
    pause: useMemo(() => !ID, [ID]),
    context: graphClientDaoPools,
  })

  const proposalVotes = useMemo(() => {
    return data?.proposalVotes?.length
      ? data?.proposalVotes?.map((el) => ({
          delegatedAmount: el?.delegatedAmount || "",
          personalAmount: el?.personalAmount || "",
          voterAddress: el?.voter?.voter?.voter?.id || "",
          timestamp: el?.timestamp || 0,
        }))
      : []
  }, [data])

  const totalVotesCount = useMemo(
    () => data?.proposalVotes?.[0]?.proposal?.votesCount,
    [data]
  )

  return {
    proposalVotes,
    isLoading: fetching,
    error,
    totalVotesCount,
  }
}
