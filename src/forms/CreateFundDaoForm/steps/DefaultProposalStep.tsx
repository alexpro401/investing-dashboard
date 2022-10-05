import { FC, useContext } from "react"
import { CreateDaoCardStepNumber, CreateDaoPoolParameters } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { Card, CardDescription, CardHead, StepsNavigation } from "common"
import * as S from "../styled"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"

const DefaultProposalStep: FC = () => {
  const { defaultProposalSettingForm } = useContext(FundDaoCreatingContext)

  return (
    <>
      <S.StepsRoot>
        {defaultProposalSettingForm ? (
          <>
            <Card>
              <CardHead
                nodeLeft={<CreateDaoCardStepNumber number={3} />}
                title="General voting settings"
              />
              <CardDescription>
                <p>
                  Configure the settings for proposals, voting, vote delegation,
                  and rewards for active members.
                </p>
              </CardDescription>
            </Card>
            <S.CenteredImage src={CreateFundDocsImage} />
            <CreateDaoPoolParameters
              poolParameters={defaultProposalSettingForm}
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

export default DefaultProposalStep
