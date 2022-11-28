import { FC, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"

import ExchangeInput from "components/Exchange/ExchangeInput"
import * as S from "components/Exchange/styled"
import { ZERO } from "constants/index"
import { Flex } from "theme"
import useValidatorsVote, { ButtonTypes } from "./useValidatorsVote"
import { Container } from "components/Exchange/styled"
import Header from "components/Header/Layout"

export interface Props {
  daoPoolAddress?: string
  proposalId?: string
  isInternal?: boolean
}

// ValidatorsVote - card component. can be used as separate element on the page
export const ValidatorsVote: FC<Props> = ({
  daoPoolAddress,
  proposalId,
  isInternal,
}) => {
  const { formInfo, buttonType, ERC20Amount, handleERC20Change, handleSubmit } =
    useValidatorsVote(daoPoolAddress, isInternal)

  const button = useMemo(() => {
    if (buttonType === ButtonTypes.EMPTY_AMOUNT) {
      return (
        <S.SubmitButton
          disabled
          color="secondary"
          type="button"
          size="large"
          onClick={() => {}}
          text="Select amount"
        />
      )
    }

    return (
      <S.SubmitButton
        type="button"
        size="large"
        onClick={() => handleSubmit(proposalId)}
        text="Confirm vote"
      />
    )
  }, [buttonType, proposalId, handleSubmit])

  return (
    <>
      <S.Card>
        <S.CardHeader>
          <S.Title active>Validator voting</S.Title>
        </S.CardHeader>

        <ExchangeInput
          customPrice={<S.Price>Validators token</S.Price>}
          price={ZERO}
          amount={ERC20Amount.toString()}
          balance={formInfo.erc20.balance || ZERO}
          address={formInfo.erc20.address}
          symbol={formInfo.erc20.symbol}
          decimal={formInfo.erc20.decimal}
          onChange={handleERC20Change}
        />

        <Flex p="16px 0 0" full>
          {button}
        </Flex>
      </S.Card>
    </>
  )
}

// wrapps DelegateTerminal with router params and layout
const ValidatorsVotePage = () => {
  const { daoPoolAddress, proposalId } = useParams<
    "daoPoolAddress" | "proposalId"
  >()
  const searchParams = useLocation().search

  const isInternal =
    new URLSearchParams(searchParams).get("isInternal") === "true"

  return (
    <>
      <Header>Validators voting</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ValidatorsVote
          daoPoolAddress={daoPoolAddress}
          proposalId={proposalId}
          isInternal={isInternal}
        />
      </Container>
    </>
  )
}

export default ValidatorsVotePage
