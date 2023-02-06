import { FC, HTMLAttributes, useCallback, useContext, useEffect } from "react"
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

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TokenCreationStep: FC<Props> = ({ ...rest }) => {
  const { t } = useTranslation()

  const { tokenCreation } = useContext(GovPoolFormContext)

  const { nextCb } = useContext(stepsControllerContext)

  const handleNextStep = useCallback(() => {
    nextCb()
  }, [nextCb])

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

  const handleTotalSupplyChange = (v: string | number) => {
    tokenCreation.totalSupply.set(String(v))
    tokenCreation.treasury.set(String(v))
    tokenCreation.initialDistribution.set("0")
  }

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

        <Collapse isOpen={!!tokenCreation.initialDistribution.get}>
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
          </Card>
        </Collapse>
      </S.StepsRoot>
      <S.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export default TokenCreationStep
