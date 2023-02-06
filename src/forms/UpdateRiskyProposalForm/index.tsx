import {
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { format } from "date-fns"
import { BigNumber } from "@ethersproject/bignumber"
import { parseEther, parseUnits } from "@ethersproject/units"

import { useAddToast } from "state/application/hooks"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { expandTimestamp, isTxMined, normalizeBigNumber } from "utils"

import DatePicker from "components/DatePicker"
import { AppButton } from "common"

import { Flex } from "theme"
import { accordionSummaryVariants } from "motion/variants"
import { DATE_TIME_FORMAT } from "consts/time"
import * as S from "./styled"
import { useUserAgreement } from "state/user/hooks"
import { TraderPoolRiskyProposal } from "interfaces/typechain"

import { InputField } from "fields"
import { ICON_NAMES } from "consts"
import { useTranslation } from "react-i18next"
import { usePrevious } from "react-use"
import { isEqual } from "lodash"

interface Props {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>
  fullness: BigNumber
  currentPrice: BigNumber
  proposalContract: TraderPoolRiskyProposal | null
  proposalId: number
  proposalSymbol?: string
  poolAddress: string
  defaultState: {
    timestamp: BigNumber
    maxSizeLP: BigNumber
    maxInvestPrice: BigNumber
  }
  successCallback: (
    timestamp: number,
    maxSize: BigNumber,
    maxInvest: BigNumber
  ) => void
}

interface IErrorsState {
  investLPLimit: string
  maxTokenPriceLimit: string
}
const errorsDefaultState: IErrorsState = {
  investLPLimit: "",
  maxTokenPriceLimit: "",
}

const UpdateRiskyProposalForm: FC<Props> = (props) => {
  const {
    visible,
    setVisible,
    defaultState,
    fullness,
    currentPrice,
    proposalContract,
    proposalId,
    poolAddress,
    successCallback,
  } = props

  const _prevDefaultState = usePrevious(defaultState)
  const _defaultState = useMemo(() => defaultState, [defaultState])

  const addTransaction = useTransactionAdder()
  const addToast = useAddToast()
  const { t } = useTranslation()

  const [isDateOpen, setDateOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<IErrorsState>(errorsDefaultState)
  const [isSubmiting, setSubmiting] = useState<boolean>(false)

  const [timestampLimit, setTimestampLimit] = useState(
    Number(_defaultState.timestamp.toString())
  )
  const [investLPLimit, setInvestLPLimit] = useState(
    normalizeBigNumber(_defaultState.maxSizeLP, 18, 6)
  )
  const [maxTokenPriceLimit, setMaxTokenPriceLimit] = useState(
    normalizeBigNumber(_defaultState.maxInvestPrice, 18, 2)
  )
  useEffect(() => {
    if (isEqual(_defaultState, _prevDefaultState)) {
      return
    } else {
      const { timestamp, maxSizeLP, maxInvestPrice } = _defaultState
      setTimestampLimit(Number(timestamp.toString()))
      setInvestLPLimit(normalizeBigNumber(maxSizeLP, 18, 6))
      setMaxTokenPriceLimit(normalizeBigNumber(maxInvestPrice, 18, 2))
    }
  }, [_defaultState, _prevDefaultState])

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const onCancel = () => {
    setVisible(false)
    setSubmiting(false)
    setErrors(errorsDefaultState)
  }

  const validate = useCallback((): boolean => {
    const errors = {} as IErrorsState

    if (parseEther(investLPLimit).lt(fullness)) {
      errors.investLPLimit = t(
        "validations.field-error_maxSizeLessThanFullness"
      )
    }
    if (parseEther(maxTokenPriceLimit).lt(currentPrice)) {
      errors.maxTokenPriceLimit = t(
        "validations.field-error_tokenPriceThanCurrentPrice"
      )
    }

    if (errors.investLPLimit || errors.maxTokenPriceLimit) {
      setErrors(errors)

      return true
    }

    return false
  }, [t, currentPrice, fullness, investLPLimit, maxTokenPriceLimit])

  const handleSubmit = async (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault()
    if (!proposalContract) return
    if (!agreed) {
      setShowAgreement(true)
      return
    }

    if (
      isEqual(_defaultState, {
        timestamp: timestampLimit,
        maxSizeLP: parseUnits(investLPLimit, 18),
        maxInvestPrice: parseUnits(maxTokenPriceLimit, 18),
      })
    ) {
      addToast(
        {
          type: "warning",
          content: t("notifications.without-changes"),
        },
        "revert-change-risky-proposal",
        2000
      )
      return
    }

    setSubmiting(true)
    setErrors(errorsDefaultState)
    const hasError = validate()

    if (!hasError) {
      try {
        const proposalLimits = {
          timestampLimit,
          investLPLimit: parseUnits(investLPLimit, 18).toHexString(),
          maxTokenPriceLimit: parseUnits(maxTokenPriceLimit, 18).toHexString(),
        }

        const receipt = await proposalContract.changeProposalRestrictions(
          proposalId,
          proposalLimits
        )

        const tx = await addTransaction(receipt, {
          type: TransactionType.RISKY_PROPOSAL_EDIT,
          pool: poolAddress,
          proposalId,
        })

        if (isTxMined(tx)) {
          successCallback(
            timestampLimit,
            parseUnits(investLPLimit, 18),
            parseUnits(maxTokenPriceLimit, 18)
          )
          onCancel()
        }
      } catch (error) {
        console.error(error)
      }
    }

    setSubmiting(false)
  }

  return (
    <>
      <S.Container
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
        exit="hidden"
        variants={accordionSummaryVariants}
      >
        <S.Header>
          <Flex full ai={"center"} jc={"space-between"}>
            <S.HeaderTitle>{t("risky-proposal-edit-form.title")}</S.HeaderTitle>
            <S.HeaderCloseButton
              color={"secondary"}
              size={"x-small"}
              iconRight={ICON_NAMES.close}
              onClick={onCancel}
            />
          </Flex>
        </S.Header>
        <S.Body>
          <InputField
            value={format(expandTimestamp(timestampLimit), DATE_TIME_FORMAT)}
            onChange={() => {}}
            onClick={() => setDateOpen(!isDateOpen)}
            label={t("risky-proposal-edit-form.field-label-expiration-date")}
          />
          <InputField
            placeholder="---"
            value={investLPLimit}
            label={t("risky-proposal-edit-form.field-label-invest-limit")}
            setValue={(v) => setInvestLPLimit(v)}
            errorMessage={errors.investLPLimit}
          />
          <InputField
            placeholder="---"
            value={maxTokenPriceLimit}
            label={t("risky-proposal-edit-form.field-label-max-invest-price")}
            setValue={(v) => setMaxTokenPriceLimit(v)}
            errorMessage={errors.maxTokenPriceLimit}
          />
          <S.ButtonGroup>
            <AppButton
              full
              color="secondary"
              type="button"
              size="small"
              text={t("risky-proposal-edit-form.action-decline")}
              onClick={onCancel}
            />
            <AppButton
              full
              color="tertiary"
              type="button"
              size="small"
              text={t("risky-proposal-edit-form.action-submit")}
              onClick={() => handleSubmit()}
              disabled={isSubmiting}
            />
          </S.ButtonGroup>
        </S.Body>
        <DatePicker
          isOpen={isDateOpen}
          timestamp={expandTimestamp(timestampLimit)}
          toggle={() => setDateOpen(false)}
          onChange={(t) => setTimestampLimit(t)}
          minDate={new Date()}
        />
      </S.Container>
    </>
  )
}

export default UpdateRiskyProposalForm
