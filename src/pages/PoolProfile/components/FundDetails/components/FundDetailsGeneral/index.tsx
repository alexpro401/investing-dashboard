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
import { useBreakpoints, useForm, useFormValidation } from "hooks"
import { required } from "utils/validators"
import Avatar from "components/Avatar"

const FundDetailsGeneral: FC = () => {
  const {
    fundDescription: _fundDescription,
    fundStrategy: _fundStrategy,
    fundImageUrl,
    updatePoolParameters,
  } = useContext(PoolProfileContext)

  const { isSmallTablet } = useBreakpoints()

  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoadFailed, setIsLoadFailed] = useState(false)

  const [avatarUrl, setAvatarUrl] = useState(fundImageUrl || "")
  const [fundDescription, setFundDescription] = useState(_fundDescription || "")
  const [fundStrategy, setFundStrategy] = useState(_fundStrategy || "")

  const { disableForm, enableForm, isFormDisabled } = useForm()
  const { getFieldErrorMessage, touchField, isFieldsValid, touchForm } =
    useFormValidation(
      {
        fundDescription,
        fundStrategy,
        avatarUrl,
      },
      {
        ...(isSmallTablet ? { avatarUrl: { required } } : {}),
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
      setAvatarUrl(fundImageUrl || "")
    } catch (error) {
      console.log(error)
      setIsLoadFailed(true)
    }
    setIsLoaded(true)
  }, [_fundDescription, _fundStrategy, fundImageUrl])

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
        ...(avatarUrl ? { avatarUrl } : {}),
        fundDescription,
        fundStrategy,
      })
      Bus.emit("manage-modal/menu")
    } catch (error) {}

    enableForm()
  }, [
    _fundDescription,
    _fundStrategy,
    avatarUrl,
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
        {isSmallTablet ? (
          <S.FundAvatarWrp>
            <Avatar
              m="0 auto"
              onCrop={(key, url) => setAvatarUrl(url)}
              showUploader
              size={100}
              url={avatarUrl}
            >
              <S.FundAvatarChangeBtn>
                {isSmallTablet && getFieldErrorMessage("avatarUrl")
                  ? getFieldErrorMessage("avatarUrl")
                  : "Change fund photo"}
              </S.FundAvatarChangeBtn>
            </Avatar>
          </S.FundAvatarWrp>
        ) : (
          <></>
        )}

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
