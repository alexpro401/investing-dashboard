import { useMemo } from "react"
import { format } from "date-fns/esm"

import { TransactionInfo } from "state/transactions/types"

import {
  TransactionWaitContainer,
  TransactionWaitContent,
  TransactionWaitProgress,
} from "./styled"

interface IProps {
  info: TransactionInfo
  addedTime: number
}

const TransactionWait: React.FC<IProps> = ({ addedTime }) => {
  const time = useMemo(() => {
    if (!addedTime) return null
    return String(format(addedTime, "HH:mm aaaaa'm'")).toUpperCase()
  }, [addedTime])

  return (
    <TransactionWaitContainer>
      <TransactionWaitContent>
        {time} - <TransactionWaitProgress /> 1 min
      </TransactionWaitContent>
    </TransactionWaitContainer>
  )
}

export default TransactionWait
