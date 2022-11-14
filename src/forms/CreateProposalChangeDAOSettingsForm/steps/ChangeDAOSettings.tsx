import React, { useCallback, useContext, useEffect, useState } from "react"

import {
  AppButton,
  StepsNavigation,
  CardHead,
  Card,
  CardDescription,
  Icon,
  CardFormControl,
  Collapse,
} from "common"
import { stepsControllerContext } from "context/StepsControllerContext"
import { CreateDaoCardStepNumber } from "common"
import { ChangeGovSettingsContext } from "context/govPool/proposals/regular/ChangeGovSettingsContext"
import {
  InputField,
  ExternalDocumentField,
  TextareaField,
  SocialLinkField,
} from "fields"
import Avatar from "components/Avatar"
import { ICON_NAMES } from "constants/icon-names"
import { useFormValidation } from "hooks/useFormValidation"
import {
  required,
  minLength,
  maxLength,
  isUrl,
  isUrlFacebook,
  isUrlLinkedin,
  isUrlMedium,
  isUrlTelegram,
  isUrlTwitter,
  isUrlGithub,
} from "utils/validators"
import { isValidUrl } from "utils"
import { SUPPORTED_SOCIALS } from "constants/socials"

import * as S from "../styled"

const ChangeDAOSettings: React.FC = () => {
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const {
    avatarUrl,
    daoName,
    documents,
    description,
    websiteUrl,
    socialLinks,
  } = useContext(ChangeGovSettingsContext)

  const [socialLinksOpened, setSocialLinksOpened] = useState<boolean>(false)

  const {
    touchField,
    getFieldErrorMessage,
    isFieldValid,
    isFieldsValid,
    touchForm,
  } = useFormValidation(
    {
      avatarUrl: avatarUrl.get,
      daoName: daoName.get,
      documents: documents.get,
      websiteUrl: websiteUrl.get,
      description: description.get,

      facebook: socialLinks.get?.[0]?.[1] || "",
      linkedin: socialLinks.get?.[1]?.[1] || "",
      medium: socialLinks.get?.[2]?.[1] || "",
      telegram: socialLinks.get?.[3]?.[1] || "",
      twitter: socialLinks.get?.[4]?.[1] || "",
      github: socialLinks.get?.[5]?.[1] || "",
      others: socialLinks.get
        ?.slice(6, socialLinks.get.length)
        ?.map((el) => ({ key: el[0], value: el[1] })),
    },
    {
      avatarUrl: { required },
      daoName: { required, minLength: minLength(6) },
      documents: {
        required,
        $every: {
          name: { required, maxLength: maxLength(50) },
          url: { required, isUrl, maxLength: maxLength(200) },
        },
      },
      websiteUrl: { required, isUrl, maxLength: maxLength(200) },
      description: { required, maxLength: maxLength(1000) },

      ...(!!socialLinks.get?.[0]?.[1]
        ? {
            facebook: { isUrl, isUrlFacebook },
          }
        : {}),
      ...(!!socialLinks.get?.[1]?.[1]
        ? {
            linkedin: { isUrl, isUrlLinkedin },
          }
        : {}),
      ...(!!socialLinks.get?.[2]?.[1]
        ? {
            medium: { isUrl, isUrlMedium },
          }
        : {}),
      ...(!!socialLinks.get?.[3]?.[1]
        ? {
            telegram: { isUrl, isUrlTelegram },
          }
        : {}),
      ...(!!socialLinks.get?.[4]?.[1]
        ? {
            twitter: { isUrl, isUrlTwitter },
          }
        : {}),
      ...(!!socialLinks.get?.[5]?.[1]
        ? {
            github: { isUrl, isUrlGithub },
          }
        : {}),
      ...(socialLinks.get
        ?.slice(6, socialLinks.get.length)
        ?.map((el) => ({ key: el[0], value: el[1] })).length
        ? {
            others: {
              $every: {
                value: {
                  isUrl,
                },
              },
            },
          }
        : {}),
    }
  )

  const handleNextStep = useCallback(() => {
    touchForm()

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, touchForm, isFieldsValid])

  const handleAddSocials = useCallback(() => {
    socialLinks.set([
      ["facebook", ""],
      ["linkedin", ""],
      ["medium", ""],
      ["telegram", ""],
      ["twitter", ""],
      ["github", ""],
      ["other", ""],
    ])
    setSocialLinksOpened(true)
  }, [socialLinks])

  useEffect(() => {
    if (socialLinks.get.length > 0) {
      setSocialLinksOpened(true)
    }
  }, [socialLinks])

  return (
    <>
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
            title="DAO Settings"
          />
          <CardDescription>
            <p>Make your changes below.</p>
          </CardDescription>
        </Card>
        <Avatar
          m="0 auto"
          onCrop={(key, url) => avatarUrl.set(url)}
          showUploader
          size={100}
          url={avatarUrl.get}
        >
          <S.ChangeDaoAvatarBtn>Change fund photo</S.ChangeDaoAvatarBtn>
        </Avatar>
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            title="DAO Name"
          />
          <CardDescription>
            <p>Up to 15 characters</p>
          </CardDescription>
          <InputField
            value={daoName.get}
            setValue={daoName.set}
            label="DAO name"
            labelNodeRight={
              isFieldValid("daoName") ? (
                <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
              ) : (
                <></>
              )
            }
            errorMessage={getFieldErrorMessage("daoName")}
            onBlur={() => touchField("daoName")}
          />
        </Card>
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.globe} />}
            title="Additional Info"
          />
          <CardDescription>
            <p>Add your DAO’s website, description, and social links.</p>
          </CardDescription>
          <CardFormControl>
            <InputField
              value={websiteUrl.get}
              setValue={websiteUrl.set}
              label="Site"
              errorMessage={getFieldErrorMessage("websiteUrl")}
              onBlur={() => touchField("websiteUrl")}
            />
            <TextareaField
              value={description.get}
              setValue={description.set}
              label="Description"
              errorMessage={getFieldErrorMessage("description")}
              onBlur={() => touchField("description")}
            />

            <Collapse isOpen={!!socialLinks.get && socialLinksOpened}>
              <CardFormControl>
                {socialLinks.get.map(([key, value], idx) => (
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
                      socialLinks.set((prevState) => {
                        const nextState = [...prevState]
                        nextState[idx][1] = val as string
                        return nextState
                      })
                    }}
                    onRemove={() => {
                      socialLinks.set((prevState) => {
                        let nextState = [...prevState]

                        if (key === "other") {
                          nextState = [
                            ...prevState.filter((el, i) => i !== idx),
                          ]
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
                    socialLinks.set((prevState) => {
                      return [
                        ...prevState,
                        ["other", ""] as [SUPPORTED_SOCIALS, string],
                      ]
                    })
                  }}
                />
              </CardFormControl>
            </Collapse>
          </CardFormControl>
          {!socialLinks.get.length && (
            <S.CardAddBtn
              color="default"
              text="+ Add social links"
              onClick={handleAddSocials}
            />
          )}
        </Card>
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.globe} />}
            title="Add documents"
          />
          <CardDescription>
            <p>
              Here you can add any documents to be featured in the DAO’s
              profile, such as the DAO Memorandum.
            </p>
          </CardDescription>
          <CardFormControl>
            {documents.get.map((el, idx) => (
              <ExternalDocumentField
                key={idx}
                value={el}
                setValue={(doc) => documents.set(doc, idx)}
                topFieldNodeRight={
                  documents.get.length > 1 ? (
                    <AppButton
                      type="button"
                      color="default"
                      size="no-paddings"
                      iconRight={ICON_NAMES.trash}
                      onClick={() =>
                        documents.set(documents.get.filter((_, i) => i !== idx))
                      }
                    />
                  ) : null
                }
                label={`Document ${idx + 1}`}
                labelNodeRight={
                  !!el.name && !!el.url && isValidUrl(el.url) ? (
                    <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
                  ) : (
                    <></>
                  )
                }
                errorMessage={
                  getFieldErrorMessage(`documents[${idx}].url`) ||
                  getFieldErrorMessage(`documents[${idx}].name`)
                }
                onBlur={() => {
                  touchField(`documents[${idx}].name`)
                  touchField(`documents[${idx}].url`)
                }}
              />
            ))}
          </CardFormControl>
          <S.CardAddBtn
            color="default"
            text="+ Add more"
            onClick={() =>
              documents.set([...documents.get, { name: "", url: "" }])
            }
          />
        </Card>
      </S.StepsRoot>
      <StepsNavigation customNextCb={handleNextStep} />
    </>
  )
}

export default ChangeDAOSettings
