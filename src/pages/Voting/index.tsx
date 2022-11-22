import { FC, useRef, useState } from "react"
import { PulseSpinner } from "react-spinners-kit"
import { isEmpty, isFunction, isNil } from "lodash"

import {
  Body,
  BodyPlaceholder,
  ConfirmationText,
  VoicePoverContainer,
  VoicePoverText,
  Container,
  Amount,
  BtnContainer,
  ButtonsContainer,
} from "./styled"
import VotingCard from "components/cards/Voting"
import VotingCardInsuranceHead from "components/cards/Voting/VotingCardInsuranceHead"

import Icon from "components/Icon"
import Confirm from "components/Confirm"
import LoadMore from "components/LoadMore"
import { AppButton } from "common"

import { SubmitState } from "constants/types"
import TransactionSent from "modals/TransactionSent"
import { InsuranceAccident } from "interfaces/insurance"

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

interface Props {
  data?: Record<string, InsuranceAccident>
  loading: boolean
  fetchMore?: () => void
}

const Voting: FC<Props> = ({ data, loading, fetchMore }) => {
  const [votingState, setVotingState] = useState<"" | "up" | "down">("")
  const [, setPendingState] = useState(SubmitState.IDLE)
  const [successState, setSuccessState] = useState(false)
  const isOpen = votingState !== ""

  const scrollRef = useRef<any>(null)

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
      <Body ref={scrollRef}>
        {(isNil(data) || (isEmpty(data) && loading)) && (
          <BodyPlaceholder>
            <PulseSpinner />
          </BodyPlaceholder>
        )}

        {(isNil(data) || (isEmpty(data) && !loading)) && (
          <BodyPlaceholder>No transactions</BodyPlaceholder>
        )}

        {!isNil(data) &&
          Object.entries(data).map(([hash, accident]) => (
            <VotingCard
              shorten
              key={hash}
              payload={accident}
              nodeHead={<VotingCardInsuranceHead payload={accident} />}
            />
          ))}

        <LoadMore
          isLoading={loading && isNil(data)}
          handleMore={
            !isNil(fetchMore) && isFunction(fetchMore) ? fetchMore : () => {}
          }
          r={scrollRef}
        />
      </Body>

      <TransactionSent
        title="Success"
        description="Спасибо за твой голос. Мы оповестим тебя о результатах голосования."
        isOpen={successState}
        toggle={() => setSuccessState(false)}
      >
        <ButtonsContainer>
          <AppButton
            full
            size="small"
            text="Go to disscuss"
            color="secondary"
          />
          <AppButton full size="small" text="Close" color="primary" />
        </ButtonsContainer>
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
          <AppButton
            onClick={handleVote}
            full
            size="medium"
            color="primary"
            text={confirmStates[votingState]?.button}
          />
        </BtnContainer>
      </Confirm>
    </>
  )
}

export default Voting
