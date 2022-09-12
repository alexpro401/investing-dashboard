import Confirm from "components/Confirm"
import { FC, useCallback } from "react"

import Button from "components/Button"

import useError from "hooks/useError"

import warn from "assets/icons/warn-big.svg"

import { Icon, Text } from "./styled"

const ErrorMessage: FC = () => {
  const [error, updateError] = useError()

  const closeModal = useCallback(() => {
    updateError("")
  }, [updateError])

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

export default ErrorMessage
