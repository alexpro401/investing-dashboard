import { FC, useState } from "react"
import { Center, Flex } from "theme"
import { format } from "date-fns/esm"
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom"
import { useSelector } from "react-redux"

import Header from "components/Header/Layout"
import IconButton from "components/IconButton"
import Checkbox from "components/Checkbox"
import { AppButton, Card } from "common"
import Input from "components/Input"
import TokenIcon from "components/TokenIcon"
import Slider from "components/Slider"
import Tooltip from "components/Tooltip"
import DatePicker from "components/DatePicker"
import TransactionSent from "modals/TransactionSent"

import { SubmitState } from "consts/types"

import { usePoolContract } from "hooks/usePool"
import { Token } from "interfaces"
import { selectWhitelist } from "state/pricefeed/selectors"
import useTokenPriceOutUSD from "hooks/useTokenPriceOutUSD"
import { useUserAgreement } from "state/user/hooks"
import usePayload from "hooks/usePayload"
import { useERC20Data } from "state/erc20/hooks"

import { expandTimestamp, formatBigNumber, normalizeBigNumber } from "utils"
import { dropdownVariants } from "motion/variants"
import { DATE_TIME_FORMAT } from "consts/time"

import back from "assets/icons/angle-left.svg"
import close from "assets/icons/close-big.svg"
import calendar from "assets/icons/calendar.svg"

import faqText from "./faq"
import useCreateRiskyProposal from "./useCreateRiskyProposal"

import {
  Container,
  Content,
  Title,
  SubTitle,
  Row,
  CardHeader,
  Link,
  Body,
  FaqText,
  CheckboxLabel,
  CalendarIcon,
  TokenContainer,
  TokenInfo,
  Symbol,
  Name,
  Price,
  HintText,
  Label,
  White,
  Grey,
  ValidationError,
} from "./styled"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { GuardSpinner } from "react-spinners-kit"

const isFaqRead = localStorage.getItem("risky-proposal-faq-read") === "true"

