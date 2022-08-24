import React, { useState } from "react"
import InsuranceCard from "components/InsuranceCard"
import {
  Body,
  ConfirmationText,
  VoicePoverContainer,
  VoicePoverText,
  Container,
  Amount,
  BtnContainer,
  ButtonsConteiner,
} from "./styled"
import Confirm from "components/Confirm"
import Icon from "components/Icon"
import Button, { SecondaryButton } from "components/Button"
import Payload from "components/Payload"
import TransactionSent from "modals/TransactionSent"
import { SubmitState } from "constants/types"

// confirm states
const confirmStates = {
  up: {
    description:
      "Ты уверен, что хочешь поддержать пропоузел про ISDX фонд? Это действие невозможно отменить.",
    button: "Up Voted",
  },
  down: {
    description:
      "Ты уверен, что  не хочешь поддержать пропоузел про ISDX фонд? Это действие невозможно отменить.",
    button: "Down Voted",
  },
}

const Voting = () => {
  const [votingState, setVotingState] = useState<"" | "up" | "down">("")
  const [pendingState, setPendingState] = useState(SubmitState.IDLE)
  const [successState, setSuccessState] = useState(false)
  const isOpen = votingState !== ""

  const handleClose = () => setVotingState("")

  const handleVote = () => {
    setVotingState("")
    setPendingState(SubmitState.SIGN)

    setTimeout(() => {
      setPendingState(SubmitState.IDLE)
      setSuccessState(true)
    }, 3 * 1000)
  }

  return (
    <>
      <Body>
        <InsuranceCard startvoting={setVotingState} />
        <InsuranceCard startvoting={setVotingState} />
        <InsuranceCard startvoting={setVotingState} />
        <InsuranceCard startvoting={setVotingState} />
        <InsuranceCard startvoting={setVotingState} />
        <InsuranceCard startvoting={setVotingState} />
      </Body>

      <Payload submitState={pendingState} toggle={setPendingState} />

      <TransactionSent
        title="Success"
        description="Спасибо за твой голос. Мы оповестим тебя о результатах голосования."
        isOpen={successState}
        toggle={() => setSuccessState(false)}
      >
        <ButtonsConteiner>
          <SecondaryButton size="big">Go to disscuss</SecondaryButton>
          <Button size="big">Close</Button>
        </ButtonsConteiner>
      </TransactionSent>

      <Confirm
        isOpen={isOpen}
        toggle={() => handleClose()}
        title="Сonfirmation"
      >
        <ConfirmationText>
          {confirmStates[votingState]?.description}
        </ConfirmationText>
        <VoicePoverContainer>
          <VoicePoverText>Voice Power</VoicePoverText>
          <Container>
            <Amount>2400 DEXE</Amount>
            <Icon size={20} />
          </Container>
        </VoicePoverContainer>
        <BtnContainer>
          <Button onClick={handleVote} full size="big">
            {confirmStates[votingState]?.button}
          </Button>
        </BtnContainer>
      </Confirm>
    </>
  )
}

export default Voting
