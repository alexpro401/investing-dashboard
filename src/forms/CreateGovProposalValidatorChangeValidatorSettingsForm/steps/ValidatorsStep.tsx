import React, { useContext, useCallback } from "react"

import { StepsNavigation, CardHead, Card, CardDescription } from "common"
import ValidatorsList from "components/ValidatorsList"
import { CreateDaoCardStepNumber } from "forms/CreateFundDaoForm/components"
import { stepsControllerContext } from "context/StepsControllerContext"
import { ValidatorsListContext } from "context/govPool/proposals/ValidatorsListContext"
import { useFormValidation } from "hooks/useFormValidation"
import { required, isAddressValidator } from "utils/validators"

import * as S from "../styled"

const ValidatorsStep: React.FC = () => {
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const { balances, validators, hiddenIdxs } = useContext(ValidatorsListContext)

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
    <>
      <S.StepsRoot>
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
        <ValidatorsList />
      </S.StepsRoot>
      <StepsNavigation customNextCb={handleNextStep} />
    </>
  )
}

export default ValidatorsStep
