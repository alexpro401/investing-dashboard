import { useNavigate } from "react-router-dom"
import { Dispatch, FC, SetStateAction, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

import { shortenAddress } from "utils"

import { Text } from "theme"
import Confirm from "components/Confirm"
import confirmModalImage from "assets/images/confirm-modal.png"

import * as S from "../styled/modal-created-sucessfully"
import { copyToClipboard } from "utils/clipboard"
import AppButton from "common/AppButton"
import { ICON_NAMES } from "constants/icon-names"
import { useAddToast } from "state/application/hooks"

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  url: string
}

const CreateInsuranceAccidentCreatedSuccessfully: FC<Props> = ({
  open,
  url,
  setOpen,
}) => {
  const navigate = useNavigate()
  const addToast = useAddToast()

  const copyURLToClipboard = useCallback(async () => {
    await copyToClipboard(url)
    addToast(
      {
        type: "success",
        content: "Insurance proposal address copied to clipboard.",
      },
      uuidv4(),
      3000
    )
  }, [])

  const onVote = () => {
    navigate(`/insurance/voting/${url}`)
  }

  return (
    <Confirm title="Success" isOpen={open} toggle={() => setOpen(!open)}>
      <S.Image src={confirmModalImage} alt="Success" />
      <AppButton
        onClick={copyURLToClipboard}
        iconRight={ICON_NAMES.copy}
        color="default"
        size="x-small"
        text={shortenAddress(url, 7)}
      />
      <Text
        color="#E4F2FF"
        fz={13}
        fw={500}
        block
        align="center"
        p="8px 0 16px"
      >
        Your proposal is creating and available for voting.
      </Text>
      <AppButton onClick={onVote} size="large" text="Vote for the proposal" />
    </Confirm>
  )
}

export default CreateInsuranceAccidentCreatedSuccessfully
