import Switch from "components/Switch"
import { CreateDaoCardStepNumber } from "../components"

import { FC, useCallback, useContext } from "react"
import {
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
  Headline1,
  RegularText,
} from "common"
import { InputField, DurationField } from "fields"
import ValidatorField from "components/ValidatorsList/ValidatorField"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { ICON_NAMES } from "constants/icon-names"
import CreateFundDocsImage from "assets/others/create-fund-docs.png"
import { useFormValidation, useBreakpoints } from "hooks"
import { isPercentage, required } from "utils/validators"
import theme from "theme"
import { stepsControllerContext } from "context/StepsControllerContext"

import * as S from "./styled"

const IsDaoValidatorStep: FC = () => {
  const { validatorsParams, isValidator } = useContext(GovPoolFormContext)

  const { isMobile } = useBreakpoints()
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

  return (
    <>
      <S.StepsRoot>
        {isMobile && (
          <Card>
            <CardHead
              nodeLeft={<CreateDaoCardStepNumber number={2} />}
              title="DAO validator settings"
            />
            <CardDescription>
              <p>
                Here you can designate trusted DAO members to serve as
                validators who will hold a validator-only second vote on every
                passed proposal to filter out potentially malicious proposals.
              </p>
              <br />
              <p>
                *Once the pool is created, validator settings can be modified
                only by VALIDATOR VOTING via an appropriate proposal. *Token/NFT
                selected for governance cannot be changed once initially set.
              </p>
            </CardDescription>
          </Card>
        )}
        {!isMobile && (
          <S.DesktopHeaderWrp>
            <Headline1 color={theme.statusColors.info} desktopWeight={900}>
              DAO validator settings
            </Headline1>
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              Here you can designate trusted DAO members to serve as validators
              who will hold a validator-only second vote on every passed
              proposal to filter out potentially malicious proposals.
            </RegularText>
            <br />
            <RegularText
              color={theme.textColors.secondary}
              desktopWeight={500}
              desktopSize={"14px"}
            >
              *Once the pool is created, validator settings can be modified only
              by VALIDATOR VOTING via an appropriate proposal. *Token/NFT
              selected for governance cannot be changed once initially set.
            </RegularText>
          </S.DesktopHeaderWrp>
        )}

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
            <S.SettingsWrapper>
              <S.ValidatorTokenComboField>
                <S.ValidatorTokenLeft
                  type={"text"}
                  value={name.get}
                  setValue={(value: string | number) =>
                    name.set(value.toString())
                  }
                  label={"Validator token name"}
                  errorMessage={getFieldErrorMessage("name")}
                  onBlur={() => touchField("name")}
                />
                <S.ValidatorTokenRight
                  value={symbol.get}
                  setValue={(value: string | number) =>
                    symbol.set(value.toString())
                  }
                  label={"Validator token symbol"}
                  errorMessage={getFieldErrorMessage("symbol")}
                  onBlur={() => touchField("symbol")}
                />
              </S.ValidatorTokenComboField>
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
            </S.SettingsWrapper>
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
              {validators.get.map((_, idx) => (
                <>
                  <ValidatorField
                    address={validators.get[idx]}
                    amount={
                      !balances.get[idx] ? "" : balances.get[idx].toString()
                    }
                    errorMessage={
                      getFieldErrorMessage(`validators[${idx}]`) ||
                      getFieldErrorMessage(`balances[${idx}]`)
                    }
                    handleDelete={() => handleRemoveValidator(idx)}
                    handleHide={() => {}}
                    handleRestore={() => {}}
                    isHidden={false}
                    isInitial={false}
                    setAddress={(newAddress: string) =>
                      validators.set(newAddress, idx)
                    }
                    setAmount={(newAmount: string) =>
                      balances.set(+newAmount || 0, idx)
                    }
                    token={symbol.get}
                  />
                </>
              ))}
            </CardFormControl>
            <S.CardFieldBtn
              color="default"
              text="+ Add validator"
              onClick={handleAddValidator}
            />
          </S.OverflowedCard>
        </Collapse>
      </S.StepsRoot>
      <S.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export default IsDaoValidatorStep
