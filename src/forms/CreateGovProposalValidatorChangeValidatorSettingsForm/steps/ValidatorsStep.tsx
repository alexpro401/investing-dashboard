import React, { useContext, useCallback } from "react"

import { CardHead, Card, CardDescription, Headline1, RegularText } from "common"
import ValidatorsList from "components/ValidatorsList"
import { CreateDaoCardStepNumber } from "common"
import { stepsControllerContext } from "context/StepsControllerContext"
import { ValidatorsListContext } from "context/govPool/proposals/ValidatorsListContext"
import { useFormValidation, useBreakpoints } from "hooks"
import { required, isAddressValidator } from "utils/validators"
import theme from "theme"

import * as S from "common/FormSteps/styled"
import { DesktopHeaderWrp } from "../styled"

const ValidatorsStep: React.FC = () => {
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const { balances, validators, hiddenIdxs } = useContext(ValidatorsListContext)

  const { isMobile } = useBreakpoints()
  const { isFieldsValid, touchForm } = useFormValidation(
    {
      balances: balances.filter((_, idx) => !hiddenIdxs.includes(idx)),
      validators: validators.filter((_, idx) => !hiddenIdxs.includes(idx)),
    },
    {
      balances: {
        required,
        $every: {
          required,
        },
      },
      validators: {
        required,
        $every: {
          required,
          isAddressValidator,
        },
      },
    }
  )

  const handleNextStep = useCallback(() => {
    touchForm()

    if (
      balances
        .filter((_, idx) => !hiddenIdxs.includes(idx))
        .filter((balance) => balance !== "" && Number(balance) !== 0).length !==
      balances.filter((_, idx) => !hiddenIdxs.includes(idx)).length
    ) {
      return
    }

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, touchForm, isFieldsValid, hiddenIdxs, balances])

  return (
    <S.StepsRoot>
      {isMobile && (
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
            title="Validators"
          />
          <CardDescription>
            <p>
              Here you can propose adding/removing validators, and the change
              voting power of each validator.
            </p>
            <p>Will be voted on by validators only.</p>
          </CardDescription>
        </Card>
      )}
      {!isMobile && (
        <DesktopHeaderWrp>
          <Headline1 color={theme.statusColors.info} desktopWeight={900}>
            Validators
          </Headline1>
          <RegularText
            color={theme.textColors.secondary}
            desktopWeight={500}
            desktopSize={"14px"}
          >
            Here you can propose adding/removing validators, and the change
            voting power of each validator.
          </RegularText>
          <RegularText
            color={theme.textColors.secondary}
            desktopWeight={500}
            desktopSize={"14px"}
          >
            Will be voted on by validators only.
          </RegularText>
        </DesktopHeaderWrp>
      )}
      <ValidatorsList />
      <S.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </S.StepsRoot>
  )
}

export default ValidatorsStep
