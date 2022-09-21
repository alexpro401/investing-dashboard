import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react"

import { AppButton, Collapse, Icon } from "common"
import { InputField, TextareaField } from "fields"
import Switch from "components/Switch"
import Avatar from "components/Avatar"
import {
  CreateDaoCardDescription,
  CreateDaoCardHead,
  CreateDaoCardStepNumber,
} from "../components"

import * as S from "../styled"

import { Flex } from "theme"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { ICON_NAMES } from "constants/icon-names"
import { readFromClipboard } from "utils/clipboard"
import { useFormValidation } from "hooks/useFormValidation"
import { required } from "utils/validators"

const TitlesStep: FC = () => {
  // to ipfs

  const [isErc20, setIsErc20] = useState(false)
  const [isErc721, setIsErc721] = useState(false)

  const daoPoolFormContext = useContext(FundDaoCreatingContext)

  const { avatarUrl, daoName, websiteUrl, description } = daoPoolFormContext

  const { tokenAddress, nftAddress, totalPowerInTokens, nftsTotalSupply } =
    daoPoolFormContext.userKeeperParams

  const { getFieldErrorMessage, touchField, isFormValid } = useFormValidation(
    {
      avatarUrl: avatarUrl.get,
      daoName: daoName.get,
      websiteUrl: websiteUrl.get,
      description: description.get,

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
      ...(isErc20 ? { tokenAddress: { required } } : {}),
      ...(isErc721
        ? {
            nftAddress: { required },
            totalPowerInTokens: { required },
            nftsTotalSupply: { required },
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

  return (
    <Flex gap={"16"} dir={"column"} ai={"stretch"} p={"16px"} full>
      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<CreateDaoCardStepNumber number={1} />}
          title="DAO Profile"
        />
        <CreateDaoCardDescription>
          <p>Enter basic info about your DAO</p>
          <br />
          <p>
            *Once created, the DAO settings can be changed only by voting via
            the appropriate proposal.
          </p>
        </CreateDaoCardDescription>
      </S.CreateDaoCard>

      <Avatar
        m="0 auto"
        onCrop={(key, url) => avatarUrl.set(url)}
        showUploader
        size={100}
        url={avatarUrl.get}
      >
        <S.CreateFundDaoAvatarBtn>Add fund photo</S.CreateFundDaoAvatarBtn>
      </Avatar>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.fileDock} />}
          title="DAO Name"
        />
        <CreateDaoCardDescription>
          <p>*Maximum 15 characters</p>
        </CreateDaoCardDescription>
        <InputField
          value={daoName.get}
          setValue={daoName.set}
          label="DAO name"
          nodeRight={<Icon name={ICON_NAMES.fileDock} />}
          errorMessage={getFieldErrorMessage("daoName")}
          onBlur={() => touchField("daoName")}
        />
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.shieldCheck} />}
          title="Governance token information"
        />
        <CreateDaoCardDescription>
          <p>
            For governance, you can choose any ERC-20 token, any (ERC-721) NFT,
            or a hybrid of both.
          </p>
          <br />
          <p>
            *Token/NFT selected for governance cannot be changed once initially
            set.
          </p>
        </CreateDaoCardDescription>
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.dollarOutline} />}
          title="ERC-20"
          action={
            <Switch
              isOn={isErc20}
              onChange={(n, v) => setIsErc20(v)}
              name={"create-fund-title-step-is-erc20"}
            />
          }
        />
        <CreateDaoCardDescription>
          <p>
            Enter ERC-20 token address or create a new one. 1 token = 1 Voting
            power
          </p>
        </CreateDaoCardDescription>
        <Collapse isOpen={isErc20}>
          <InputField
            value={tokenAddress.get}
            setValue={tokenAddress.set}
            label="ERC-20 token"
            errorMessage={getFieldErrorMessage("tokenAddress")}
            onBlur={() => touchField("tokenAddress")}
          />
        </Collapse>
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.star} />}
          title="ERC-721 (NFT)"
          action={
            <Switch
              isOn={isErc721}
              onChange={(n, v) => setIsErc721(v)}
              name={"create-fund-title-step-is-erc721"}
            />
          }
        />
        <CreateDaoCardDescription>
          <p>
            Enter the governing NFT (ERC-721) address, number of NFTs in the
            series, and the voting power. For governance, you can choose any
            ERC-20 token, any (ERC-721) NFT, or a hybrid of both.
          </p>
          <br />
          <p>
            With hybrid governance (ERC-20 + NFT), your NFT can have more weight
            than a token, and thus should have more voting power.
          </p>
        </CreateDaoCardDescription>
        <Collapse isOpen={isErc721}>
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
        </Collapse>
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.globe} />}
          title="Additional Info"
        />
        <CreateDaoCardDescription>
          <p>Add your DAO’s website, description, and social links.</p>
        </CreateDaoCardDescription>
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
      </S.CreateDaoCard>
    </Flex>
  )
}

export default TitlesStep
