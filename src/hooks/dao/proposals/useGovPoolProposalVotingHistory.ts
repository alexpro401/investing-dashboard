import { useMemo } from "react"
import { createClient, useQuery } from "urql"

const GovPoolGraphClient = createClient({
  url: process.env.REACT_APP_DAO_POOLS_API_URL || "",
})

export const useGovPoolProposalVotingHistory = (
  govPoolAddress: string,
  proposalId,
  offset = 0,
  limit = 15
) => {
  const ID = useMemo(() => {
    return `${govPoolAddress}${
      +proposalId < 10 ? `0${proposalId}` : proposalId
    }000000`
  }, [govPoolAddress, proposalId])

  console.log(ID)

  const [{ data, fetching, error }] = useQuery({
    query: `
      query {
        proposalVotes(where:{proposal:"${ID}"}, first:100, skip:0){
            id
            voter{
              voter{
                voter{
                  id
                }
              }
            },
            personalAmount,
            delegatedAmount
          }
      }
    `,
    context: GovPoolGraphClient,
  })

  console.log(data)

  return {
    historyList: data,
    isLoading: fetching,
    error,
  }
}
