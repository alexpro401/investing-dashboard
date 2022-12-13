import Switch from "components/Switch"
import { CreateDaoCardStepNumber } from "../components"

import { FC, useCallback, useContext } from "react"
import {
  AppButton,
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
} from "common"
import { AddressAmountField, InputField, DurationField } from "fields"
import { FundDaoCreatingContext } from "context/FundDaoCreatingContext"
import { ICON_NAMES } from "constants/icon-names"

import * as S from "./styled"

import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import { useFormValidation } from "hooks/useFormValidation"
import { isPercentage, required } from "utils/validators"
import { stepsControllerContext } from "context/StepsControllerContext"
import { createPortal } from "react-dom"

const IsDaoValidatorStep: FC = () => {
  const { validatorsParams, isValidator } = useContext(FundDaoCreatingContext)

  const { name, symbol, duration, quorum, validators, balances } =
    validatorsParams

  const { getFieldErrorMessage, touchField, touchForm, isFieldsValid } =
    useFormValidation(
      {
        name: name.get,
        symbol: symbol.get,
        duration: duration.get,
        quorum: quorum.get,
        validators: validators.get,
        balances: balances.get,
      },
      {
        ...(isValidator.get
          ? {
              name: { required },
              symbol: { required },
              duration: { required },
              quorum: { required, isPercentage },
              validators: { required, $every: { required } },
              balances: { required, $every: { required } },
            }
          : {}),
      }
    )

  const { nextCb } = useContext(stepsControllerContext)

  const handleAddValidator = useCallback(() => {
    validators.set([...validators.get, ""])
    balances.set([...balances.get, 0])
  }, [balances, validators])

  const handleRemoveValidator = useCallback(
    (idx: number) => {
      if (validators.get.length > 1) {
        validators.set(validators.get.filter((_, i) => i !== idx))
        balances.set(balances.get.filter((_, i) => i !== idx))
      } else {
        validators.set("", idx)
        balances.set("", idx)
      }
    },
    [balances, validators]
  )

  const handleNextStep = () => {
    touchForm()
    if (!isFieldsValid) return

    nextCb()
  }

  const appNavigationEl = document.querySelector("#app-navigation")

  return (
    <>
      <S.StepsRoot>
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

        <Collapse isOpen={isValidator.get}>
          <S.OverflowedCard>
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
                errorMessage={getFieldErrorMessage("name")}
                onBlur={() => touchField("name")}
              />
              <InputField
                value={symbol.get}
                setValue={symbol.set}
                label="Validator token symbol"
                errorMessage={getFieldErrorMessage("symbol")}
                onBlur={() => touchField("symbol")}
              />
              <DurationField
                value={duration.get}
                setValue={duration.set}
                label="Duration of validator voting"
                placeholder="1Y 6Mon 2w 1d 6H 30Min 9s"
                errorMessage={getFieldErrorMessage("duration")}
                onBlur={() => touchField("duration")}
              />
              <InputField
                value={quorum.get}
                setValue={quorum.set}
                label="Quorum required for a vote pass"
                errorMessage={getFieldErrorMessage("quorum")}
                onBlur={() => touchField("quorum")}
              />
            </CardFormControl>
          </S.OverflowedCard>
        </Collapse>
        <Collapse isOpen={isValidator.get}>
          <S.OverflowedCard>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.users} />}
              title="Validator addresses"
            />
            <CardDescription>
              <p>
                Add all validator addresses and the amount of tokens to
                distribute. The validator tokens will be automatically
                distributed to them accordingly.
              </p>
            </CardDescription>
            <CardFormControl>
              {validators.get.map((el, idx) => (
                <AddressAmountField
                  key={idx}
                  value={validators.get[idx]}
                  setValue={(value) => validators.set(value, idx)}
                  secondValue={balances.get[idx]}
                  setSecondValue={(value) => balances.set(+value || 0, idx)}
                  label={`${idx + 1}. Address 0x...`}
                  internalNodeRight={<span>{symbol.get}</span>}
                  overlapNodeLeft={
                    <AppButton
                      iconRight={ICON_NAMES.trash}
                      size="no-paddings"
                      color="default"
                      onClick={() => handleRemoveValidator(idx)}
                    />
                  }
                  labelNodeRight={
                    !!balances.get[idx] ? (
                      <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
                    ) : null
                  }
                  errorMessage={
                    getFieldErrorMessage(`validators[${idx}]`) ||
                    getFieldErrorMessage(`balances[${idx}]`)
                  }
                  onBlur={() => {
                    touchField(`validators[${idx}]`)
                    touchField(`balances[${idx}]`)
                  }}
                />
              ))}
            </CardFormControl>
            <S.CardFieldBtn
              color="default"
              text="+ Paste address"
              onClick={handleAddValidator}
            />
          </S.OverflowedCard>
        </Collapse>
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

export default IsDaoValidatorStep
