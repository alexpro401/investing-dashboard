import Switch from "components/Switch"
import {
  CreateDaoCardHead,
  CreateDaoCardStepNumber,
  CreateDaoCardDescription,
} from "../components"

import { FC, useState } from "react"
import { Flex } from "theme"
import { Icon } from "common"
import { ICON_NAMES } from "constants/icon-names"

import * as S from "forms/CreateFundDaoForm/styled"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import { CenteredImage } from "forms/CreateFundDaoForm/styled"

const IsDaoValidatorStep: FC = () => {
  const [isValidator, setIsValidator] = useState(false)

  return (
    <Flex gap={"16"} dir={"column"} ai={"stretch"} p={"16px"} full>
      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<CreateDaoCardStepNumber number={2} />}
          title="DAO validator settings"
        />
        <CreateDaoCardDescription>
          <p>
            Here you can designate trusted DAO members to serve as validators
            who will hold a validator-only second vote on every passed proposal
            to filter out potentially malicious proposals.
          </p>
          <br />
          <p>
            *Once the pool is created, validator settings can be modified only
            by VALIDATOR VOTING via an appropriate proposal. *Token/NFT selected
            for governance cannot be changed once initially set.
          </p>
        </CreateDaoCardDescription>
      </S.CreateDaoCard>

      <S.CenteredImage src={CreateFundDocsImage} />

      <S.CreateDaoCard>
        <CreateDaoCardHead
          icon={<Icon name={ICON_NAMES.users} />}
          title="Add validator"
          action={
            <Switch
              isOn={isValidator}
              onChange={(n, v) => setIsValidator(v)}
              name={"create-fund-is-validator-step-is-validator"}
            />
          }
        />
        <CreateDaoCardDescription>
          <p>
            Adding validators activates two-stage voting for enhanced DAO
            security. You can also add this function after the DAO is created,
            by voting.
          </p>
        </CreateDaoCardDescription>
      </S.CreateDaoCard>
    </Flex>
  )
}

export default IsDaoValidatorStep
