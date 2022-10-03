import { FC, useContext } from "react"
import { CreateDaoCardStepNumber, CreateDaoPoolParameters } from "../components"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  StepsNavigation,
} from "common"

import * as S from "../styled"

import CreateFundDocsImage from "assets/others/create-fund-docs.png"

const DistributionProposalStep: FC = () => {
  const { distributionProposalSettingsForm } = useContext(
    FundDaoCreatingContext
  )

  return (
    <>
      <S.StepsRoot>
        {distributionProposalSettingsForm ? (
          <>
            <Card>
              <CardHead
                nodeLeft={<CreateDaoCardStepNumber number={7} />}
                title="Changing General voting settings*"
              />
              <CardDescription>
                <p>
                  Configure the settings for proposals to change the General
                  voting settings (the ones you set up in the previous step).
                </p>
                <br />
                <p>
                  By default, these proposals use the general voting settings.
                </p>
                <br />
                <AppButton
                  text="Why you may need this?"
                  color="default"
                  size="no-paddings"
                />
              </CardDescription>
            </Card>
            <S.CenteredImage src={CreateFundDocsImage} />
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
