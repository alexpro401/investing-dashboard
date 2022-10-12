import {
  MouseEvent,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useState,
  useCallback,
} from "react"
import { format } from "date-fns"
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

import { accordionSummaryVariants } from "motion/variants"
import { Flex } from "theme"
import { DATE_TIME_FORMAT } from "constants/time"
import { SettingsStyled as S } from "./styled"
import { TraderPoolInvestProposal } from "interfaces/typechain"

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

  timestamp: BigNumber
  maxSizeLP: BigNumber
  fullness: BigNumber
  proposalPool: TraderPoolInvestProposal | null
  proposalId: string
  successCallback: (timestamp: number, maxSize: BigNumber) => void
}

const InvestCardSettings: FC<Props> = ({
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

    if (parseEther(investLPLimit).lt(fullness)) {
      errors.investLPLimit = "Invest limit can't be less than fullness"
      setErrors(errors)

      return true
    }

    return false
  }, [fullness, investLPLimit])

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
          content: `Nothing has been changed. Please change something before submitting.`,
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
          // Update data in card
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
      <S.Head>
        <S.Title>Investment proposal {ticker} settings</S.Title>
      </S.Head>
      <S.Content>
        <S.Row minInputW="148px">
          <Tooltip id="rp-expiration-date">End of invest proposal</Tooltip>
          <S.Label>Expiration date:</S.Label>
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
            <S.Label>LPs available for staking:</S.Label>
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
            <S.InputType> {ticker}</S.InputType>
          </S.Row>
          {errors.investLPLimit !== null && (
            <S.ErrorMessage>{errors.investLPLimit}</S.ErrorMessage>
          )}
        </Flex>
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
      </S.Content>
    </S.Container>
  )
}

export default InvestCardSettings
