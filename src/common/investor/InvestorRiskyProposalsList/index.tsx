import * as React from "react"
import { isEmpty } from "lodash"
import { SpiralSpinner } from "react-spinners-kit"

import { useInvestorRiskyProposals } from "hooks"

import * as S from "./styled"
import { Center } from "theme"
import { NoDataMessage, CardRiskyProposal } from "common"
import LoadMore from "components/LoadMore"

const InvestorRiskyProposalsList: React.FC = () => {
  const [proposals, loading, fetchMore] = useInvestorRiskyProposals()

  return (
    <S.InvestorRiskyProposalsListWrp>
      {isEmpty(proposals) ? (
        loading ? (
          <Center>
            <SpiralSpinner size={30} loading />
          </Center>
        ) : (
          <NoDataMessage />
        )
      ) : (
        <>
          {proposals.map((proposal) => {
            return <CardRiskyProposal key={proposal.id} payload={proposal} />
          })}
          <LoadMore isLoading={loading} handleMore={fetchMore} />
        </>
      )}
    </S.InvestorRiskyProposalsListWrp>
  )
}

export default InvestorRiskyProposalsList
