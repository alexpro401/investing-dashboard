import Confirm from "components/Confirm"
import { FC } from "react"

import Button from "components/Button"

import warn from "assets/icons/warn-big.svg"

import { Icon, Text } from "./styled"

interface Props {
  error: string
  closeModal: () => void
}

const TransactionError: FC<Props> = ({ error, closeModal }) => {
  return (
    <Confirm title="Error" isOpen={!!error.length} toggle={closeModal}>
      <Icon src={warn} />
      <Text>{error}</Text>
      <Button m="24px 0 0" full onClick={closeModal}>
        Dismiss
      </Button>
    </Confirm>
  )
}

export default TransactionError
