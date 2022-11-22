import Confirm from "components/Confirm"
import { FC, useCallback } from "react"

import { AppButton } from "common"

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
      <AppButton
        size="medium"
        color="secondary"
        text="Dismiss"
        full
        onClick={closeModal}
      />
    </Confirm>
  )
}

export default ErrorMessage
