import React, { useContext, useCallback, useState } from "react"

import { StepsNavigation, CardHead, Card, CardDescription } from "common"
import GovVotingSettings from "modals/GovVotingSettings"
import { stepsControllerContext } from "context/StepsControllerContext"
import { ChangeVotingSettingsContext } from "context/govPool/proposals/validators/ChangeVotingSettingsContext"
import { CreateDaoCardStepNumber } from "forms/CreateFundDaoForm/components"

import * as S from "../styled"

const VotingSettings: React.FC = () => {
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const { initialForm } = useContext(ChangeVotingSettingsContext)

  const [previousSettingsOpened, setPreviousSettingsOpened] = useState(false)

  const handleOpenPreviousSettings = useCallback(() => {
    setPreviousSettingsOpened(true)
  }, [setPreviousSettingsOpened])

  const handleNextStep = useCallback(() => {
    // touchForm()

    // if (isFieldsValid) {
    //   nextCb()
    // }

    nextCb()
  }, [nextCb])

  return (
    <>
      <GovVotingSettings
        isOpen={previousSettingsOpened}
        toggle={() => setPreviousSettingsOpened((b) => !b)}
        duration={initialForm.duration}
        quorum={initialForm.quorum}
      />
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
            title="Voting settings"
          />
          <CardDescription>
            <p>
              This proposal will be voted on only by the validators and using
              the current quorum rules.
            </p>
            <br />
            <S.VotingSettingsModalButton
              text="View current voting settings"
              color="default"
              size="no-paddings"
              onClick={handleOpenPreviousSettings}
            />
          </CardDescription>
        </Card>
      </S.StepsRoot>
      <StepsNavigation customNextCb={handleNextStep} />
    </>
  )
}

export default VotingSettings
