import { useQuery } from "urql"
import { IRiskyPosition } from "interfaces/thegraphs/basic-pools"
import { RiskyProposalPositionQuery } from "queries"
import { useEffect, useState } from "react"
import { graphClientBasicPools } from "utils/graphClient"

interface ProposalPosition {
  positions: IRiskyPosition[]
}

interface Params {
  closed: boolean
  proposalAddress?: string
  proposalId?: string
}

export function useRiskyPosition({
  closed,
  proposalAddress,
  proposalId,
}: Params) {
  const [position, setPosition] = useState<IRiskyPosition>()

  const [response] = useQuery<{
    proposal: ProposalPosition
  }>({
    query: RiskyProposalPositionQuery,
    variables: {
      proposalAddress: `${proposalAddress?.toLocaleLowerCase()}${
        parseFloat(proposalId || "0") + 1
      }`,
      closed,
    },
    context: graphClientBasicPools,
  })

  useEffect(() => {
    if (
      !response ||
      !response.data ||
      !response.data.proposal ||
      !response.data.proposal.positions
    ) {
      return
    }

    setPosition(response.data.proposal.positions[0])
  }, [response])

  return position
}

export default useRiskyPosition
