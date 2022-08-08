import { FC } from "react"
import Confirm from "components/Confirm"
import Wow from "assets/transaction-sent-icons/wow.svg"
import { Body, WowImg, Text, ButtonsContainer } from "./styled"

interface TransactionSentProps {
  title: string
  description: string
  isOpen: boolean
  toggle: () => void
}

const TransactionSent: FC<TransactionSentProps> = ({
  title,
  description,
  isOpen,
  children,
  toggle,
}) => {
  return (
    <Confirm title={title} isOpen={isOpen} toggle={toggle}>
      <Body>
        <WowImg>
          <img src={Wow} alt="wow-img" />
        </WowImg>
        <Text>{description}</Text>
        <ButtonsContainer>{children}</ButtonsContainer>
      </Body>
    </Confirm>
  )
}

export default TransactionSent
