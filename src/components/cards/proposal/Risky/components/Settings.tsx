import {
  Dispatch,
  FC,
  MouseEvent,
  ReactNode,
  SetStateAction,
  useCallback,
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
import * as S from "./styled-settings"
import { useUserAgreement } from "state/user/hooks"
import { TraderPoolRiskyProposal } from "interfaces/typechain"

import { InputField } from "fields"
import { ICON_NAMES } from "consts"

interface Values {
  timestampLimit: number
  investLPLimit: string
  maxTokenPriceLimit: string
}

interface Handlers {
  setTimestampLimit: Dispatch<SetStateAction<number>>
  setInvestLPLimit: Dispatch<SetStateAction<string>>
  setMaxTokenPriceLimit: Dispatch<SetStateAction<string>>
}

const useUpdateRiskyProposal = ({
  timestamp,
  maxSizeLP,
  maxInvestPrice,
}): [Values, Handlers] => {
  const [timestampLimit, setTimestampLimit] = useState<number>(
    timestamp.toString()
  )

  const [investLPLimit, setInvestLPLimit] = useState<string>(
    normalizeBigNumber(maxSizeLP, 18, 6)
  )
  const [maxTokenPriceLimit, setMaxTokenPriceLimit] = useState<string>(
    normalizeBigNumber(maxInvestPrice, 18, 2)
  )

  return [
    { timestampLimit, investLPLimit, maxTokenPriceLimit },
    { setTimestampLimit, setInvestLPLimit, setMaxTokenPriceLimit },
  ]
}

interface Props {
  visible: boolean
  setVisible: Dispatch<SetStateAction<boolean>>

  timestamp: BigNumber
  maxSizeLP: BigNumber
  maxInvestPrice: BigNumber
  fullness: BigNumber
  currentPrice: BigNumber
  proposalPool: TraderPoolRiskyProposal
  proposalId: number
  proposalSymbol?: string
  poolAddress: string
  successCallback: (
    timestamp: number,
    maxSize: BigNumber,
    maxInvest: BigNumber
  ) => void
}

interface IErrorsState {
  investLPLimit: ReactNode
  maxTokenPriceLimit: ReactNode
}
const errorsDefaultState: IErrorsState = {
  investLPLimit: null,
  maxTokenPriceLimit: null,
}

const RiskyCardSettings: FC<Props> = ({
  visible,
  setVisible,
  timestamp,
  maxSizeLP,
  maxInvestPrice,
  fullness,
  currentPrice,
  proposalPool,
  proposalId,
  poolAddress,
  successCallback,
}) => {
  const addTransaction = useTransactionAdder()
  const addToast = useAddToast()

  const [isDateOpen, setDateOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<IErrorsState>(errorsDefaultState)
  const [isSubmiting, setSubmiting] = useState<boolean>(false)

  const [
    { timestampLimit, investLPLimit, maxTokenPriceLimit },
    { setTimestampLimit, setInvestLPLimit, setMaxTokenPriceLimit },
  ] = useUpdateRiskyProposal({
    timestamp,
    maxSizeLP,
    maxInvestPrice,
  })

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const onCancel = (): void => {
    setVisible(false)
    setSubmiting(false)
    setErrors(errorsDefaultState)
  }

  const validate = useCallback((): boolean => {
    const errors = {} as IErrorsState

    if (parseEther(investLPLimit).lt(fullness)) {
      errors.investLPLimit = "Max size can't be less than fullness"
    }
    if (parseEther(maxTokenPriceLimit).lt(currentPrice)) {
      errors.maxTokenPriceLimit =
        "Max token price can't be less than current price"
    }

    if (errors.investLPLimit || errors.maxTokenPriceLimit) {
      setErrors(errors)

      return true
    }

    return false
  }, [currentPrice, fullness, investLPLimit, maxTokenPriceLimit])

  const isValuesChanged = (
    _timestamp,
    _investLPLimit,
    _maxTokenPriceLimit
  ): boolean => {
    if (
      _timestamp === timestamp &&
      _investLPLimit.eq(maxSizeLP) &&
      _maxTokenPriceLimit.eq(maxInvestPrice)
    ) {
      return false
    }
    return true
  }

  const handleSubmit = async (e?: MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault()
    if (!proposalPool) return
    if (!agreed) {
      setShowAgreement(true)
      return
    }

    if (
      !isValuesChanged(
        timestampLimit,
        parseUnits(investLPLimit, 18),
        parseUnits(maxTokenPriceLimit, 18)
      )
    ) {
      addToast(
        {
          type: "warning",
          content: `Nothing has been changed. Please change something before submitting.`,
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

        const receipt = await proposalPool.changeProposalRestrictions(
          proposalId,
          proposalLimits
        )

        const tx = await addTransaction(receipt, {
          type: TransactionType.RISKY_PROPOSAL_EDIT,
          pool: poolAddress,
          proposalId,
        })

        if (isTxMined(tx)) {
          // Update data in card
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

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>): void => {
    if (e) e.preventDefault()
    onCancel()
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
            <S.HeaderTitle>Investment proposal settings:</S.HeaderTitle>
            <S.HeaderCloseButton
              color={"secondary"}
              size={"x-small"}
              iconRight={ICON_NAMES.close}
              onClick={() => handleCancel()}
            />
          </Flex>
        </S.Header>
        <S.Body>
          <InputField
            value={format(expandTimestamp(timestampLimit), DATE_TIME_FORMAT)}
            onChange={() => {}}
            onClick={() => setDateOpen(!isDateOpen)}
            label="Expiration date"
          />
          <InputField
            placeholder="---"
            value={investLPLimit}
            label="LPs available for staking"
            setValue={(v) => setInvestLPLimit(v)}
            errorMessage={
              errors.investLPLimit !== null
                ? String(errors.investLPLimit)
                : undefined
            }
          />
          <InputField
            placeholder="---"
            value={maxTokenPriceLimit}
            label="Maximum invest price"
            setValue={(v) => setMaxTokenPriceLimit(v)}
            errorMessage={
              errors.maxTokenPriceLimit !== null
                ? String(errors.maxTokenPriceLimit)
                : undefined
            }
          />
          <S.ButtonGroup>
            <AppButton
              full
              color="secondary"
              type="button"
              size="small"
              text="Cancel"
              onClick={() => handleCancel()}
            />
            <AppButton
              full
              color="tertiary"
              type="button"
              size="small"
              text="Done"
              onClick={() => handleSubmit()}
              disabled={isSubmiting}
            />
          </S.ButtonGroup>
        </S.Body>
        <DatePicker
          isOpen={isDateOpen}
          timestamp={expandTimestamp(timestampLimit)}
          toggle={() => setDateOpen(false)}
          onChange={setTimestampLimit}
          minDate={new Date()}
        />
      </S.Container>
    </>
  )
}

export default RiskyCardSettings
