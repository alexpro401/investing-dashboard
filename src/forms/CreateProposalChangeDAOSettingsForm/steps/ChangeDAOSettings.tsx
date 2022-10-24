import React, { useCallback, useContext, useState, useMemo } from "react"

import {
  AppButton,
  StepsNavigation,
  CardHead,
  Card,
  CardDescription,
  Icon,
  CardFormControl,
} from "common"
import { stepsControllerContext } from "context/StepsControllerContext"
import { CreateDaoCardStepNumber } from "forms/CreateFundDaoForm/components"
import { DaoProposalChangeDaoSettingsCreatingContext } from "context/DaoProposalChangeDaoSettingsCreatingContext"
import {
  InputField,
  ExternalDocumentField,
  TextareaField,
  SocialLinkField,
} from "fields"
import Avatar from "components/Avatar"
import { ICON_NAMES } from "constants/icon-names"
import { useFormValidation } from "hooks/useFormValidation"
import { required, minLength, maxLength, isUrl } from "utils/validators"
import { isValidUrl } from "utils"

import * as S from "../styled"

const ChangeDAOSettings: React.FC = () => {
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const {
    avatarUrl,
    daoName,
    documents,
    description,
    websiteUrl,
    twitterUrl,
    telegramUrl,
    mediumUrl,
    githubUrl,
    customUrls,
  } = useContext(DaoProposalChangeDaoSettingsCreatingContext)

  const [socialLinksOpened, setSocialLinksOpened] = useState<boolean>(false)

  const customLinksNotEmpty = useMemo(
    () =>
      customUrls.get.filter((customUrl) => customUrl.url !== "").length !== 0,
    [customUrls]
  )

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
      telegramUrl: telegramUrl.get,
      twitterUrl: twitterUrl.get,
      mediumUrl: mediumUrl.get,
      githubUrl: githubUrl.get,
      customUrls: customUrls.get,
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
      ...(telegramUrl.get
        ? { telegramUrl: { maxLength: maxLength(200), isUrl } }
        : {}),
      ...(twitterUrl.get
        ? { twitterUrl: { maxLength: maxLength(200), isUrl } }
        : {}),
      ...(mediumUrl.get
        ? { mediumUrl: { maxLength: maxLength(200), isUrl } }
        : {}),
      ...(githubUrl.get
        ? { githubUrl: { maxLength: maxLength(200), isUrl } }
        : {}),
      ...(customLinksNotEmpty
        ? {
            customUrls: {
              $every: {
                url: { maxLength: maxLength(200), isUrl },
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
            {socialLinksOpened && (
              <>
                <SocialLinkField
                  id="twitter"
                  label="twitter"
                  icon={ICON_NAMES.telegram}
                  value={telegramUrl.get}
                  setValue={telegramUrl.set}
                  onBlur={() => touchField("telegramUrl")}
                  errorMessage={getFieldErrorMessage("telegramUrl")}
                  nodeRight={
                    telegramUrl.get !== "" ? (
                      <AppButton
                        type="button"
                        color="default"
                        size="no-paddings"
                        iconRight={ICON_NAMES.trash}
                        onClick={() => telegramUrl.set("")}
                      />
                    ) : (
                      <></>
                    )
                  }
                />
                <SocialLinkField
                  id="telegram"
                  label="telegram"
                  icon={ICON_NAMES.twitter}
                  value={twitterUrl.get}
                  setValue={twitterUrl.set}
                  onBlur={() => touchField("twitterUrl")}
                  errorMessage={getFieldErrorMessage("twitterUrl")}
                  nodeRight={
                    twitterUrl.get !== "" ? (
                      <AppButton
                        type="button"
                        color="default"
                        size="no-paddings"
                        iconRight={ICON_NAMES.trash}
                        onClick={() => twitterUrl.set("")}
                      />
                    ) : (
                      <></>
                    )
                  }
                />
                <SocialLinkField
                  id="mediumUrl"
                  label="medium"
                  icon={ICON_NAMES.medium}
                  value={mediumUrl.get}
                  setValue={mediumUrl.set}
                  onBlur={() => touchField("mediumUrl")}
                  errorMessage={getFieldErrorMessage("mediumUrl")}
                  nodeRight={
                    mediumUrl.get !== "" ? (
                      <AppButton
                        type="button"
                        color="default"
                        size="no-paddings"
                        iconRight={ICON_NAMES.trash}
                        onClick={() => mediumUrl.set("")}
                      />
                    ) : (
                      <></>
                    )
                  }
                />
                <SocialLinkField
                  id="githubUrl"
                  label="github"
                  icon={ICON_NAMES.github}
                  value={githubUrl.get}
                  setValue={githubUrl.set}
                  onBlur={() => touchField("githubUrl")}
                  errorMessage={getFieldErrorMessage("githubUrl")}
                  nodeRight={
                    githubUrl.get !== "" ? (
                      <AppButton
                        type="button"
                        color="default"
                        size="no-paddings"
                        iconRight={ICON_NAMES.trash}
                        onClick={() => githubUrl.set("")}
                      />
                    ) : (
                      <></>
                    )
                  }
                />
                {customUrls.get.map((el, idx) => {
                  const errorMessage = customLinksNotEmpty
                    ? !isUrl(el.url).isValid
                      ? isUrl(el.url).message
                      : !maxLength(200)(el.url).isValid
                      ? maxLength(200)(el.url).message
                      : undefined
                    : undefined

                  return (
                    <SocialLinkField
                      key={idx}
                      id={`custom-social-link-${idx}`}
                      value={el.url}
                      setValue={(newUrl: string) => {
                        customUrls.set({ url: newUrl }, idx)
                      }}
                      errorMessage={errorMessage}
                      nodeRight={
                        el.url !== "" || idx !== 0 ? (
                          <AppButton
                            type="button"
                            color="default"
                            size="no-paddings"
                            iconRight={ICON_NAMES.trash}
                            onClick={() => {
                              if (idx !== 0) {
                                customUrls.set([
                                  ...customUrls.get.filter(
                                    (_, index) => index !== idx
                                  ),
                                ])
                              } else {
                                customUrls.set({ url: "" }, idx)
                              }
                            }}
                          />
                        ) : (
                          <></>
                        )
                      }
                    />
                  )
                })}
              </>
            )}
          </CardFormControl>
          {!socialLinksOpened && (
            <S.CardAddBtn
              color="default"
              text="+ Add social links"
              onClick={() => setSocialLinksOpened(true)}
            />
          )}
          {socialLinksOpened && (
            <S.CardAddBtn
              color="default"
              text="+ Add more"
              onClick={() => {
                customUrls.set([...customUrls.get, { url: "" }])
              }}
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
