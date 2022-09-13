import { FC, useContext, useState } from "react"
import CreateDaoCardHead from "../components/CreateDaoCardHead"
import CreateDaoCardStepNumber from "../components/CreateDaoCardStepNumber"

import Icon from "components/Icon"
import Switch from "components/Switch"
import Input from "components/Input"
import Avatar from "components/Avatar"
import CreateDaoCardDescription from "../components/CreateDaoCardDescription"
import FileDock from "assets/icons/file-dock.svg"

import { Flex } from "theme"
import * as S from "../styled"
import { FundDaoCreatingContext } from "../../../context/FundDaoCreatingContext"

const CreateFundDaoTitlesStep: FC = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>()
  const [daoName, setDaoName] = useState("")

  const [isErc20, setIsErc20] = useState(false)
  const [erc20token, setErc20token] = useState("")

  const [isErc721, setIsErc721] = useState(false)

  const [websiteUrl, setWebsiteUrl] = useState("")
  const [description, setDescription] = useState("")

  const fundDaoCreatingContext = useContext(FundDaoCreatingContext)

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
          icon={<Icon source={FileDock} m={"0"} />}
          title="DAO Name"
        />
        <CreateDaoCardDescription>
          <p>*Maximum 15 characters</p>
        </CreateDaoCardDescription>
        <Input
          value={daoName}
          onChange={setDaoName}
          theme="grey"
          label="DAO name"
        />
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon source={FileDock} m={"0"} />}
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
          icon={<Icon source={FileDock} m={"0"} />}
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
        <Input
          value={erc20token}
          onChange={setErc20token}
          theme="grey"
          label="ERC-20 token"
        />
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon source={FileDock} m={"0"} />}
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
      </S.CreateDaoCard>

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon source={FileDock} m={"0"} />}
          title="Additional Info"
        />
        <CreateDaoCardDescription>
          <p>Add your DAO’s website, description, and social links.</p>
        </CreateDaoCardDescription>
        <Input
          value={websiteUrl}
          onChange={setWebsiteUrl}
          theme="grey"
          label="Site"
        />
        <Input
          value={description}
          onChange={setDescription}
          theme="grey"
          label="Description"
        />
      </S.CreateDaoCard>
    </Flex>
  )
}

export default CreateFundDaoTitlesStep
