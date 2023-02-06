import * as React from "react"
import * as S from "./styled"
import { SpiralSpinner } from "react-spinners-kit"

import { useRiskyProposalsByPools } from "hooks"

import { Center } from "theme"
import { NoDataMessage, CardRiskyProposal } from "common"
import LoadMore from "components/LoadMore"
import { isEmpty, isNil } from "lodash"

interface IProps {
  poolAddress?: string
}

const FundProposalsRisky: React.FC<IProps> = ({ poolAddress }) => {
  const pools = React.useMemo(
    () => (isNil(poolAddress) ? [] : [poolAddress]),
    [poolAddress]
  )

  const [proposals, loading, fetchMore] = useRiskyProposalsByPools(
    pools,
    isEmpty(pools)
  )

  return (
    <S.FundRiskyProposalsListWrp>
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
              proposal={proposal.proposal}
              proposalId={proposal.utilityIds.proposalId}
              poolAddress={proposal.utilityIds.basicPoolAddress}
            />
          ))}
          <LoadMore isLoading={loading} handleMore={fetchMore} />
        </>
      )}
    </S.FundRiskyProposalsListWrp>
  )
}

export default FundProposalsRisky
