import { FC, useState } from "react"
import {
  CreateDaoCardHead,
  CreateDaoCardStepNumber,
  CreateDaoCardDescription,
} from "../components"

import { Collapse, Icon } from "common"
import Switch from "components/Switch"
import { InputField } from "fields"
import Avatar from "components/Avatar"
import { AnimatePresence, motion } from "framer-motion"

import { Flex } from "theme"
import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"
import { readFromClipboard } from "../../../utils/clipboard"

const TitlesStep: FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [daoName, setDaoName] = useState("")

  const [isErc20, setIsErc20] = useState(false)
  const [erc20token, setErc20token] = useState("")

  const [isErc721, setIsErc721] = useState(false)

  const [websiteUrl, setWebsiteUrl] = useState("")
  const [description, setDescription] = useState("")

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
        onCrop={(key, url) => setAvatarUrl(url)}
        showUploader
        size={100}
        url={avatarUrl}
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
          value={daoName}
          setValue={setDaoName}
          label="DAO name"
          nodeRight={<Icon name={ICON_NAMES.fileDock} />}
          errorMessage={daoName}
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
            value={erc20token}
            setValue={setErc20token}
            label="ERC-20 token"
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
            Enter ERC-721 address, number of NFTs in the series, and how many
            votes will each NFT represent.
          </p>
        </CreateDaoCardDescription>
        <Collapse isOpen={isErc721}>
          <InputField
            value={erc20token}
            setValue={setErc20token}
            label="NFT ERC-721 address"
            nodeRight={<button type="button">Paste</button>}
          />
          <InputField
            value={erc20token}
            setValue={setErc20token}
            label="Voting power of all NFTs"
          />
          <InputField
            value={erc20token}
            setValue={setErc20token}
            label="Number of NFTs"
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
        <InputField value={websiteUrl} setValue={setWebsiteUrl} label="Site" />
        <InputField
          value={description}
          setValue={setDescription}
          label="Description"
          nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
        />
      </S.CreateDaoCard>
    </Flex>
  )
}

export default TitlesStep
