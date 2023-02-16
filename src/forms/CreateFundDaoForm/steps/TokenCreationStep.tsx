import {
  FC,
  HTMLAttributes,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
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
import { readFromClipboard } from "utils/clipboard"
import { useEffectOnce } from "react-use"
import { FixedNumber } from "@ethersproject/bignumber"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const safeBigFrom = (value: string | number) => {
  try {
    return FixedNumber.from(value)
  } catch (error) {
    return FixedNumber.from(0)
  }
}

const TokenCreationStep: FC<Props> = ({ ...rest }) => {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const { tokenCreation, isTokenCreation } = useContext(GovPoolFormContext)

  const { prevCb, nextCb } = useContext(stepsControllerContext)

  const [treasuryPercent, setTreasuryPercent] = useState("")
  const [initialDistributionPercent, setInitialDistributionPercent] =
    useState("")

  useEffectOnce(() => {
    if (Number(tokenCreation.treasury.get)) {
      setTreasuryPercent(
        safeBigFrom(tokenCreation.treasury.get)
          .mulUnsafe(safeBigFrom(100))
          .divUnsafe(safeBigFrom(tokenCreation.totalSupply.get))
          .toString()
      )
    }

    if (Number(tokenCreation.initialDistribution.get)) {
      setInitialDistributionPercent(
        safeBigFrom(tokenCreation.initialDistribution.get)
          .mulUnsafe(safeBigFrom(100))
          .divUnsafe(safeBigFrom(tokenCreation.totalSupply.get))
          .toString()
      )
    }
  })

  const daoCreatorRecipientAmount = useMemo(() => {
    const daoCreationRecipientsSum = tokenCreation.recipients.get?.reduce(
      (acc, curr) => {
        return acc.addUnsafe(safeBigFrom(curr.amount))
      },
      safeBigFrom("0")
    )

    return daoCreationRecipientsSum && !daoCreationRecipientsSum.isZero()
      ? safeBigFrom(tokenCreation.initialDistribution.get).subUnsafe(
          daoCreationRecipientsSum
        )
      : safeBigFrom(tokenCreation.initialDistribution.get)
  }, [tokenCreation.initialDistribution.get, tokenCreation.recipients.get])

  const handleNextStep = useCallback(() => {
    if (!isTokenCreation) {
      prevCb()
      return
    }

    const totalRecipientsAmount = tokenCreation.recipients.get
      ?.reduce((acc, curr) => {
        return acc.addUnsafe(safeBigFrom(curr.amount))
      }, safeBigFrom("0"))
      .addUnsafe(daoCreatorRecipientAmount)

    if (
      !totalRecipientsAmount
        ?.subUnsafe(safeBigFrom(tokenCreation.initialDistribution.get))
        .isNegative()
    )
      return

    nextCb()
  }, [
    daoCreatorRecipientAmount,
    isTokenCreation,
    nextCb,
    prevCb,
    tokenCreation.initialDistribution.get,
    tokenCreation.recipients.get,
  ])

  const handleTotalSupplyChange = useCallback(
    (v: string) => {
      tokenCreation.totalSupply.set(String(v))
      tokenCreation.treasury.set(String(v))
      tokenCreation.initialDistribution.set("0")
    },
    [
      tokenCreation.initialDistribution,
      tokenCreation.totalSupply,
      tokenCreation.treasury,
    ]
  )

  const handleTreasuryPercentChange = useCallback(
    (value: string) => {
      try {
        const totalSupply = safeBigFrom(tokenCreation.totalSupply.get)

        const treasuryPercent = safeBigFrom(value)
        const treasury = totalSupply
          .mulUnsafe(treasuryPercent)
          .divUnsafe(safeBigFrom(100))

        const initialDistributionPercent =
          safeBigFrom("100").subUnsafe(treasuryPercent)
        const initialDistribution = totalSupply
          .mulUnsafe(initialDistributionPercent)
          .divUnsafe(safeBigFrom(100))

        setTreasuryPercent(treasuryPercent.toString())
        tokenCreation.treasury.set(treasury.toString())

        setInitialDistributionPercent(initialDistributionPercent.toString())
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
    (value: string) => {
      try {
        const totalSupply = safeBigFrom(tokenCreation.totalSupply.get)

        const initialDistributionPercent = safeBigFrom(value)
        const initialDistribution = totalSupply
          .mulUnsafe(initialDistributionPercent)
          .divUnsafe(safeBigFrom(100))

        const treasuryPercent = safeBigFrom("100").subUnsafe(
          initialDistributionPercent
        )
        const treasury = totalSupply
          .mulUnsafe(treasuryPercent)
          .divUnsafe(safeBigFrom(100))

        setTreasuryPercent(treasuryPercent.toString())
        tokenCreation.treasury.set(treasury.toString())

        setInitialDistributionPercent(initialDistributionPercent.toString())
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
    (v: string) => {
      try {
        const totalSupply = safeBigFrom(tokenCreation.totalSupply.get)
        const treasury = safeBigFrom(v)
        const initialDistribution = totalSupply.subUnsafe(treasury)

        tokenCreation.treasury.set(String(v))
        setTreasuryPercent(
          treasury.mulUnsafe(safeBigFrom(100)).divUnsafe(totalSupply).toString()
        )

        tokenCreation.initialDistribution.set(initialDistribution.toString())
        setInitialDistributionPercent(
          initialDistribution
            .mulUnsafe(safeBigFrom(100))
            .divUnsafe(totalSupply)
            .toString()
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
    (v: string) => {
      try {
        const totalSupply = safeBigFrom(tokenCreation.totalSupply.get)
        const initialDistribution = safeBigFrom(v)
        const treasury = totalSupply.subUnsafe(initialDistribution)

        tokenCreation.initialDistribution.set(v)

        setInitialDistributionPercent(
          initialDistribution
            .mulUnsafe(safeBigFrom(100))
            .divUnsafe(totalSupply)
            .toString()
        )

        tokenCreation.treasury.set(treasury.toString())
        setTreasuryPercent(
          treasury.mulUnsafe(safeBigFrom(100)).divUnsafe(totalSupply).toString()
        )

        tokenCreation.recipients.set([
          ...tokenCreation.recipients.get.map((el) => ({ ...el, amount: "0" })),
        ])
      } catch (error) {}
    },
    [
      tokenCreation.initialDistribution,
      tokenCreation.recipients,
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
        newState[idx].amount = !daoCreatorRecipientAmount.isZero()
          ? daoCreatorRecipientAmount.divUnsafe(safeBigFrom(2)).toString()
          : "0"

        return newState
      })
    },
    [daoCreatorRecipientAmount, tokenCreation.recipients]
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
              onChange={(n, v) =>
                handleInitialDistributionChange(safeBigFrom(v).toString())
              }
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
                value={`${shortenAddress(account)} (DAO creator)`}
                readonly
                nodeRight={
                  <S.TokenCreationInputNodeRight>
                    <S.TokenCreationInputNodeRightInput
                      type="text"
                      value={daoCreatorRecipientAmount?.toString()}
                      readonly
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
                          min={0}
                          max={
                            safeBigFrom(
                              tokenCreation.recipients.get[idx].amount || 0
                            )
                              ?.addUnsafe(daoCreatorRecipientAmount)
                              ?.toUnsafeFloat() || 0
                          }
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
