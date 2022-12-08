import * as React from "react"
import * as S from "../styled"
import DaoProposalsList from "common/dao/DaoProposalsList"

interface Props {
  daoAddress?: string
}

const DaoClaimTabRewards: React.FC<Props> = ({ daoAddress }) => {
  return (
    <>
      <S.List>
        <DaoProposalsList
          govPoolAddress={daoAddress}
          status={"completed-rewards"}
        />
      </S.List>
      <S.BottomActionContainer>
        <S.AppButtonFull text={"Claim All rewards"} />
      </S.BottomActionContainer>
    </>
  )
}

export default DaoClaimTabRewards
