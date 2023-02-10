import * as React from "react"
import * as S from "./styled"
import { SpiralSpinner } from "react-spinners-kit"

import { useRiskyProposalsList } from "hooks"

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

  const [proposals, loading, fetchMore] = useRiskyProposalsList(
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
          {proposals.map((proposal) => (
            <CardRiskyProposal key={proposal.id} payload={proposal} />
          ))}
          <LoadMore isLoading={loading} handleMore={fetchMore} />
        </>
      )}
    </S.FundRiskyProposalsListWrp>
  )
}

export default FundProposalsRisky
