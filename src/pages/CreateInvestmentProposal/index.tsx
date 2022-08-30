import { FC } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { format } from "date-fns/esm"
import { createClient, Provider as GraphProvider } from "urql"

import { expandTimestamp, formatBigNumber } from "utils"

import { DATE_TIME_FORMAT } from "constants/time"
import { Flex } from "theme"
import Header from "components/Header/Layout"
import IconButton from "components/IconButton"
import Button from "components/Button"
import Input from "components/Input"
import TextArea from "components/TextArea"
import Tooltip from "components/Tooltip"
import DatePicker from "components/DatePicker"

import close from "assets/icons/close-big.svg"
import calendar from "assets/icons/calendar.svg"

import useCreateInvestmentProposal from "./useCreateInvestmentProposal"

import {
  Container,
  Card,
  Content,
  Title,
  SubTitle,
  Row,
  CardHeader,
  Body,
  CalendarIcon,
  HintText,
  Label,
  White,
  Grey,
  SymbolsLeft,
  ValidationError,
} from "./styled"
import { SubmitState } from "constants/types"
import TransactionSent from "modals/TransactionSent"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const CreateInvestmentProposal: FC = () => {
  const { poolAddress } = useParams()
  const [
    {
      lpAmount,
      ticker,
      description,
      timestampLimit,
      investLPLimit,
      isSubmiting,
      isDateOpen,
      lpAvailable,
      validationErrors,
      totalProposals,
      poolSymbol,
    },
    {
      setLpAmount,
      setTicker,
      setDescription,
      setTimestampLimit,
      setInvestLPLimit,
      setSubmiting,
      handleSubmit,
      setDateOpen,
    },
  ] = useCreateInvestmentProposal(poolAddress)

  const navigate = useNavigate()

  const handleInvestRedirect = () => {
    navigate(`/invest-investment-proposal/${poolAddress}/${totalProposals - 1}`)
  }

  const getFieldErrors = (name: string) => {
    return validationErrors
      .filter((error) => error.field === name)
      .map((error) => (
        <ValidationError key={error.field}>{error.message}</ValidationError>
      ))
  }

  const successModal = (
    <TransactionSent
      isOpen={SubmitState.SUCCESS === isSubmiting}
      toggle={() => setSubmiting(SubmitState.IDLE)}
      title="Success"
      description="You have successfully created an invest proposal."
    >
      <Button
        onClick={handleInvestRedirect}
        size="large"
        theme="primary"
        fz={22}
        full
      >
        Invest in proposal
      </Button>
    </TransactionSent>
  )

  return (
    <>
      {successModal}
      <Header>Create invest proposal</Header>
      <Container>
        <Card>
          <CardHeader>
            <Title>Proposal</Title>
            <IconButton media={close} onClick={() => navigate(-2)} />
          </CardHeader>
          <Content>
            <Body>
              <HintText>
                If you want to create investment proposal, please, fill out the
                form below. You can change parameters after creation
              </HintText>
              <SubTitle>Investment proposal settings</SubTitle>

              <Row>
                <Label
                  icon={
                    <Tooltip id="invest-proposal-ticker">Lorem ipsum</Tooltip>
                  }
                >
                  New ticker LP2
                </Label>
                <Input
                  theme="grey"
                  value={ticker}
                  onChange={setTicker}
                  placeholder="---"
                />
              </Row>
              <Row>
                <Flex p="0 5px 0 0" full>
                  <Label
                    icon={
                      <Tooltip id="invest-proposal-description">
                        Lorem ipsum
                      </Tooltip>
                    }
                  >
                    Proposal description
                  </Label>
                  <SymbolsLeft>
                    {100 - description.length} symbols left
                  </SymbolsLeft>
                </Flex>
                <TextArea
                  defaultValue={description}
                  name="description"
                  theme="grey"
                  onChange={(n, v) => setDescription(v)}
                />
              </Row>
              <Row>
                <Label
                  icon={<Tooltip id="invest-date-limit">Lorem ipsum</Tooltip>}
                >
                  Investment in invest. proposal pool is open until
                </Label>
                <Input
                  leftIcon={<CalendarIcon src={calendar} />}
                  disabled
                  theme="grey"
                  value=""
                  placeholder={format(
                    expandTimestamp(timestampLimit),
                    DATE_TIME_FORMAT
                  )}
                  onClick={() => setDateOpen(!isDateOpen)}
                />
                <DatePicker
                  isOpen={isDateOpen}
                  timestamp={expandTimestamp(timestampLimit)}
                  toggle={() => setDateOpen(false)}
                  onChange={setTimestampLimit}
                />
              </Row>
              <Row>
                <Label
                  icon={<Tooltip id="invest-lp-limit">Lorem ipsum</Tooltip>}
                >
                  Total amount of the investment proposal
                </Label>
                <Input
                  theme="grey"
                  value={investLPLimit}
                  onChange={setInvestLPLimit}
                  placeholder="---"
                  rightIcon={
                    <Flex>
                      <Grey>{poolSymbol}</Grey>
                    </Flex>
                  }
                />
                {getFieldErrors("investLPLimit")}
              </Row>
              <Row>
                <Flex p="0 5px 0 0" full>
                  <Label
                    icon={<Tooltip id="invest-lp-amount">Lorem ipsum</Tooltip>}
                    right={<>Available:</>}
                  >
                    My LPs allocated
                  </Label>
                </Flex>
                <Input
                  theme="grey"
                  placeholder="---"
                  value={lpAmount}
                  onChange={setLpAmount}
                  rightIcon={
                    <Flex>
                      <White>{formatBigNumber(lpAvailable)}</White>
                      <Grey>{poolSymbol}</Grey>
                    </Flex>
                  }
                />
                {getFieldErrors("lpAmount")}
              </Row>
              <Flex full p="20px 0 0">
                <Button onClick={handleSubmit} full size="large">
                  Create investment proposal
                </Button>
              </Flex>
            </Body>
          </Content>
        </Card>
      </Container>
    </>
  )
}

const CreateInvestmentProposalWithProvider = () => {
  return (
    <GraphProvider value={poolsClient}>
      <CreateInvestmentProposal />
    </GraphProvider>
  )
}

export default CreateInvestmentProposalWithProvider
