import { FC, useContext } from "react"
import { CreateDaoPoolParameters } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { StepsNavigation } from "common"
import * as S from "../styled"

const InternalProposalStep: FC = () => {
  const { internalProposalForm } = useContext(FundDaoCreatingContext)

  return (
    <>
      <S.StepsRoot>
        {internalProposalForm ? (
          <>
            <CreateDaoPoolParameters poolParameters={internalProposalForm} />
          </>
        ) : (
          <></>
        )}
      </S.StepsRoot>
      <StepsNavigation />
    </>
  )
}

export default InternalProposalStep
