import { FC, HTMLAttributes, useCallback, useContext, useState } from "react"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import {
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Collapse,
  Icon,
} from "common"
import { InputField } from "fields"

import { ICON_NAMES } from "consts"
import { useTranslation } from "react-i18next"

import * as S from "./styled"
import Slider from "components/Slider"
import { isAddress, shortenAddress } from "utils"
import { useActiveWeb3React } from "hooks"
import { isEqual } from "lodash"
import { readFromClipboard } from "../../../utils/clipboard"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TokenCreationStep: FC<Props> = ({ ...rest }) => {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const { tokenCreation } = useContext(GovPoolFormContext)

  const { nextCb } = useContext(stepsControllerContext)

  const [daoCreatorRecipient, setDaoCreatorRecipient] = useState({
    address: account,
    amount: "0",
  })

  const handleNextStep = useCallback(() => {
    nextCb()
  }, [nextCb])

  const handleTotalSupplyChange = (v: string | number) => {
    tokenCreation.totalSupply.set(String(v))
    tokenCreation.treasury.set(String(v))
    tokenCreation.initialDistribution.set("0")
  }

  const handleTreasuryChange = useCallback(
    (v: string | number) => {
      const totalSupply = Number(tokenCreation.totalSupply.get)
      const treasury = Number(v)

      tokenCreation.treasury.set(String(v))
      tokenCreation.initialDistribution.set(String(totalSupply - treasury))
    },
    [
      tokenCreation.initialDistribution,
      tokenCreation.totalSupply.get,
      tokenCreation.treasury,
    ]
  )

  const handleInitialDistributionChange = useCallback(
    (v: string | number) => {
      const totalSupply = Number(tokenCreation.totalSupply.get)
      const initialDistribution = Number(v)

      tokenCreation.initialDistribution.set(String(v))
      tokenCreation.treasury.set(String(totalSupply - initialDistribution))
    },
    [
      tokenCreation.initialDistribution,
      tokenCreation.totalSupply.get,
      tokenCreation.treasury,
    ]
  )

  const handleRecipientAmountChange = useCallback(
    (value: number | string, idx: number) => {
      if (!tokenCreation.recipients.get[idx]) return

      tokenCreation.recipients.set((prevState) => {
        const newState = [...(prevState ? prevState : [])]

        newState[idx].amount = String(value)

        return newState
      })
    },
    [tokenCreation.recipients]
  )

  const addRecipient = useCallback(() => {
    tokenCreation.recipients.set((prevState) => {
      const newState = [
        ...(prevState ? prevState : []),
        { address: "", amount: "" },
      ]

      return isEqual(newState, prevState) ? prevState : newState
    })
  }, [tokenCreation.recipients])

  const removeRecipient = useCallback(
    (idx: number) => {
      tokenCreation.recipients.set((prevState) => {
        const newState = prevState?.filter((_, i) => i !== idx)

        return isEqual(newState, prevState) ? prevState : newState
      })
    },
    [tokenCreation.recipients]
  )

  const pasteRecipient = useCallback(
    async (idx: number) => {
      const address = await readFromClipboard()

      if (
        !address ||
        !isAddress(address) ||
        !tokenCreation.recipients.get[idx] ||
        tokenCreation.recipients.get.find((el) => el.address === address)
      )
        return

      tokenCreation.recipients.set((prevState) => {
        const newState = [...(prevState ? prevState : [])]
        newState[idx].address = address

        return newState
      })
    },
    [tokenCreation.recipients]
  )

  return (
    <>
      <S.StepsRoot {...rest}>
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            title={t("token-creation-step.card-welcome-title")}
          />
          <CardDescription>
            <p>{t("token-creation-step.card-welcome-desc")}</p>
          </CardDescription>
        </Card>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            title={t("token-creation-step.card-base-title")}
          />

          <CardDescription>
            <p>{t("token-creation-step.card-base-desc")}</p>
          </CardDescription>

          <CardFormControl>
            <InputField
              value={tokenCreation.name.get}
              setValue={tokenCreation.name.set}
              label={t("token-creation-step.name-lbl")}
            />
            <InputField
              value={tokenCreation.symbol.get}
              setValue={tokenCreation.symbol.set}
              label={t("token-creation-step.symbol-lbl")}
            />
          </CardFormControl>
        </Card>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            title={t("token-creation-step.card-distribution-title")}
          />

          <CardDescription>
            <p>{t("token-creation-step.card-distribution-desc")}</p>
          </CardDescription>

          <CardFormControl>
            <InputField
              value={tokenCreation.totalSupply.get}
              setValue={(v) => handleTotalSupplyChange(v)}
              label={t("token-creation-step.total-supply-lbl")}
            />
            <Slider
              key={
                tokenCreation.totalSupply.get ||
                tokenCreation.initialDistribution.get
              }
              isShowSliderLine={false}
              name="token-creation-slider"
              hideInput={true}
              initial={Number(tokenCreation.initialDistribution.get)}
              limits={{ min: 0, max: Number(tokenCreation.totalSupply.get) }}
              debounce={false}
              onChange={(n, v) => handleInitialDistributionChange(v)}
            />
            <InputField
              type="number"
              value={tokenCreation.treasury.get}
              setValue={handleTreasuryChange}
              min={0}
              max={Number(tokenCreation.totalSupply.get)}
              label={t("token-creation-step.treasury-lbl")}
            />
            <InputField
              type="number"
              value={tokenCreation.initialDistribution.get}
              setValue={handleInitialDistributionChange}
              min={0}
              max={Number(tokenCreation.totalSupply.get)}
              label={t("token-creation-step.initial-distribution-lbl")}
            />
          </CardFormControl>
        </Card>

        <Collapse isOpen={!!+tokenCreation.initialDistribution.get}>
          <Card>
            <CardHead
              nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
              title={t(
                "token-creation-step.card-distribution-recipients-title"
              )}
            />
            <CardDescription>
              <p>
                {t("token-creation-step.card-distribution-recipients-desc")}
              </p>
            </CardDescription>
            <CardFormControl>
              <InputField
                value={`${shortenAddress(
                  daoCreatorRecipient.address
                )} (DAO creator)`}
                readonly
                nodeRight={
                  <S.TokenCreationInputNodeRight>
                    <S.TokenCreationInputNodeRightInput
                      type="text"
                      value={daoCreatorRecipient.amount}
                      onInput={(e) =>
                        setDaoCreatorRecipient({
                          ...daoCreatorRecipient,
                          amount: e.currentTarget.value,
                        })
                      }
                      placeholder="0"
                    />
                    <S.TokenCreationInputNodeRightSymbol>
                      {tokenCreation.symbol.get}
                    </S.TokenCreationInputNodeRightSymbol>
                  </S.TokenCreationInputNodeRight>
                }
              />
              {tokenCreation?.recipients?.get?.map((el, idx) => (
                <InputField
                  key={idx}
                  value={shortenAddress(el.address)}
                  nodeLeft={
                    el.address ? (
                      <S.TokenCreationRecipientRemoveBtn
                        onClick={() => removeRecipient(idx)}
                      >
                        <Icon name={ICON_NAMES.trash} />
                      </S.TokenCreationRecipientRemoveBtn>
                    ) : (
                      <S.TokenCreationRecipientPasteBtn
                        text="Paste"
                        onClick={async () => pasteRecipient(idx)}
                      />
                    )
                  }
                  nodeRight={
                    el.address ? (
                      <S.TokenCreationInputNodeRight>
                        <S.TokenCreationInputNodeRightInput
                          type="number"
                          value={tokenCreation.recipients.get[idx].amount}
                          placeholder={"0"}
                          onInput={(e) =>
                            handleRecipientAmountChange(
                              e.currentTarget.value,
                              idx
                            )
                          }
                          max={Number(tokenCreation.totalSupply.get)}
                        />
                        <S.TokenCreationInputNodeRightSymbol>
                          {tokenCreation.symbol.get}
                        </S.TokenCreationInputNodeRightSymbol>
                      </S.TokenCreationInputNodeRight>
                    ) : (
                      <></>
                    )
                  }
                  readonly={true}
                />
              ))}
            </CardFormControl>
            <S.CardAddBtn
              color="default"
              text="+ Add Recipient"
              onClick={addRecipient}
            />
          </Card>
        </Collapse>
      </S.StepsRoot>
      <S.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export default TokenCreationStep
