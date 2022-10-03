import { FC, useContext } from "react"
import { CreateDaoPoolParameters } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { StepsNavigation } from "common"
import * as S from "../styled"

const DistributionProposalStep: FC = () => {
  const { distributionProposalSettingsForm } = useContext(
    FundDaoCreatingContext
  )

  return (
    <>
      <S.StepsRoot>
        {distributionProposalSettingsForm ? (
          <>
            <CreateDaoPoolParameters
              poolParameters={distributionProposalSettingsForm}
            />
          </>
        ) : (
          <></>
        )}
      </S.StepsRoot>
      <StepsNavigation />
    </>
  )
}

export default DistributionProposalStep
