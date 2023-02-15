import { useParams } from "react-router-dom"
import { PulseSpinner } from "react-spinners-kit"

import { CardInvestProposal, NoDataMessage } from "common/index"
import LoadMore from "components/LoadMore"
import { RequestDividendsProvider } from "modals/RequestDividend/useRequestDividendsContext"
import { usePoolInvestProposalsList } from "hooks"
import { isEmpty } from "lodash"
import { Center } from "theme"
import * as S from "./styled"

const PoolInvestProposalsList = () => {
  const { poolAddress } = useParams()

  const [data, loading, fetchMore] = usePoolInvestProposalsList(
    poolAddress ?? ""
  )

  return (
    <RequestDividendsProvider>
      {isEmpty(data) ? (
        loading ? (
          <Center>
            <PulseSpinner />
          </Center>
        ) : (
          <NoDataMessage />
        )
      ) : (
        <S.PoolInvestProposalsListWrp>
          {data.map((proposal) => (
            <CardInvestProposal key={proposal.id} payload={proposal} />
          ))}
          <LoadMore isLoading={loading} handleMore={fetchMore} />
        </S.PoolInvestProposalsListWrp>
      )}
    </RequestDividendsProvider>
  )
}

export default PoolInvestProposalsList
