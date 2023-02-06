import * as React from "react"
import { isEmpty } from "lodash"
import { SpiralSpinner } from "react-spinners-kit"

import { useInvestorRiskyProposals } from "hooks"

import * as S from "./styled"
import { Center } from "theme"
import { CardRiskyProposal, NoDataMessage } from "common"
import LoadMore from "components/LoadMore"

const InvestmentRiskyProposalsList: React.FC = () => {
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
          {Object.values(proposals).map((proposal) => (
            <CardRiskyProposal
              key={proposal.utilityIds.proposalEntityId}
              data={proposal}
            />
          ))}
          <LoadMore isLoading={loading} handleMore={fetchMore} />
        </>
      )}
    </S.InvestorRiskyProposalsListWrp>
  )
}

export default InvestmentRiskyProposalsList
