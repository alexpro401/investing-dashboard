import { useMemo } from "react"
import { useQuery } from "urql"
import { graphClientDaoPools } from "utils/graphClient"

export const useGovPoolProposalVotingHistory = (
  offset = 0,
  limit = 15,
  govPoolAddress?: string,
  proposalId?: string
) => {
  const ID = useMemo(() => {
    return `${govPoolAddress}${
      Number(proposalId) < 10 ? `0${proposalId}` : proposalId
    }000000`
  }, [govPoolAddress, proposalId])

  const [{ data, fetching, error }] = useQuery({
    query: `
      query {
        proposalVotes(where:{proposal: "${ID}"}, first:${limit}, skip:${offset}) {
            voter {
              voter {
                voter {
                  id
                }
              }
            }
            personalAmount
            timestamp
            proposal {
              votesCount
            }
        }
      }
    `,
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
