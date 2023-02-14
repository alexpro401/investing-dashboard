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
import { BigNumber } from "ethers"
import { useEffectOnce } from "react-use"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const safeBigFrom = (value: string | number) => {
  try {
    return BigNumber.from(value)
  } catch (error) {
    return BigNumber.from(0)
  }
}

const TokenCreationStep: FC<Props> = ({ ...rest }) => {
  const { account } = useActiveWeb3React()

  const { t } = useTranslation()

  const { tokenCreation, isTokenCreation } = useContext(GovPoolFormContext)

  const { prevCb, nextCb } = useContext(stepsControllerContext)

  const [treasuryPercent, setTreasuryPercent] = useState(0)
  const [initialDistributionPercent, setInitialDistributionPercent] =
    useState(0)

  useEffectOnce(() => {
    if (Number(tokenCreation.treasury.get)) {
      setTreasuryPercent(
        safeBigFrom(tokenCreation.treasury.get)
          .mul(100)
          .div(safeBigFrom(tokenCreation.totalSupply.get))
          .toNumber()
      )
    }

    if (Number(tokenCreation.initialDistribution.get)) {
      setInitialDistributionPercent(
        safeBigFrom(tokenCreation.initialDistribution.get)
          .mul(100)
          .div(safeBigFrom(tokenCreation.totalSupply.get))
          .toNumber()
      )
    }
  })

  const daoCreatorRecipientAmount = useMemo(() => {
    const daoCreationRecipientsSum = tokenCreation.recipients.get?.reduce(
      (acc, curr) => {
        return acc.add(curr.amount ? safeBigFrom(curr.amount) : safeBigFrom(0))
      },
      safeBigFrom(0)
    )

    return daoCreationRecipientsSum && !daoCreationRecipientsSum.isZero()
      ? safeBigFrom(tokenCreation.initialDistribution.get).sub(
          daoCreationRecipientsSum
        )
      : BigNumber.from(0)
  }, [tokenCreation.initialDistribution.get, tokenCreation.recipients.get])

  const handleNextStep = useCallback(() => {
    if (!isTokenCreation) {
      prevCb()
      return
    }

    const totalRecipientsAmount = tokenCreation.recipients.get
      ?.reduce((acc, curr) => {
        return acc.add(safeBigFrom(curr.amount))
      }, safeBigFrom(0))
      .add(daoCreatorRecipientAmount)

    if (
      totalRecipientsAmount?.gt(
        safeBigFrom(tokenCreation.initialDistribution.get)
      )
    )
      return

    nextCb()
  }, [
    daoCreatorRecipientAmount,
    nextCb,
    tokenCreation.initialDistribution.get,
    tokenCreation.recipients.get,
  ])

  const handleTotalSupplyChange = useCallback(
    (v: string | number) => {
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
    (value: string | number) => {
      try {
        const totalSupply = safeBigFrom(tokenCreation.totalSupply.get)

        const treasuryPercent = safeBigFrom(value)
        const treasury = totalSupply.mul(treasuryPercent).div(100)

        const initialDistributionPercent = safeBigFrom(100).sub(treasuryPercent)
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
      try {
        const totalSupply = safeBigFrom(tokenCreation.totalSupply.get)

        const initialDistributionPercent = safeBigFrom(value)
        const initialDistribution = totalSupply
          .mul(initialDistributionPercent)
          .div(100)

        const treasuryPercent = safeBigFrom(100).sub(initialDistributionPercent)
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
        const totalSupply = safeBigFrom(tokenCreation.totalSupply.get)
        const treasury = safeBigFrom(v)
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
        const totalSupply = safeBigFrom(tokenCreation.totalSupply.get)
        const initialDistribution = safeBigFrom(v)
        const treasury = totalSupply.sub(initialDistribution)

        tokenCreation.initialDistribution.set(String(v))
        setInitialDistributionPercent(
          initialDistribution.mul(100).div(totalSupply).toNumber()
        )

        tokenCreation.treasury.set(treasury.toString())
        setTreasuryPercent(treasury.mul(100).div(totalSupply).toNumber())

        tokenCreation.recipients.set([
          ...tokenCreation.recipients.get.map((el) => ({ ...el, amount: "0" })),
        ])
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
        newState[idx].amount = !daoCreatorRecipientAmount.isZero()
          ? daoCreatorRecipientAmount.div(2).toString()
          : "0"

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
                              ?.add(daoCreatorRecipientAmount)
                              ?.toNumber() || 0
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
