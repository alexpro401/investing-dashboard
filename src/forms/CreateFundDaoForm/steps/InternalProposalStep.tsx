import { FC, useContext } from "react"
import { CreateDaoCardStepNumber } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import {
  Card,
  CardDescription,
  CardHead,
  DaoSettingsParameters,
  StepsNavigation,
} from "common"
import * as S from "../styled"

const InternalProposalStep: FC = () => {
  const { internalProposalForm } = useContext(FundDaoCreatingContext)

  return (
    <>
      <S.StepsRoot>
        {internalProposalForm ? (
          <>
            <Card>
              <CardHead
                nodeLeft={<CreateDaoCardStepNumber number={5} />}
                title="Internal voting settings"
              />
              <CardDescription>
                <p>
                  Configure the settings for proposals, voting, vote delegation,
                  and rewards for active members.
                </p>
              </CardDescription>
            </Card>
            <DaoSettingsParameters poolParameters={internalProposalForm} />
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
