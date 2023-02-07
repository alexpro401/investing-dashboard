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
import { BigNumber } from "ethers"
import { useEffectOnce } from "react-use"

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
  const [treasuryPercent, setTreasuryPercent] = useState(0)
  const [initialDistributionPercent, setInitialDistributionPercent] =
    useState(0)

  useEffectOnce(() => {
    if (tokenCreation.treasury.get) {
      setTreasuryPercent(
        BigNumber.from(tokenCreation.treasury.get)
          .mul(100)
          .div(BigNumber.from(tokenCreation.totalSupply.get))
          .toNumber()
      )
    }

    if (tokenCreation.initialDistribution.get) {
      setInitialDistributionPercent(
        BigNumber.from(tokenCreation.initialDistribution.get)
          .mul(100)
          .div(BigNumber.from(tokenCreation.totalSupply.get))
          .toNumber()
      )
    }

    if (tokenCreation.recipients.get?.length) {
      const daoCreationRecipientsSum = tokenCreation.recipients.get?.reduce(
        (acc, curr) => {
          return acc.add(BigNumber.from(curr.amount))
        },
        BigNumber.from(0)
      )

      setDaoCreatorRecipient({
        ...daoCreatorRecipient,
        amount: BigNumber.from(tokenCreation.totalSupply.get)
          .sub(BigNumber.from(daoCreationRecipientsSum))
          .toString(),
      })
    }
  })

  const handleNextStep = useCallback(() => {
    const totalRecipientsAmount =
      tokenCreation.recipients.get?.reduce((acc, curr) => {
        return acc + +curr.amount
      }, 0) + +daoCreatorRecipient?.amount

    if (totalRecipientsAmount > +tokenCreation.initialDistribution.get) return

    nextCb()
  }, [
    daoCreatorRecipient.amount,
    nextCb,
    tokenCreation.initialDistribution.get,
    tokenCreation.recipients.get,
  ])

  const handleTotalSupplyChange = (v: string | number) => {
    tokenCreation.totalSupply.set(String(v))
    tokenCreation.treasury.set(String(v))
    tokenCreation.initialDistribution.set("0")
  }

  const handleTreasuryPercentChange = useCallback(
    (value: string | number) => {
      try {
        const totalSupply = BigNumber.from(tokenCreation.totalSupply.get)

        const treasuryPercent = BigNumber.from(value)
        const treasury = totalSupply.mul(treasuryPercent).div(100)

        const initialDistributionPercent =
          BigNumber.from(100).sub(treasuryPercent)
        const initialDistribution = totalSupply
          .mul(initialDistributionPercent)
          .div(100)

        setTreasuryPercent(treasuryPercent.toNumber())
        tokenCreation.treasury.set(treasury.toString())

        setInitialDistributionPercent(initialDistributionPercent.toNumber())
        tokenCreation.initialDistribution.set(initialDistribution.toString())
      } catch (error) {}
    },
    [
      tokenCreation.initialDistribution,
      tokenCreation.totalSupply.get,
      tokenCreation.treasury,
    ]
  )
  const handleInitialDistributionPercentChange = useCallback(
    (value: string | number) => {
      console.log("handleInitialDistributionPercentChange", value)
      try {
        const totalSupply = BigNumber.from(tokenCreation.totalSupply.get)

        const initialDistributionPercent = BigNumber.from(value)
        const initialDistribution = totalSupply
          .mul(initialDistributionPercent)
          .div(100)

        const treasuryPercent = BigNumber.from(100).sub(
          initialDistributionPercent
        )
        const treasury = totalSupply.mul(treasuryPercent).div(100)

        setTreasuryPercent(treasuryPercent.toNumber())
        tokenCreation.treasury.set(treasury.toString())

        setInitialDistributionPercent(initialDistributionPercent.toNumber())
        tokenCreation.initialDistribution.set(initialDistribution.toString())
      } catch (error) {}
    },
    [
      tokenCreation.initialDistribution,
      tokenCreation.totalSupply.get,
      tokenCreation.treasury,
    ]
  )

  const handleTreasuryChange = useCallback(
    (v: string | number) => {
      try {
        const totalSupply = BigNumber.from(tokenCreation.totalSupply.get)
        const treasury = BigNumber.from(v)
        const initialDistribution = totalSupply.sub(treasury)

        tokenCreation.treasury.set(String(v))
        setTreasuryPercent(treasury.mul(100).div(totalSupply).toNumber())

        tokenCreation.initialDistribution.set(initialDistribution.toString())
        setInitialDistributionPercent(
          initialDistribution.mul(100).div(totalSupply).toNumber()
        )
      } catch (error) {}
    },
    [
      tokenCreation.initialDistribution,
      tokenCreation.totalSupply.get,
      tokenCreation.treasury,
    ]
  )

  const handleInitialDistributionChange = useCallback(
    (v: string | number) => {
      try {
        const totalSupply = BigNumber.from(tokenCreation.totalSupply.get)
        const initialDistribution = BigNumber.from(v)
        const treasury = totalSupply.sub(initialDistribution)

        tokenCreation.initialDistribution.set(String(v))
        setInitialDistributionPercent(
          initialDistribution.mul(100).div(totalSupply).toNumber()
        )

        tokenCreation.treasury.set(treasury.toString())
        setTreasuryPercent(treasury.mul(100).div(totalSupply).toNumber())
      } catch (error) {}
    },
    [
      tokenCreation.initialDistribution,
      tokenCreation.totalSupply.get,
      tokenCreation.treasury,
    ]
  )

  // Recipients

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
              value={treasuryPercent}
              setValue={handleTreasuryPercentChange}
              min={0}
              max={100}
              label={t("token-creation-step.treasury-lbl")}
              nodeLeft={
                <S.TokenCreationInputNodeRightSymbol>
                  %
                </S.TokenCreationInputNodeRightSymbol>
              }
              nodeRight={
                <S.TokenCreationInputNodeRight>
                  <S.TokenCreationInputNodeRightInput
                    type="number"
                    value={tokenCreation.treasury.get}
                    onInput={(e) => handleTreasuryChange(e.currentTarget.value)}
                    min={0}
                    max={Number(tokenCreation.totalSupply.get)}
                    placeholder="0"
                  />
                  <S.TokenCreationInputNodeRightSymbol>
                    {tokenCreation.symbol.get}
                  </S.TokenCreationInputNodeRightSymbol>
                </S.TokenCreationInputNodeRight>
              }
            />
            <InputField
              type="number"
              value={initialDistributionPercent}
              setValue={handleInitialDistributionPercentChange}
              min={0}
              max={100}
              label={t("token-creation-step.initial-distribution-lbl")}
              nodeLeft={
                <S.TokenCreationInputNodeRightSymbol>
                  %
                </S.TokenCreationInputNodeRightSymbol>
              }
              nodeRight={
                <S.TokenCreationInputNodeRight>
                  <S.TokenCreationInputNodeRightInput
                    type="number"
                    value={tokenCreation.initialDistribution.get}
                    onInput={(e) =>
                      handleInitialDistributionChange(e.currentTarget.value)
                    }
                    min={0}
                    max={Number(tokenCreation.totalSupply.get)}
                    placeholder="0"
                  />
                  <S.TokenCreationInputNodeRightSymbol>
                    {tokenCreation.symbol.get}
                  </S.TokenCreationInputNodeRightSymbol>
                </S.TokenCreationInputNodeRight>
              }
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
