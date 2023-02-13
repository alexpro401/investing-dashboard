import {
  MouseEvent,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
  useCallback,
  useEffect,
} from "react"
import { format } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"
import { parseUnits } from "@ethersproject/units"

import { useAddToast } from "state/application/hooks"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { expandTimestamp, isTxMined, normalizeBigNumber } from "utils"

import DatePicker from "components/DatePicker"
import { AppButton } from "common"

import { accordionSummaryVariants } from "motion/variants"
import { Flex } from "theme"
import * as S from "./styled"
import { TraderPoolInvestProposal } from "interfaces/typechain"
import { DATE_TIME_FORMAT, ICON_NAMES } from "consts"
import { InputField } from "fields"
import { useTranslation } from "react-i18next"

interface Values {
  timestampLimit: number
  investLPLimit: string
}

interface Handlers {
  setTimestampLimit: Dispatch<SetStateAction<number>>
  setInvestLPLimit: Dispatch<SetStateAction<string>>
}

const useUpdateInvestProposal = ({
  timestamp,
  maxSizeLP,
}): [Values, Handlers] => {
  const [timestampLimit, setTimestampLimit] = useState<number>(
    timestamp.toString()
  )
  const [investLPLimit, setInvestLPLimit] = useState<string>(
    normalizeBigNumber(maxSizeLP, 18, 6)
  )

  useEffect(() => {
    setTimestampLimit(timestamp.toString())
    setInvestLPLimit(normalizeBigNumber(maxSizeLP, 18, 6))
  }, [timestamp, maxSizeLP])

  return [
    { timestampLimit, investLPLimit },
    { setTimestampLimit, setInvestLPLimit },
  ]
}

interface IErrorsState {
  investLPLimit: ReactNode
}
const errorsDefaultState: IErrorsState = {
  investLPLimit: null,
}

interface Props {
  ticker: string
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>

  timestamp: string
  maxSizeLP: BigNumber
  fullness: BigNumber
  proposalPool: TraderPoolInvestProposal | null
  proposalId: number
  successCallback: (timestamp: number, maxSize: BigNumber) => void
}

const UpdateInvestProposalForm: FC<Props> = ({
  ticker,
  visible,
  setVisible,
  timestamp,
  maxSizeLP,
  fullness,
  proposalPool,
  proposalId,
  successCallback,
}) => {
  const addTransaction = useTransactionAdder()
  const addToast = useAddToast()
  const { t } = useTranslation()

  const [isDateOpen, setDateOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<IErrorsState>(errorsDefaultState)
  const [isSubmiting, setSubmiting] = useState<boolean>(false)

  const [
    { timestampLimit, investLPLimit },
    { setTimestampLimit, setInvestLPLimit },
  ] = useUpdateInvestProposal({ timestamp, maxSizeLP })

  const onCancel = (): void => {
    setVisible(false)
    setSubmiting(false)
    setErrors(errorsDefaultState)
  }

  const validate = useCallback((): boolean => {
    const errors = {} as IErrorsState

    if (parseUnits(investLPLimit, 18).gt(fullness)) {
      errors.investLPLimit = t(
        "validations.field-error_investLimitLessThanFullness"
      )
      setErrors(errors)

      return true
    }

    return false
  }, [t, fullness, investLPLimit])

  const isValuesChanged = (_timestamp, _investLPLimit): boolean => {
    if (_timestamp === timestamp && _investLPLimit.eq(maxSizeLP)) {
      return false
    }
    return true
  }

  const handleSubmit = async (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.stopPropagation()
    }

    if (!proposalPool) {
      return
    }

    if (!isValuesChanged(timestampLimit, parseUnits(investLPLimit, 18))) {
      addToast(
        {
          type: "warning",
          content: t("notifications.without-changes"),
        },
        "revert-change-invest-proposal",
        2000
      )
      return
    }

    setSubmiting(true)
    setErrors(errorsDefaultState)
    const hasError = validate()

    if (!hasError) {
      try {
        const limitHex = parseUnits(investLPLimit, 18).toHexString()
        const proposalLimits = { timestampLimit, investLPLimit: limitHex }

        const receipt = await proposalPool.changeProposalRestrictions(
          proposalId,
          proposalLimits
        )

        const tx = await addTransaction(receipt, {
          type: TransactionType.INVEST_PROPOSAL_EDIT,
          investLpAmountRaw: limitHex,
        })

        if (isTxMined(tx)) {
          // Update data in card
          successCallback(timestampLimit, parseUnits(investLPLimit, 18))
          onCancel()
        }
      } catch (error) {
        console.error(error)
      }
    }

    setSubmiting(false)
  }

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>): void => {
    if (e) e.preventDefault()
    onCancel()
  }

  return (
    <S.Container
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit="hidden"
      variants={accordionSummaryVariants}
      onClick={(e) => e.stopPropagation()}
    >
      <S.Header>
        <Flex full ai={"center"} jc={"space-between"}>
          <S.HeaderTitle>
            {t("update-invest-proposal-form.title", { ticker })}
          </S.HeaderTitle>
          <S.HeaderCloseButton
            color={"secondary"}
            size={"x-small"}
            iconRight={ICON_NAMES.close}
            onClick={() => handleCancel()}
          />
        </Flex>
      </S.Header>

      <S.Content>
        <InputField
          value={format(expandTimestamp(timestampLimit), DATE_TIME_FORMAT)}
          onChange={() => {}}
          onClick={() => setDateOpen(!isDateOpen)}
          label={t("update-invest-proposal-form.field-label-expiration-date")}
        />

        <InputField
          placeholder="---"
          value={investLPLimit}
          label={t("update-invest-proposal-form.field-label-invest-limit")}
          setValue={(v) => setInvestLPLimit(v)}
          errorMessage={
            errors.investLPLimit !== null
              ? String(errors.investLPLimit)
              : undefined
          }
        />
        <S.ButtonGroup>
          <AppButton
            full
            color="secondary"
            type="button"
            size="small"
            text={t("update-invest-proposal-form.action-decline")}
            onClick={() => handleCancel()}
          />
          <AppButton
            full
            color="tertiary"
            type="button"
            size="small"
            text={t("update-invest-proposal-form.action-submit")}
            onClick={() => handleSubmit()}
            disabled={isSubmiting}
          />
        </S.ButtonGroup>
      </S.Content>
      <DatePicker
        isOpen={isDateOpen}
        timestamp={expandTimestamp(timestampLimit)}
        toggle={() => setDateOpen(false)}
        onChange={setTimestampLimit}
        minDate={new Date()}
      />
    </S.Container>
  )
}

export default UpdateInvestProposalForm
