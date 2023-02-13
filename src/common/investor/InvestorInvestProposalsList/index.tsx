import { FC } from "react"
import { PulseSpinner } from "react-spinners-kit"

import LoadMore from "components/LoadMore"

import { RequestDividendsProvider } from "modals/RequestDividend/useRequestDividendsContext"

import { isEmpty } from "lodash"
import { Center } from "theme"
import { CardInvestProposal, NoDataMessage } from "common"
import { useInvestorInvestProposalsList } from "hooks"
import * as S from "./styles"

interface IProps {
  invested: boolean
}

const InvestorInvestProposalsList: FC<IProps> = ({ invested }) => {
  const [data, loading, fetchMore] = useInvestorInvestProposalsList(invested)

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

export default InvestorInvestProposalsList
