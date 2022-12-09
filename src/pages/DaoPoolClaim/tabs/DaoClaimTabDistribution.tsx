import * as React from "react"
import * as S from "../styled"
import DaoProposalsList from "common/dao/DaoProposalsList"

interface Props {
  daoAddress?: string
}

const DaoClaimTabDistribution: React.FC<Props> = ({ daoAddress }) => {
  return (
    <>
      <S.List>
        <DaoProposalsList
          govPoolAddress={daoAddress}
          status={"completed-distribution"}
        />
      </S.List>
      <S.BottomActionContainer>
        <S.AppButtonFull text={"Claim All distributions"} />
      </S.BottomActionContainer>
    </>
  )
}

export default DaoClaimTabDistribution
