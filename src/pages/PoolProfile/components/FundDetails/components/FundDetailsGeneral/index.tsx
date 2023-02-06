import React, { FC, useCallback, useContext, useMemo, useState } from "react"

import { PoolProfileContext } from "pages/PoolProfile/context"
import { Bus, sleep } from "helpers"
import {
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
} from "common"
import { ICON_NAMES, SUPPORTED_SOCIALS } from "consts"
import * as S from "./styled"
import { useEffectOnce } from "react-use"
import Skeleton from "components/Skeleton"
import { SocialLinkField, TextareaField } from "fields"
import { isEqual } from "lodash"
import { useBreakpoints, useForm, useFormValidation } from "hooks"
import {
  isUrl,
  isUrlFacebook,
  isUrlGithub,
  isUrlLinkedin,
  isUrlMedium,
  isUrlTelegram,
  isUrlTwitter,
  required,
  validateIfExist,
} from "utils/validators"
import Avatar from "components/Avatar"

const FundDetailsGeneral: FC = () => {
  const {
    fundSocialLinks,
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
  const [socialLinks, setSocialLinks] = useState<[SUPPORTED_SOCIALS, string][]>(
    fundSocialLinks || []
  )

  const { disableForm, enableForm, isFormDisabled } = useForm()
  const {
    getFieldErrorMessage,
    touchField,
    isFieldsValid,
    isFieldValid,
    touchForm,
  } = useFormValidation(
    {
      fundDescription,
      fundStrategy,
      avatarUrl,

      facebook: socialLinks?.[0]?.[1] || "",
      linkedin: socialLinks?.[1]?.[1] || "",
      medium: socialLinks?.[2]?.[1] || "",
      telegram: socialLinks?.[3]?.[1] || "",
      twitter: socialLinks?.[4]?.[1] || "",
      github: socialLinks?.[5]?.[1] || "",
      others: socialLinks?.slice(6, socialLinks.length)?.map((el) => el[1]),
    },
    {
      ...(isSmallTablet ? { avatarUrl: { required } } : {}),
      fundDescription: {
        required,
      },
      fundStrategy: {
        required,
      },

      ...(socialLinks?.[0]?.[1]
        ? {
            facebook: { isUrl, isUrlFacebook },
          }
        : {}),
      ...(socialLinks?.[1]?.[1]
        ? {
            linkedin: { isUrl, isUrlLinkedin },
          }
        : {}),
      ...(socialLinks?.[2]?.[1]
        ? {
            medium: { isUrl, isUrlMedium },
          }
        : {}),
      ...(socialLinks?.[3]?.[1]
        ? {
            telegram: { isUrl, isUrlTelegram },
          }
        : {}),
      ...(socialLinks?.[4]?.[1]
        ? {
            twitter: { isUrl, isUrlTwitter },
          }
        : {}),
      ...(socialLinks?.[5]?.[1]
        ? {
            github: { isUrl, isUrlGithub },
          }
        : {}),
      ...(socialLinks?.slice(6, socialLinks.length)?.map((el) => el[1]).length
        ? {
            others: {
              $every: {
                isUrl: validateIfExist(isUrl),
              },
            },
          }
        : {}),
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
      setSocialLinks(() => {
        if (!fundSocialLinks?.length) return []

        const defaultSocials = [
          ["facebook", ""],
          ["linkedin", ""],
          ["medium", ""],
          ["telegram", ""],
          ["twitter", ""],
          ["github", ""],
          ["other", ""],
        ].map(
          ([socialType, link]) =>
            fundSocialLinks?.find(
              ([_socialType, _link]) => _socialType === socialType
            ) || ([socialType, link] as [SUPPORTED_SOCIALS, string])
        )

        return defaultSocials
      })
    } catch (error) {
      console.log(error)
      setIsLoadFailed(true)
    }
    setIsLoaded(true)
  }, [_fundDescription, _fundStrategy, fundImageUrl, fundSocialLinks])

  useEffectOnce(() => {
    init()
  })

  const submit = useCallback(async () => {
    touchForm()
    await sleep(500)
    if (!isFieldsValid) return

    if (!fundDescription || !fundStrategy || !updatePoolParameters) return

    disableForm()

    try {
      await updatePoolParameters({
        ...(avatarUrl ? { avatarUrl } : {}),
        fundDescription,
        fundStrategy,
        ...(socialLinks
          ? { socialLinks: socialLinks.filter((el) => el[1]) }
          : {}),
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
    socialLinks,
    touchForm,
    updatePoolParameters,
  ])

  const [isShowSocials, setIsShowSocials] = useState(!!socialLinks?.length)

  const handleAddSocials = useCallback(() => {
    setSocialLinks([
      ["facebook", ""],
      ["linkedin", ""],
      ["medium", ""],
      ["telegram", ""],
      ["twitter", ""],
      ["github", ""],
      ["other", ""],
    ])
    setIsShowSocials(true)
  }, [])

  const SocialLinksCollapse = useMemo(
    () => (
      <>
        {!socialLinks?.length && (
          <S.CardAddBtn
            color="default"
            text="+ Add social links"
            onClick={handleAddSocials}
          />
        )}
        <Collapse isOpen={!!socialLinks && isShowSocials}>
          <CardFormControl>
            {socialLinks?.map(([key, value], idx) => (
              <SocialLinkField
                key={idx}
                socialType={key}
                label={key}
                labelNodeRight={
                  isFieldValid(
                    key === "other" ? `others[${idx - 6}].value` : `${key}`
                  ) ? (
                    <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
                  ) : (
                    <></>
                  )
                }
                value={value}
                setValue={(val) => {
                  setSocialLinks((prevState) => {
                    const nextState = [...prevState]
                    nextState[idx][1] = val as string
                    return nextState
                  })
                }}
                onRemove={() => {
                  setSocialLinks((prevState) => {
                    let nextState = [...prevState]

                    if (key === "other") {
                      nextState = [...prevState.filter((el, i) => i !== idx)]
                    } else {
                      nextState[idx][1] = ""
                    }

                    return nextState
                  })
                }}
                errorMessage={getFieldErrorMessage(
                  key === "other" ? `others[${idx - 6}].value` : `${key}`
                )}
                onPaste={() => {
                  touchField(
                    key === "other" ? `others[${idx - 6}].value` : `${key}`
                  )
                }}
              />
            ))}
            <S.CardAddBtn
              text="+ Add other"
              size="no-paddings"
              color="default"
              onClick={() => {
                setSocialLinks((prevState) => {
                  return [
                    ...prevState,
                    ["other", ""] as [SUPPORTED_SOCIALS, string],
                  ]
                })
              }}
            />
          </CardFormControl>
        </Collapse>
      </>
    ),
    [
      socialLinks,
      getFieldErrorMessage,
      handleAddSocials,
      isFieldValid,
      isShowSocials,
      touchField,
    ]
  )

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
          {SocialLinksCollapse}
        </Card>
        <S.FormSubmitBtn
          text="Confirm changes"
          disabled={!isFieldsValid || isFormDisabled}
          onClick={submit}
        />
      </>
    )
  ) : (
    <S.SkeletonsWrp>
      <Skeleton w={"150px"} h={"150px"} radius={"50%"} />
      <Skeleton w={"50%"} h={"18px"} radius={"20px"} />
      <Skeleton w={"100%"} h={"14px"} radius={"20px"} />
      <Skeleton w={"100%"} h={"14px"} radius={"20px"} />
      <Skeleton h={"150px"} radius={"20px"} />
      <Skeleton h={"150px"} radius={"20px"} />
    </S.SkeletonsWrp>
  )
}

export default FundDetailsGeneral
