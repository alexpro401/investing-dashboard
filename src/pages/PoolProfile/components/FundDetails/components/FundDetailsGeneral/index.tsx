import { FC, useCallback, useContext, useState } from "react"

import { PoolProfileContext } from "pages/PoolProfile/context"
import { Bus, sleep } from "helpers"
import { Card, CardDescription, CardHead, Icon } from "common"
import { ICON_NAMES } from "consts"
import * as S from "./styled"
import { useEffectOnce } from "react-use"
import Skeleton from "components/Skeleton"
import { TextareaField } from "fields"
import { isEqual } from "lodash"
import { useForm, useFormValidation } from "hooks"
import { required } from "utils/validators"

const FundDetailsGeneral: FC = () => {
  const {
    fundDescription: _fundDescription,
    fundStrategy: _fundStrategy,
    updatePoolParameters,
  } = useContext(PoolProfileContext)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)

  const [fundDescription, setFundDescription] = useState(_fundDescription || "")
  const [fundStrategy, setFundStrategy] = useState(_fundStrategy || "")

  const { disableForm, enableForm, isFormDisabled } = useForm()
  const { getFieldErrorMessage, touchField, isFieldsValid, touchForm } =
    useFormValidation(
      {
        fundDescription,
        fundStrategy,
      },
      {
        fundDescription: {
          required,
        },
        fundStrategy: {
          required,
        },
      }
    )

  const init = useCallback(async () => {
    setIsLoaded(false)
    setIsLoadFailed(false)

    try {
      await sleep(500)
      setFundDescription(_fundDescription || "")
      setFundStrategy(_fundStrategy || "")
    } catch (error) {
      console.log(error)
      setIsLoadFailed(true)
    }
    setIsLoaded(true)
  }, [_fundDescription, _fundStrategy])

  useEffectOnce(() => {
    init()
  })

  const submit = useCallback(async () => {
    disableForm()

    touchForm()
    await sleep(500)
    if (!isFieldsValid) return

    if (
      !fundDescription ||
      !fundStrategy ||
      isEqual(fundDescription, _fundDescription) ||
      isEqual(fundStrategy, _fundStrategy) ||
      !updatePoolParameters
    )
      return

    try {
      await updatePoolParameters({
        fundDescription,
        fundStrategy,
      })
      Bus.emit("manage-modal/menu")
    } catch (error) {}

    enableForm()
  }, [
    _fundDescription,
    _fundStrategy,
    disableForm,
    enableForm,
    fundDescription,
    fundStrategy,
    isFieldsValid,
    touchForm,
    updatePoolParameters,
  ])

  return isLoaded ? (
    isLoadFailed ? (
      <>Oops... Something went wrong</>
    ) : (
      <>
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            title="Fund details"
          />
          <CardDescription>
            <p>
              Добавьте описание для инвесторов, это можно изменить в любой
              момент после создания
            </p>
          </CardDescription>
          <TextareaField
            value={fundDescription}
            setValue={setFundDescription}
            errorMessage={getFieldErrorMessage("fundDescription")}
            onBlur={() => touchField("fundDescription")}
            disabled={isFormDisabled}
          />
          <TextareaField
            value={fundStrategy}
            setValue={setFundStrategy}
            errorMessage={getFieldErrorMessage("fundStrategy")}
            onBlur={() => touchField("fundStrategy")}
            disabled={isFormDisabled}
          />
        </Card>
        <S.FormSubmitBtn
          text="Confirm changes"
          disabled={!isFieldsValid || isFormDisabled}
          onClick={submit}
        />
      </>
    )
  ) : (
    <span>
      <Skeleton h={"150px"} radius={"20px"} />
    </span>
  )
}

export default FundDetailsGeneral
