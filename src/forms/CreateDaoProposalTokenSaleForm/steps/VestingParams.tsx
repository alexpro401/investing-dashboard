import React, { useContext, useCallback, useMemo } from "react"

import { Card, CardFormControl, CardHead, Headline1, RegularText } from "common"
import { useBreakpoints } from "hooks"
import { InputField, DurationField } from "fields"
import { TokenSaleCreatingContext } from "context/govPool/proposals/TokenSaleContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import theme from "theme"

import * as S from "./styled"
import * as SForms from "common/FormSteps/styled"

const VestingParamsStep: React.FC = () => {
  const { nextCb } = useContext(stepsControllerContext)
  const {
    currentProposalIndex,
    tokenSaleProposals,
    handleUpdateTokenSaleProposal,
    vestingValidation,
  } = useContext(TokenSaleCreatingContext)
  const { isMobile } = useBreakpoints()

  const { lockedPercent, lockedDuration, cliffDuration, unlockStepDuration } =
    useMemo(
      () => tokenSaleProposals[currentProposalIndex],
      [tokenSaleProposals, currentProposalIndex]
    )

  const { touchForm, touchField, isFieldsValid, getFieldErrorMessage } =
    useMemo(() => vestingValidation, [vestingValidation])

  const handleNextStep = useCallback(() => {
    touchForm()

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, touchForm, isFieldsValid])

  return (
    <>
      <SForms.StepsRoot>
        {!isMobile && (
          <S.DesktopHeaderWrp>
            <Headline1 color={theme.statusColors.info} desktopWeight={900}>
              Параметры вестинга
            </Headline1>
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              description Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim
            </RegularText>
          </S.DesktopHeaderWrp>
        )}
        <Card>
          <CardHead title="Параматры вестинга" />
          <CardFormControl>
            <InputField
              value={lockedPercent}
              type="number"
              inputMode="decimal"
              label="Locked percent"
              setValue={(newValue) =>
                handleUpdateTokenSaleProposal(
                  currentProposalIndex,
                  "lockedPercent",
                  newValue
                )
              }
              nodeRight={<S.BaseInputPlaceholder>%</S.BaseInputPlaceholder>}
              onBlur={() => touchField("lockedPercent")}
              errorMessage={getFieldErrorMessage("lockedPercent")}
            />
            <DurationField
              value={lockedDuration}
              setValue={(v) =>
                handleUpdateTokenSaleProposal(
                  currentProposalIndex,
                  "lockedDuration",
                  v
                )
              }
              label="Locking period"
              errorMessage={getFieldErrorMessage("lockedDuration")}
              onBlur={() => touchField("lockedDuration")}
            />
            <DurationField
              value={cliffDuration}
              setValue={(v) =>
                handleUpdateTokenSaleProposal(
                  currentProposalIndex,
                  "cliffDuration",
                  v
                )
              }
              label="Cliff"
              errorMessage={getFieldErrorMessage("cliffDuration")}
              onBlur={() => touchField("cliffDuration")}
            />
            <DurationField
              value={unlockStepDuration}
              setValue={(v) =>
                handleUpdateTokenSaleProposal(
                  currentProposalIndex,
                  "unlockStepDuration",
                  v
                )
              }
              label="Unlock step"
              errorMessage={getFieldErrorMessage("unlockStepDuration")}
              onBlur={() => touchField("unlockStepDuration")}
            />
          </CardFormControl>
        </Card>
      </SForms.StepsRoot>
      <SForms.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export { VestingParamsStep }
