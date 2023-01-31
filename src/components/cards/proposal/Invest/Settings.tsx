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
import { parseEther, parseUnits } from "@ethersproject/units"

import { useAddToast } from "state/application/hooks"
import { TransactionType } from "state/transactions/types"
import { useTransactionAdder } from "state/transactions/hooks"
import { expandTimestamp, isTxMined, normalizeBigNumber } from "utils"

import DatePicker from "components/DatePicker"
import { AppButton } from "common"

import { accordionSummaryVariants } from "motion/variants"
import { Flex } from "theme"
import { DATE_TIME_FORMAT } from "consts/time"
import * as S from "./styled-settings"
import { TraderPoolInvestProposal } from "interfaces/typechain"
import { ICON_NAMES } from "consts"
import { InputField } from "fields"

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
          <S.HeaderTitle>Investment proposal {ticker} settings:</S.HeaderTitle>
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

export default InvestCardSettings
