import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react"
import { debounce } from "lodash"

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
} from "fields"
import Switch from "components/Switch"
import Avatar from "components/Avatar"
import { CreateDaoCardStepNumber } from "../components"

import * as S from "../styled"

import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { ICON_NAMES } from "constants/icon-names"
import { readFromClipboard } from "utils/clipboard"
import { useFormValidation } from "hooks/useFormValidation"
import { isAddressValidator, isUrl, required } from "utils/validators"
import { isAddress, isValidUrl } from "utils"
import { useERC20 } from "hooks/useERC20"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useActiveWeb3React } from "hooks"

const TitlesStep: FC = () => {
  const daoPoolFormContext = useContext(FundDaoCreatingContext)

  const { isErc20, isErc721 } = daoPoolFormContext

  const { avatarUrl, daoName, websiteUrl, description, documents } =
    daoPoolFormContext

  const { tokenAddress, nftAddress, totalPowerInTokens, nftsTotalSupply } =
    daoPoolFormContext.userKeeperParams

  const { getFieldErrorMessage, touchField, isFieldValid } = useFormValidation(
    {
      avatarUrl: avatarUrl.get,
      daoName: daoName.get,
      websiteUrl: websiteUrl.get,
      description: description.get,
      documents: documents.get,

      tokenAddress: tokenAddress.get,

      nftAddress: nftAddress.get,
      totalPowerInTokens: totalPowerInTokens.get,
      nftsTotalSupply: nftsTotalSupply.get,
    },
    {
      avatarUrl: { required },
      daoName: { required },
      websiteUrl: { required },
      description: { required },
      documents: { required },

      ...(isErc20.get
        ? { tokenAddress: { required, isAddressValidator } }
        : {}),
      ...(isErc721.get
        ? {
            nftAddress: { required, isAddressValidator },
            totalPowerInTokens: { required },
            nftsTotalSupply: { required },
          }
        : {}),
    }
  )

  const { chainId } = useActiveWeb3React()

  const [, erc20TokenData, , erc20TokenInit] = useERC20(tokenAddress.get)
  const erc20TokenExplorerLink = useMemo(() => {
    return chainId
      ? getExplorerLink(chainId, tokenAddress.get, ExplorerDataType.ADDRESS)
      : ""
  }, [chainId, tokenAddress.get])

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  const handleErc20Input = useCallback(
    debounce(async (address: string) => {
      try {
        if (isAddress(address)) {
          await erc20TokenInit()
        }
      } catch (e) {
        console.error(e)
      }
    }, 1000),
    []
  )

  useEffect(() => {
    handleErc20Input(tokenAddress.get)
  }, [handleErc20Input, tokenAddress.get])

  return (
    <>
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={1} />}
            title="DAO Profile"
          />
          <CardDescription>
            <p>Enter basic info about your DAO</p>
            <br />
            <p>
              *Once created, the DAO settings can be changed only by voting via
              the appropriate proposal.
            </p>
          </CardDescription>
        </Card>

        <Avatar
          m="0 auto"
          onCrop={(key, url) => avatarUrl.set(url)}
          showUploader
          size={100}
          url={avatarUrl.get}
        >
          <S.CreateFundDaoAvatarBtn>Add fund photo</S.CreateFundDaoAvatarBtn>
        </Avatar>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            title="DAO Name"
          />
          <CardDescription>
            <p>*Maximum 15 characters</p>
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

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.dollarOutline} />}
            title="ERC-20"
            nodeRight={
              <Switch
                isOn={isErc20.get}
                onChange={(n, v) => isErc20.set(v)}
                name={"create-fund-title-step-is-erc20"}
              />
            }
          />
          <CardDescription>
            <p>
              Enter ERC-20 token address or create a new one. 1 token = 1 Voting
              power
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
                    text={erc20TokenData?.name ? "Paste another" : "Paste"}
                    color="default"
                    size="no-paddings"
                    onClick={() =>
                      erc20TokenData?.name
                        ? tokenAddress.set("")
                        : pasteFromClipboard(tokenAddress.set)
                    }
                  >
                    Paste
                  </AppButton>
                }
                overlapNodeLeft={
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
                    >
                      Paste
                    </AppButton>
                  )
                }
                disabled={!!erc20TokenData?.name}
              />
            </CardFormControl>
          </Collapse>
        </Card>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.star} />}
            title="ERC-721 (NFT)"
            nodeRight={
              <Switch
                isOn={isErc721.get}
                onChange={(n, v) => isErc721.set(v)}
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
              <InputField
                value={nftAddress.get}
                setValue={nftAddress.set}
                label="NFT ERC-721 address"
                nodeRight={
                  <AppButton
                    type="button"
                    text="paste"
                    color="default"
                    size="no-paddings"
                    onClick={() => pasteFromClipboard(nftAddress.set)}
                  >
                    Paste
                  </AppButton>
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
              <InputField
                value={nftsTotalSupply.get}
                setValue={nftsTotalSupply.set}
                label="Number of NFTs"
                errorMessage={getFieldErrorMessage("nftsTotalSupply")}
                onBlur={() => touchField("nftsTotalSupply")}
              />
            </CardFormControl>
          </Collapse>
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
          </CardFormControl>
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
                // errorMessage={getFieldErrorMessage(`documents[${idx}]`)}
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
      <S.StepsBottomNavigation />
    </>
  )
}

export default TitlesStep
