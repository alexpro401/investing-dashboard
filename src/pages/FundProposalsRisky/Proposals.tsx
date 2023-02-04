import { FC } from "react"
import { PulseSpinner } from "react-spinners-kit"

import useRiskyProposals from "hooks/useRiskyProposals"

import { Flex } from "theme"
import { NoDataMessage, CardRiskyProposal } from "common"
import LoadMore from "components/LoadMore"

interface IProps {
  poolAddress?: string
}

const FundProposalsRisky: FC<IProps> = ({ poolAddress }) => {
  const [{ data, loading }, fetchMore] = useRiskyProposals(poolAddress)

  if (!poolAddress || (data.length === 0 && loading)) {
    return (
      <Flex full ai="center" jc="center">
        <PulseSpinner />
      </Flex>
    )
  }

  if (data && data.length === 0 && !loading) {
    return <NoDataMessage />
  }

  return (
    <>
      {data.map((proposal, index) => (
        <CardRiskyProposal
          key={index}
          proposalId={index}
          proposal={proposal}
          poolAddress={poolAddress}
        />
      ))}
      <LoadMore isLoading={loading} handleMore={fetchMore} />
    </>
  )
}

export default FundProposalsRisky