const CreateRiskyProposal: FC = () => {
  const { tokenAddress, poolAddress } = useParams()

  const [payload, updatePayload] = usePayload()

  const [
    {
      validationErrors,
      proposalCount,
      lpAvailable,
      positionPrice,
      lpAmount,
      timestampLimit,
      investLPLimit,
      maxTokenPriceLimit,
      instantTradePercentage,
    },
    {
      setLpAmount,
      setTimestampLimit,
      setInvestLPLimit,
      setMaxTokenPriceLimit,
      setInstantTradePercentage,
      handleSubmit,
    },
  ] = useCreateRiskyProposal(poolAddress, tokenAddress)

  const [{ agreed }, { setShowAgreement }] = useUserAgreement()

  const [isChecked, setChecked] = useState(false)
  const [isDateOpen, setDateOpen] = useState(false)

  const proposalTokenPrice = useTokenPriceOutUSD({ tokenAddress: tokenAddress })
  const [, poolInfo] = usePoolContract(poolAddress)
  const [baseTokenData] = useERC20Data(poolInfo?.parameters.baseToken)

  const [tokenData] = useERC20Data(tokenAddress)
  const navigate = useNavigate()

  const whitelisted = useSelector(selectWhitelist)

  const handleNextStep = () => {
    if (isChecked) {
      localStorage.setItem("risky-proposal-faq-read", "true")
    }

    if (!tokenData) {
      navigate(`/create-risky-proposal/${poolAddress}/0x/2`)
    }
  }

  const handleRiskyTokenSelect = (token: Token) => {
    navigate(`/create-risky-proposal/${poolAddress}/${token.address}/3`)
  }

  const handleSwapRedirect = () => {
    navigate(`/swap-risky-proposal/${poolAddress}/${proposalCount - 1}/deposit`)
    updatePayload(SubmitState.IDLE)
  }

  const getFieldErrors = (name: string) => {
    return validationErrors
      .filter((error) => error.field === name)
      .map((error) => (
        <ValidationError key={error.field}>{error.message}</ValidationError>
      ))
  }

  const stepComponents = {
    "1": {
      header: (
        <>
          <Title>How a risky proposal works ?</Title>
        </>
      ),
      content: (
        <Body>
          <FaqText>{faqText}</FaqText>
          <Flex full jc="flex-start" p="24px 0">
            <Checkbox
              label={
                <CheckboxLabel>
                  Don&apos;t show me this message again
                </CheckboxLabel>
              }
              name="dont-show-risky-proposal-faq"
              checked={isChecked}
              onChange={setChecked}
            />
          </Flex>
          <Flex full>
            <Flex full p="0 8px 0 0">
              <AppButton
                size="small"
                color="secondary"
                full
                onClick={() => navigate(-1)}
                text="Cancel"
              />
            </Flex>
            <Flex full p="0 0 0 8px">
              <AppButton
                size="small"
                full
                onClick={handleNextStep}
                text="Continue"
              />
            </Flex>
          </Flex>
        </Body>
      ),
    },
    "2": {
      header: (
        <>
          <IconButton media={back} onClick={() => navigate(-1)} />
          <Title>Select token</Title>
        </>
      ),
      content: (
        <Body noPaddings>
          {/* <TokensList
            query=""
            handleChange={() => {}}
            tokens={whitelisted}
            onSelect={handleRiskyTokenSelect}
          /> */}
        </Body>
      ),
    },
    "3": {
      header: (
        <>
          <IconButton media={back} onClick={() => navigate(-1)} />
          <Title>Open risk proposal</Title>
          <Link>read more</Link>
          <IconButton media={close} onClick={() => navigate(-3)} />
        </>
      ),
      content: (
        <>
          <TokenContainer>
            <TokenIcon address={tokenAddress} size={30} />
            <TokenInfo>
              <Symbol>{tokenData?.symbol}</Symbol>
              <Name>{tokenData?.name}</Name>
            </TokenInfo>
            {!!proposalTokenPrice && (
              <Price>${normalizeBigNumber(proposalTokenPrice, 18, 2)}</Price>
            )}
          </TokenContainer>
          <Body>
            <HintText>
              If you want to create risk proposal please fill out the form
              below. You can change parameters after creation
            </HintText>
            <SubTitle>Risk Proposal settings</SubTitle>

            <Row>
              <Label
                icon={<Tooltip id="risky-date-limit">Lorem ipsum</Tooltip>}
              >
                Investment in risk proposal pool is open until
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
              <Label icon={<Tooltip id="risky-lp-limit">Lorem ipsum</Tooltip>}>
                LPs available for staking among all investors
              </Label>
              <Input
                type="number"
                theme="grey"
                value={investLPLimit}
                placeholder="---"
                onChange={setInvestLPLimit}
                rightIcon={
                  <Flex>
                    <Grey>LP</Grey>
                  </Flex>
                }
              />
              {getFieldErrors("investLPLimit")}
            </Row>
            <Row>
              <Label
                icon={<Tooltip id="risky-max-price" />}
                right={<>Current price:</>}
              >
                Maximun buying price
              </Label>
              <Input
                type="number"
                theme="grey"
                placeholder="---"
                onChange={setMaxTokenPriceLimit}
                value={maxTokenPriceLimit}
                rightIcon={
                  <Flex>
                    <White>
                      {positionPrice &&
                        normalizeBigNumber(
                          positionPrice,
                          baseTokenData?.decimals,
                          4
                        )}
                    </White>
                    <Grey>{baseTokenData?.symbol}</Grey>
                  </Flex>
                }
              />
              {getFieldErrors("maxTokenPriceLimit")}
            </Row>
            <Flex full p="53px 0 0">
              <SubTitle>Own investing settings</SubTitle>
            </Flex>
            <Row>
              <Label
                icon={<Tooltip id="risky-max-price" />}
                right={<>Available:</>}
              >
                LPs allocated for the risk proposal
              </Label>
              <Input
                type="number"
                theme="grey"
                value={lpAmount}
                placeholder="---"
                onChange={setLpAmount}
                rightIcon={
                  <Flex>
                    <White>{formatBigNumber(lpAvailable)}</White>
                    <Grey>LP</Grey>
                  </Flex>
                }
              />
              {getFieldErrors("lpAmount")}
            </Row>
            <Row
              initial="hidden"
              variants={dropdownVariants}
              animate={lpAmount ? "visible" : "hidden"}
            >
              <Label
                icon={<Tooltip id="risky-position-fill">Lorem ipsum</Tooltip>}
              >
                Position filled after proposal creation
              </Label>
              <Slider
                name="position-fill"
                initial={instantTradePercentage}
                limits={{ max: 100, min: 0 }}
                onChange={(n, v) => setInstantTradePercentage(v)}
              />
            </Row>
            <Flex full p="20px 0 0">
              <AppButton
                onClick={() =>
                  agreed ? handleSubmit() : setShowAgreement(true)
                }
                full
                size="large"
                color="primary"
                text="Create risky proposal"
              />
            </Flex>
          </Body>
        </>
      ),
    },
  }

  const tradeModal = (
    <TransactionSent
      isOpen={SubmitState.SUCCESS === payload}
      toggle={() => updatePayload(SubmitState.IDLE)}
      title="Success"
      description="You have successfully created a risk proposal. Deposit LP or trade your token"
    >
      <AppButton
        onClick={handleSwapRedirect}
        size="large"
        color="primary"
        full
        text="Open new trade"
      />
    </TransactionSent>
  )

  return (
    <>
      {tradeModal}
      <Header>Create risky proposal</Header>
      <Container>
        <Card>
          <Routes>
            <Route
              path="1"
              element={
                isFaqRead ? (
                  <Navigate
                    to={`/create-risky-proposal/${poolAddress}/${tokenAddress}/2`}
                    replace
                  />
                ) : (
                  <>
                    <CardHeader>{stepComponents["1"].header}</CardHeader>
                    <Content>{stepComponents["1"].content}</Content>
                  </>
                )
              }
            />
            <Route
              path="2"
              element={
                <>
                  <CardHeader>{stepComponents["2"].header}</CardHeader>

                  <Content>{stepComponents["2"].content}</Content>
                </>
              }
            />
            <Route
              path="3"
              element={
                <>
                  <CardHeader>{stepComponents["3"].header}</CardHeader>

                  <Content>{stepComponents["3"].content}</Content>
                </>
              }
            />
          </Routes>
        </Card>
      </Container>
    </>
  )
}

const CreateRiskyProposalWithProvider = () => {
  const { poolAddress } = useParams()

  return (
    <WithPoolAddressValidation
      poolAddress={poolAddress ?? ""}
      loader={
        <Center>
          <GuardSpinner size={20} loading />
        </Center>
      }
    >
      <CreateRiskyProposal />
    </WithPoolAddressValidation>
  )
}

export default CreateRiskyProposalWithProvider
