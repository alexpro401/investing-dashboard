import {
  FC,
  useState,
  Dispatch,
  ReactNode,
  MouseEvent,
  useCallback,
  SetStateAction,
} from "react"
import { format } from "date-fns"
import { Contract } from "@ethersproject/contracts"
import { BigNumber } from "@ethersproject/bignumber"
import { parseEther, parseUnits } from "@ethersproject/units"

import { useAddToast } from "state/application/hooks"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { expandTimestamp, isTxMined, normalizeBigNumber } from "utils"

import Input from "components/Input"
import Tooltip from "components/Tooltip"
import DatePicker from "components/DatePicker"
import Button, { SecondaryButton } from "components/Button"

import { Flex } from "theme"
import { accordionSummaryVariants } from "motion/variants"
import { DATE_TIME_FORMAT } from "constants/time"
import { SettingsStyled as S } from "./styled"

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
  proposalPool: Contract
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
  proposalSymbol,
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

    if (!proposalPool) {
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
        const proposalLimits = [
          timestampLimit,
          parseUnits(investLPLimit, 18).toHexString(),
          parseUnits(maxTokenPriceLimit, 18).toHexString(),
        ]

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
    <S.Container
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit="hidden"
      variants={accordionSummaryVariants}
    >
      <div>
        <S.Row minInputW="148px">
          <Tooltip id="rp-expiration-date">End of risky proposal</Tooltip>
          <S.Title>Expiration date:</S.Title>
          <div>
            <Input
              disabled
              theme="grey"
              size="small"
              value={format(expandTimestamp(timestampLimit), DATE_TIME_FORMAT)}
              placeholder={format(
                expandTimestamp(timestampLimit),
                DATE_TIME_FORMAT
              )}
              onClick={() => setDateOpen(!isDateOpen)}
            />
            <DatePicker
              isOpen={isDateOpen}
              timestamp={expandTimestamp(timestampLimit)}
              toggle={() => setDateOpen(false)}
              onChange={setTimestampLimit}
              minDate={new Date()}
            />
          </div>
          <S.InputType>GMT</S.InputType>
        </S.Row>
        <Flex full dir="column" m="12px 0">
          <S.Row minInputW="79px">
            <Tooltip id="rp-available-staking">Staking</Tooltip>
            <S.Title>LPs available for staking</S.Title>
            <Input
              theme="grey"
              size="small"
              type="number"
              inputmode="decimal"
              value={investLPLimit}
              placeholder="---"
              onChange={(v) => setInvestLPLimit(v)}
              error={errors.investLPLimit !== null}
            />
            <S.InputType>LP</S.InputType>
          </S.Row>
          {errors.investLPLimit !== null && (
            <S.ErrorMessage>{errors.investLPLimit}</S.ErrorMessage>
          )}
        </Flex>
        <Flex full dir="column" m="12px 0">
          <S.Row>
            <Tooltip id="rp-max-invest">Maximum invest price</Tooltip>
            <S.Title>Maximum invest price</S.Title>
            <Input
              theme="grey"
              size="small"
              type="number"
              inputmode="decimal"
              value={maxTokenPriceLimit}
              placeholder="---"
              onChange={(v) => setMaxTokenPriceLimit(v)}
              error={errors.maxTokenPriceLimit !== null}
            />
            <S.InputType>{proposalSymbol}</S.InputType>
          </S.Row>
          {errors.maxTokenPriceLimit !== null && (
            <S.ErrorMessage>{errors.maxTokenPriceLimit}</S.ErrorMessage>
          )}
        </Flex>
      </div>
      <S.ButtonGroup>
        <SecondaryButton full size="small" onClick={handleCancel}>
          Сancel
        </SecondaryButton>
        {isSubmiting ? (
          <SecondaryButton full size="small">
            Apply changes
          </SecondaryButton>
        ) : (
          <Button full size="small" onClick={handleSubmit}>
            Apply changes
          </Button>
        )}
      </S.ButtonGroup>
    </S.Container>
  )
}

export default RiskyCardSettings
