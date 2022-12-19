import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react"

import {
  AppButton,
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
  TokenChip,
} from "common"
import {
  InputField,
  OverlapInputField,
  TextareaField,
  ExternalDocumentField,
  SocialLinkField,
} from "fields"
import Switch from "components/Switch"
import Avatar from "components/Avatar"
import { CreateDaoCardStepNumber } from "../components"

import * as S from "./styled"

import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { ICON_NAMES } from "constants/icon-names"
import { readFromClipboard } from "utils/clipboard"
import { useFormValidation } from "hooks/useFormValidation"
import {
  isAddressValidator,
  isUrl,
  isUrlFacebook,
  isUrlGithub,
  isUrlLinkedin,
  isUrlMedium,
  isUrlTelegram,
  isUrlTwitter,
  minLength,
  required,
  validateIfExist,
} from "utils/validators"
import { isValidUrl } from "utils"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"
import { stepsControllerContext } from "context/StepsControllerContext"
import { SUPPORTED_SOCIALS } from "constants/socials"
import { createPortal } from "react-dom"
import { useEffectOnce } from "react-use"

interface ITitlesStepProps {
  isCreatingProposal?: boolean
}

const TitlesStep: FC<ITitlesStepProps> = ({ isCreatingProposal = false }) => {
  const daoPoolFormContext = useContext(GovPoolFormContext)

  const { isErc20, isErc721, erc20, erc721, socialLinks } = daoPoolFormContext

  const { avatarUrl, daoName, websiteUrl, description, documents } =
    daoPoolFormContext

  const { tokenAddress, nftAddress, totalPowerInTokens, nftsTotalSupply } =
    daoPoolFormContext.userKeeperParams

  const [isShowSocials, setIsShowSocials] = useState(false)

  const { chainId } = useActiveWeb3React()

  const { nextCb } = useContext(stepsControllerContext)

  const [, erc20TokenData] = erc20
  const {
    name: erc721Name,
    symbol: erc721Symbol,
    isEnumerable: erc721IsEnumerable,
  } = erc721

  const erc20TokenExplorerLink = useMemo(() => {
    return chainId
      ? getExplorerLink(chainId, tokenAddress.get, ExplorerDataType.ADDRESS)
      : ""
  }, [chainId, tokenAddress.get])

  useEffect(() => {
    if (socialLinks.get.length !== 0 && isCreatingProposal) {
      setIsShowSocials(true)
    }
  }, [socialLinks, isCreatingProposal])

  const {
    getFieldErrorMessage,
    touchField,
    isFieldValid,
    touchForm,
    isFieldsValid,
  } = useFormValidation(
    {
      avatarUrl: avatarUrl.get,
      daoName: daoName.get,
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
        ?.map((el) => el[1]),

      documents: documents.get,

      tokenAddress: tokenAddress.get,

      nftAddress: nftAddress.get,
      totalPowerInTokens: totalPowerInTokens.get,
      nftsTotalSupply: nftsTotalSupply.get,
    },
    {
      avatarUrl: { required },
      daoName: { required, minLength: minLength(6) },
      ...(websiteUrl.get ? { websiteUrl: { required, isUrl } } : {}),
      ...(description.get ? { description: { required } } : {}),

      ...(socialLinks.get?.[0]?.[1]
        ? {
            facebook: { isUrl, isUrlFacebook },
          }
        : {}),
      ...(socialLinks.get?.[1]?.[1]
        ? {
            linkedin: { isUrl, isUrlLinkedin },
          }
        : {}),
      ...(socialLinks.get?.[2]?.[1]
        ? {
            medium: { isUrl, isUrlMedium },
          }
        : {}),
      ...(socialLinks.get?.[3]?.[1]
        ? {
            telegram: { isUrl, isUrlTelegram },
          }
        : {}),
      ...(socialLinks.get?.[4]?.[1]
        ? {
            twitter: { isUrl, isUrlTwitter },
          }
        : {}),
      ...(socialLinks.get?.[5]?.[1]
        ? {
            github: { isUrl, isUrlGithub },
          }
        : {}),
      ...(socialLinks.get?.slice(6, socialLinks.get.length)?.map((el) => el[1])
        .length
        ? {
            others: {
              $every: {
                isUrl: validateIfExist(isUrl),
              },
            },
          }
        : {}),

      ...(documents.get.length > 1
        ? {
            documents: {
              required,
              $every: {
                name: { required },
                url: { required, isUrl },
              },
            },
          }
        : {}),

      ...(isErc20.get && !isCreatingProposal
        ? { tokenAddress: { required, isAddressValidator } }
        : {}),
      ...(isErc721.get && !isCreatingProposal
        ? {
            nftAddress: { required, isAddressValidator },
            totalPowerInTokens: { required },
            ...(erc721IsEnumerable ? { nftsTotalSupply: { required } } : {}),
          }
        : {}),
    }
  )

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  const handleNextStep = useCallback(() => {
    touchForm()
    if (!isFieldsValid) return

    nextCb()
  }, [isFieldsValid, nextCb, touchForm])

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
    setIsShowSocials(true)
  }, [socialLinks])

  const SocialLinks = useMemo(
    () => (
      <>
        {!socialLinks.get.length && (
          <S.CardAddBtn
            color="default"
            text="+ Add social links"
            onClick={handleAddSocials}
          />
        )}
        <Collapse isOpen={!!socialLinks.get && isShowSocials}>
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

  const appNavigationEl = document.querySelector("#app-navigation")

  return (
    <>
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={1} />}
            title="DAO Profile"
          />
          <CardDescription>
            {isCreatingProposal && <p>Make your changes below.</p>}
            {!isCreatingProposal && (
              <>
                <p>Enter basic info about your DAO</p>
                <br />
                <p>
                  *Once created, the DAO settings can be changed only by voting
                  via the appropriate proposal.
                </p>
              </>
            )}
          </CardDescription>
        </Card>

        <Avatar
          m="0 auto"
          onCrop={(key, url) => avatarUrl.set(url)}
          showUploader
          size={100}
          url={avatarUrl.get}
        >
          <S.CreateFundDaoAvatarActions>
            <S.CreateFundDaoAvatarBtn>
              {isCreatingProposal ? "Change fund photo" : "Add fund photo"}
            </S.CreateFundDaoAvatarBtn>
            <S.CreateFundDaoAvatarBtnErrorMessage>
              {getFieldErrorMessage("avatarUrl")}
            </S.CreateFundDaoAvatarBtnErrorMessage>
          </S.CreateFundDaoAvatarActions>
        </Avatar>

        {isCreatingProposal && (
          <>
            <Card>
              <CardHead
                nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
                title="DAO Name"
              />
              <CardDescription>
                <p>Up to 15 characters</p>
              </CardDescription>
              <CardFormControl>
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
              </CardFormControl>
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
                {SocialLinks}
              </CardFormControl>
            </Card>
          </>
        )}
        {!isCreatingProposal && (
          <Card>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
              title="About DAO "
            />
            <CardDescription>
              <p>Add your DAO’s website, description, and social links.</p>
            </CardDescription>
            <CardFormControl>
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
              <TextareaField
                value={description.get}
                setValue={description.set}
                label="Description"
                errorMessage={getFieldErrorMessage("description")}
                onBlur={() => touchField("description")}
              />
              <InputField
                value={websiteUrl.get}
                setValue={websiteUrl.set}
                label="Site"
                errorMessage={getFieldErrorMessage("websiteUrl")}
                onBlur={() => touchField("websiteUrl")}
              />
            </CardFormControl>
            {SocialLinks}
          </Card>
        )}

        {!isCreatingProposal && (
          <Card>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.shieldCheck} />}
              title="Governance token information"
            />
            <CardDescription>
              <p>
                For governance, you can choose any ERC-20 token, any (ERC-721)
                NFT, or a hybrid of both.
              </p>
              <br />
              <p>
                *Token/NFT selected for governance cannot be changed once
                initially set.
              </p>
            </CardDescription>
          </Card>
        )}

        {!isCreatingProposal && (
          <Card>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.dollarOutline} />}
              title="ERC-20"
              nodeRight={
                <Switch
                  isOn={isErc20.get}
                  onChange={(n, v) => {
                    isErc20.set(v)
                    if (!v && !isErc721.get) {
                      isErc721.set(true)
                    }
                  }}
                  name={"create-fund-title-step-is-erc20"}
                />
              }
            />
            <CardDescription>
              <p>
                Enter ERC-20 token address or create a new one. 1 token = 1
                Voting power
              </p>
            </CardDescription>
            <Collapse isOpen={isErc20.get}>
              <CardFormControl>
                <OverlapInputField
                  value={tokenAddress.get}
                  setValue={tokenAddress.set}
                  label="ERC-20 token"
                  labelNodeRight={
                    isFieldValid("tokenAddress") ? (
                      <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
                    ) : (
                      <></>
                    )
                  }
                  errorMessage={getFieldErrorMessage("tokenAddress")}
                  onBlur={() => touchField("tokenAddress")}
                  nodeRight={
                    <AppButton
                      type="button"
                      text={"Paste"}
                      color="default"
                      size="no-paddings"
                      onClick={() => pasteFromClipboard(tokenAddress.set)}
                    />
                  }
                  overlapNodeLeft={
                    tokenAddress.get &&
                    erc20TokenData?.name &&
                    erc20TokenData?.symbol && (
                      <TokenChip
                        name={erc20TokenData?.name}
                        symbol={erc20TokenData?.symbol}
                        link={erc20TokenExplorerLink}
                      />
                    )
                  }
                  overlapNodeRight={
                    tokenAddress.get &&
                    erc20TokenData?.name &&
                    erc20TokenData?.symbol && (
                      <AppButton
                        type="button"
                        text="Paste another"
                        color="default"
                        size="no-paddings"
                        onClick={() => {
                          tokenAddress.set("")
                        }}
                      />
                    )
                  }
                  disabled={!!tokenAddress.get && !!erc20TokenData?.name}
                />
              </CardFormControl>
            </Collapse>
          </Card>
        )}

        {!isCreatingProposal && (
          <Card>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.star} />}
              title="ERC-721 (NFT)"
              nodeRight={
                <Switch
                  isOn={isErc721.get}
                  onChange={(n, v) => {
                    isErc721.set(v)
                    if (!v && !isErc20.get) {
                      isErc20.set(true)
                    }
                  }}
                  name={"create-fund-title-step-is-erc721"}
                />
              }
            />
            <CardDescription>
              <p>
                Enter the governing NFT (ERC-721) address, number of NFTs in the
                series, and the voting power. For governance, you can choose any
                ERC-20 token, any (ERC-721) NFT, or a hybrid of both.
              </p>
              <br />
              <p>
                With hybrid governance (ERC-20 + NFT), your NFT can have more
                weight than a token, and thus should have more voting power.
              </p>
            </CardDescription>
            <Collapse isOpen={isErc721.get}>
              <CardFormControl>
                <OverlapInputField
                  value={nftAddress.get}
                  setValue={nftAddress.set}
                  label="NFT ERC-721 address"
                  labelNodeRight={
                    isFieldValid("nftAddress") ? (
                      <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
                    ) : (
                      <></>
                    )
                  }
                  nodeRight={
                    <AppButton
                      type="button"
                      color="default"
                      size="no-paddings"
                      onClick={() => pasteFromClipboard(nftAddress.set)}
                      text={"Paste"}
                    />
                  }
                  overlapNodeLeft={
                    erc721Name &&
                    erc721Symbol && (
                      <TokenChip
                        name={erc721Name}
                        symbol={erc721Symbol}
                        link={erc20TokenExplorerLink}
                      />
                    )
                  }
                  overlapNodeRight={
                    erc721Name &&
                    erc721Symbol && (
                      <AppButton
                        type="button"
                        text="Paste another"
                        color="default"
                        size="no-paddings"
                        onClick={() => {
                          nftAddress.set("")
                        }}
                      />
                    )
                  }
                  errorMessage={getFieldErrorMessage("nftAddress")}
                  onBlur={() => touchField("nftAddress")}
                />
                <InputField
                  value={totalPowerInTokens.get}
                  setValue={totalPowerInTokens.set}
                  label="Voting power of all NFTs"
                  errorMessage={getFieldErrorMessage("totalPowerInTokens")}
                  onBlur={() => touchField("totalPowerInTokens")}
                />
                {!erc721IsEnumerable && (
                  <InputField
                    value={nftsTotalSupply.get}
                    setValue={nftsTotalSupply.set}
                    label="Number of NFTs"
                    errorMessage={getFieldErrorMessage("nftsTotalSupply")}
                    onBlur={() => touchField("nftsTotalSupply")}
                  />
                )}
              </CardFormControl>
            </Collapse>
          </Card>
        )}

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
      {appNavigationEl ? (
        createPortal(
          <S.StepsBottomNavigation customNextCb={handleNextStep} />,
          appNavigationEl
        )
      ) : (
        <></>
      )}
    </>
  )
}

export default TitlesStep
