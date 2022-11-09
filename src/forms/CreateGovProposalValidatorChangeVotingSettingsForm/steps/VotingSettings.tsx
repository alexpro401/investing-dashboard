import React, { useContext, useCallback, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { parseUnits, formatUnits } from "@ethersproject/units"

import {
  StepsNavigation,
  CardHead,
  Card,
  CardDescription,
  Icon,
  CardFormControl,
} from "common"
import { DurationField, InputField } from "fields"
import GovVotingSettings from "modals/GovVotingSettings"
import { stepsControllerContext } from "context/StepsControllerContext"
import { ChangeVotingSettingsContext } from "context/govPool/proposals/validators/ChangeVotingSettingsContext"
import { CreateDaoCardStepNumber } from "forms/CreateFundDaoForm/components"
import { ICON_NAMES } from "constants/icon-names"
import { EInputBorderColors } from "fields/InputField"
import { useFormValidation } from "hooks/useFormValidation"
import { isPercentage, required } from "utils/validators"
import { useGovValidatorsTokenTotalSupply } from "hooks/dao"
import { divideBignumbers, multiplyBignumbers } from "utils/formulas"
import { cutStringZeroes } from "utils"

import * as S from "../styled"

const VotingSettings: React.FC = () => {
  const { daoAddress } = useParams<"daoAddress">()
  const [totalValidatorsTokenSupply] = useGovValidatorsTokenTotalSupply(
    daoAddress ?? ""
  )

  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const { initialForm, duration, quorum } = useContext(
    ChangeVotingSettingsContext
  )

  const {
    touchForm,
    isFieldsValid,
    isFieldValid,
    getFieldErrorMessage,
    touchField,
  } = useFormValidation(
    { duration: duration.get, quorum: quorum.get },
    { duration: { required }, quorum: { required, isPercentage } }
  )

  const [previousSettingsOpened, setPreviousSettingsOpened] = useState(false)

  const handleOpenPreviousSettings = useCallback(() => {
    setPreviousSettingsOpened(true)
  }, [setPreviousSettingsOpened])

  const handleNextStep = useCallback(() => {
    touchForm()

    if (isFieldsValid) {
      nextCb()
    }

    nextCb()
  }, [nextCb, touchForm, isFieldsValid])

  const durationIsChanged = useMemo(
    () => initialForm.duration !== duration.get,
    [initialForm, duration]
  )

  const quorumIsChanged = useMemo(
    () => initialForm.quorum !== quorum.get,
    [initialForm, quorum]
  )

  const quorumForValidators = useMemo(() => {
    if (!totalValidatorsTokenSupply) return "0"

    const quorumBN = parseUnits(initialForm.quorum.toString(), 18)

    // quorum_votes = (validator_total_supply * validators_quorum) / 100
    const multiplyResult = multiplyBignumbers(
      [quorumBN, 18],
      [totalValidatorsTokenSupply, 18]
    )
    const quorumResult = divideBignumbers(
      [multiplyResult, 18],
      [parseUnits("100"), 18]
    )

    return cutStringZeroes(formatUnits(quorumResult, 18))
  }, [totalValidatorsTokenSupply, initialForm])

  return (
    <>
      <GovVotingSettings
        isOpen={previousSettingsOpened}
        toggle={() => setPreviousSettingsOpened((b) => !b)}
        duration={initialForm.duration}
        quorum={quorumForValidators}
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
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.cog} />}
            title="Voting parameters"
          />
          <CardDescription>
            <p>General settings for voting.</p>
          </CardDescription>
          <CardFormControl>
            <DurationField
              value={duration.get}
              setValue={duration.set}
              label="Duration of voting"
              placeholder="1Y 6Mon 2w 1d"
              errorMessage={getFieldErrorMessage("duration")}
              onBlur={() => touchField("duration")}
              borderColor={
                durationIsChanged ? EInputBorderColors.success : undefined
              }
              labelNodeRight={
                isFieldValid("duration") ? (
                  <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                ) : undefined
              }
            />
            <InputField
              value={quorum.get}
              setValue={quorum.set}
              label="Votes needed for quorum"
              errorMessage={getFieldErrorMessage("quorum")}
              onBlur={() => touchField("quorum")}
              borderColor={
                quorumIsChanged ? EInputBorderColors.success : undefined
              }
              labelNodeRight={
                isFieldValid("quorum") ? (
                  <S.SuccessLabelIcon name={ICON_NAMES.greenCheck} />
                ) : undefined
              }
            />
          </CardFormControl>
        </Card>
      </S.StepsRoot>
      <StepsNavigation customNextCb={handleNextStep} />
    </>
  )
}

export default VotingSettings
