import Switch from "components/Switch"
import { CreateDaoCardStepNumber } from "../components"

import { FC, useContext } from "react"
import {
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
} from "common"
import { InputField } from "fields"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { ICON_NAMES } from "constants/icon-names"

import * as S from "forms/CreateFundDaoForm/styled"

import CreateFundDocsImage from "assets/others/create-fund-docs.png"

const IsDaoValidatorStep: FC = () => {
  const { validatorsParams, isValidator } = useContext(FundDaoCreatingContext)

  const { name, symbol, duration, quorum } = validatorsParams

  return (
    <>
      <S.StepsRoot gap={"16"} dir={"column"} ai={"stretch"} p={"16px"} full>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={2} />}
            title="DAO validator settings"
          />
          <CardDescription>
            <p>
              Here you can designate trusted DAO members to serve as validators
              who will hold a validator-only second vote on every passed
              proposal to filter out potentially malicious proposals.
            </p>
            <br />
            <p>
              *Once the pool is created, validator settings can be modified only
              by VALIDATOR VOTING via an appropriate proposal. *Token/NFT
              selected for governance cannot be changed once initially set.
            </p>
          </CardDescription>
        </Card>

        <S.CenteredImage src={CreateFundDocsImage} />

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.users} />}
            title="Add validator"
            nodeRight={
              <Switch
                isOn={isValidator.get}
                onChange={(n, v) => isValidator.set(v)}
                name={"create-fund-is-validator-step-is-validator"}
              />
            }
          />
          <CardDescription>
            <p>
              Adding validators activates two-stage voting for enhanced DAO
              security. You can also add this function after the DAO is created,
              by voting.
            </p>
          </CardDescription>
        </Card>

        <Collapse isOpen={isValidator.get} duration={0.5}>
          <Card>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.users} />}
              title="Validator settings"
            />
            <CardDescription>
              <p>
                Validators can also create special proposals to be voted on
                exclusively among themselves.
              </p>
              <br />
              <p>
                Validators vote via a separate token that you will create and
                configure below.
              </p>
            </CardDescription>
            <CardFormControl>
              <InputField
                value={name.get}
                setValue={name.set}
                label="Validator token name"
              />
              <InputField
                value={symbol.get}
                setValue={symbol.set}
                label="Validator token symbol"
              />
              <InputField
                value={duration.get}
                setValue={duration.set}
                label="Duration of validator voting"
              />
              <InputField
                value={quorum.get}
                setValue={quorum.set}
                label="Quorum required for a vote pass"
              />
            </CardFormControl>
          </Card>
        </Collapse>
      </S.StepsRoot>
      <S.StepsBottomNavigation />
    </>
  )
}

export default IsDaoValidatorStep