import { FC, HTMLAttributes, useCallback, useContext } from "react"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import { Card, CardDescription, CardFormControl, CardHead, Icon } from "common"
import { InputField, TextareaField } from "fields"

import { ICON_NAMES } from "consts"
import { useTranslation } from "react-i18next"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const TokenCreationStep: FC<Props> = ({ ...rest }) => {
  const { t } = useTranslation()

  const daoPoolFormContext = useContext(GovPoolFormContext)

  const { nextCb } = useContext(stepsControllerContext)

  const handleNextStep = useCallback(() => {
    nextCb()
  }, [nextCb])

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
            <InputField value={""} label={t("token-creation-step.name-lbl")} />
            <InputField
              value={""}
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
              value={""}
              label={t("token-creation-step.total-supply-lbl")}
            />
            <InputField
              value={""}
              label={t("token-creation-step.treasury-lbl")}
            />
            <InputField
              value={""}
              label={t("token-creation-step.initial-distribution-lbl")}
            />
          </CardFormControl>
        </Card>

        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.fileDock} />}
            title={t("token-creation-step.card-distribution-recipients-title")}
          />
          <CardDescription>
            <p>{t("token-creation-step.card-distribution-recipients-desc")}</p>
          </CardDescription>
        </Card>
      </S.StepsRoot>
      <S.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export default TokenCreationStep
