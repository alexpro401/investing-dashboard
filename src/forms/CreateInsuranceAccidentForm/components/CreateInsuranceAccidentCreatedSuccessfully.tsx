import { generatePath, useNavigate } from "react-router-dom"
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
import { useGovPoolLatestProposalId } from "hooks/dao"
import { ROUTE_PATHS } from "constants/index"

interface Props {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  url: string
  onVoteCallback: () => void
}

const CreateInsuranceAccidentCreatedSuccessfully: FC<Props> = ({
  open,
  url,
  setOpen,
  onVoteCallback,
}) => {
  const navigate = useNavigate()
  const addToast = useAddToast()
  const { updateLatesProposalId } = useGovPoolLatestProposalId(
    process.env.REACT_APP_DEXE_DAO_ADDRESS
  )

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

  const onVote = useCallback(async () => {
    const latestProposalId = await updateLatesProposalId()

    onVoteCallback()
    navigate(
      generatePath(ROUTE_PATHS.daoProposalVoting, {
        daoAddress: process.env.REACT_APP_DEXE_DAO_ADDRESS,
        proposalId: String(latestProposalId),
      })
    )
  }, [])

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
