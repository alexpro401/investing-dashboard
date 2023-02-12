import {
  AppButton,
  CardDescription,
  CardFormControl,
  CardHead,
  Icon,
} from "common"
import { ICON_NAMES, ROUTE_PATHS, SubmitState } from "consts"
import { useCreateRiskyProposalContext } from "context/fund/CreateRiskyProposalContext"
import { InputField, TextareaField } from "fields"
import DateField from "fields/DateField"
import { useFormValidation, usePoolContract } from "hooks"
import TransactionSent from "modals/TransactionSent"
import * as Layout from "pages/CreateRiskyProposal/styled"
import useCreateRiskyProposal from "pages/CreateRiskyProposal/useCreateRiskyProposal"
import { generatePath, useNavigate, useParams } from "react-router-dom"
import { useERC20Data } from "state/erc20/hooks"
import {
  expandTimestamp,
  formatBigNumber,
  normalizeBigNumber,
  shortTimestamp,
} from "utils"
import { required, minLength, maxLength } from "utils/validators"
import TokenTile from "../TokenTile"
import * as S from "./styled"

const Form = () => {
  const { tokenAddress, poolAddress } = useParams()
  const navigate = useNavigate()
  const {
    description,
    instantTradePercentage,
    investLPLimit,
    lpAmount,
    maxTokenPriceLimit,
    symbol,
    timestampLimit,
  } = useCreateRiskyProposalContext()
  const [
    { positionPrice, proposalCount, lpAvailable },
    { handleSubmit, payload, setPayload },
  ] = useCreateRiskyProposal(poolAddress, tokenAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const [baseToken] = useERC20Data(poolInfo?.parameters.baseToken)

  const {
    getFieldErrorMessage,
    isFieldValid,
    isFieldsValid,
    touchField,
    touchForm,
  } = useFormValidation(
    {
      symbol: symbol.get,
      description: description.get,
      timestampLimit: timestampLimit.get,
      investLPLimit: investLPLimit.get,
      maxTokenPriceLimit: maxTokenPriceLimit.get,
      instantTradePercentage: instantTradePercentage.get,
      lpAmount: lpAmount.get,
    },
    {
      symbol: { required, minLength: minLength(4), maxLength: maxLength(8) },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(100),
      },
      timestampLimit: { required },
      investLPLimit: { required },
      maxTokenPriceLimit: { required },
      instantTradePercentage: { required },
      lpAmount: { required },
    }
  )

  const CardHeadTemplate = (
    <Layout.Header>
      <Layout.Title>
        Create Risky Proposal
        <AppButton
          text="read more"
          size="no-paddings"
          color="default"
          routePath={generatePath(ROUTE_PATHS.riskyProposalCreate, {
            poolAddress: poolAddress!,
            tokenAddress: tokenAddress!,
            "*": "faq",
          })}
        />
      </Layout.Title>
      <Icon
        style={{ cursor: "pointer" }}
        name={ICON_NAMES.modalClose}
        onClick={() =>
          navigate(
            generatePath(ROUTE_PATHS.poolProfile, {
              poolAddress: poolAddress!,
              "*": "",
            })
          )
        }
      />
    </Layout.Header>
  )

  return (
    <>
      {/* MODAL */}

      <TransactionSent
        isOpen={SubmitState.SUCCESS === payload}
        toggle={() => {
          setPayload(SubmitState.IDLE)
          navigate(
            generatePath(ROUTE_PATHS.fundPositions, {
              poolAddress: poolAddress!,
              "*": "proposals/open",
            })
          )
        }}
        title="Success"
        description="You have successfully created a risk proposal. Deposit LP or trade your token"
      >
        <AppButton
          onClick={() => {
            setPayload(SubmitState.IDLE)
            navigate(
              generatePath(ROUTE_PATHS.riskyProposalSwap, {
                poolAddress: poolAddress!,
                proposalId: (proposalCount - 1).toString(),
                direction: "deposit",
              })
            )
          }}
          size="large"
          color="primary"
          full
          text="Open new trade"
        />
      </TransactionSent>

      {/* FORM */}

      <Layout.Container>
        {CardHeadTemplate}
        <Layout.Body>
          <S.Description>
            If you want to create investment proposal please fill out the form
            below. You can change parameters after creation
          </S.Description>
          <TokenTile tokenAddress={tokenAddress} />

          <S.MobileCard>
            <CardHead
              nodeLeft={
                <Icon style={{ width: 20, height: 20 }} name={ICON_NAMES.cog} />
              }
              title="Risk Proposal settings"
            />
            <CardDescription>
              <p>Text</p>
            </CardDescription>
            <CardFormControl>
              <InputField
                value={symbol.get}
                setValue={symbol.set}
                label="New ticker LP2"
                labelNodeRight={
                  isFieldValid("symbol") ? (
                    <Icon name={ICON_NAMES.greenCheck} />
                  ) : (
                    <></>
                  )
                }
                errorMessage={getFieldErrorMessage("symbol")}
                onBlur={() => touchField("symbol")}
              />
              <TextareaField
                value={description.get}
                setValue={description.set}
                labelNodeRight={
                  isFieldValid("description") ? (
                    <Icon name={ICON_NAMES.greenCheck} />
                  ) : (
                    <></>
                  )
                }
                label="Description"
                errorMessage={getFieldErrorMessage("description")}
                onBlur={() => touchField("description")}
              />
              <DateField
                date={expandTimestamp(timestampLimit.get)}
                setDate={(value: number) => {
                  timestampLimit.set(shortTimestamp(value))
                  touchField("timestampLimit")
                }}
                placeholder={"Investment closing date"}
                minDate={new Date()}
                errorMessage={getFieldErrorMessage("timestampLimit")}
              />
            </CardFormControl>
          </S.MobileCard>

          <S.MobileCard>
            <CardHead
              nodeLeft={
                <Icon
                  style={{ width: 20, height: 20 }}
                  name={ICON_NAMES.stocks}
                />
              }
              title="Investing in investment proposal"
            />
            <CardDescription>
              <p>
                Объяснить зачем создавать внутренний токен для валдиторов как
                проходят голосования
              </p>
            </CardDescription>
            <CardFormControl>
              <InputField
                value={investLPLimit.get}
                setValue={investLPLimit.set}
                label="Max LP limit for staking"
                nodeRight={<S.NodeText>{poolInfo?.ticker || ""}</S.NodeText>}
                type="number"
                inputMode="decimal"
                labelNodeRight={
                  isFieldValid("investLPLimit") ? (
                    <Icon name={ICON_NAMES.greenCheck} />
                  ) : (
                    <></>
                  )
                }
                errorMessage={getFieldErrorMessage("investLPLimit")}
                onBlur={() => touchField("investLPLimit")}
              />
              <InputField
                value={lpAmount.get}
                setValue={lpAmount.set}
                label="My LP allocated in proposal"
                nodeRight={
                  <S.NodeText>
                    <AppButton
                      color="default"
                      size="no-paddings"
                      text={formatBigNumber(lpAvailable)}
                      onClick={() => lpAmount.set(formatBigNumber(lpAvailable))}
                    />{" "}
                    {poolInfo?.ticker || ""}
                  </S.NodeText>
                }
                type="number"
                inputMode="decimal"
                labelNodeRight={
                  isFieldValid("lpAmount") ? (
                    <Icon name={ICON_NAMES.greenCheck} />
                  ) : (
                    <></>
                  )
                }
                errorMessage={getFieldErrorMessage("lpAmount")}
                onBlur={() => touchField("lpAmount")}
              />
              <InputField
                value={maxTokenPriceLimit.get}
                setValue={maxTokenPriceLimit.set}
                label="Maximun buying price"
                type="number"
                inputMode="decimal"
                nodeRight={
                  <S.NodeText>
                    {positionPrice &&
                      normalizeBigNumber(
                        positionPrice,
                        baseToken?.decimals,
                        8
                      )}{" "}
                    {baseToken?.symbol}
                  </S.NodeText>
                }
                labelNodeRight={
                  isFieldValid("maxTokenPriceLimit") ? (
                    <Icon name={ICON_NAMES.greenCheck} />
                  ) : (
                    <></>
                  )
                }
                errorMessage={getFieldErrorMessage("maxTokenPriceLimit")}
                onBlur={() => touchField("maxTokenPriceLimit")}
              />
              <InputField
                value={instantTradePercentage.get}
                setValue={instantTradePercentage.set}
                label="Position filled after creation"
                nodeRight={<S.NodeText>%</S.NodeText>}
                type="number"
                inputMode="decimal"
                labelNodeRight={
                  isFieldValid("instantTradePercentage") ? (
                    <Icon name={ICON_NAMES.greenCheck} />
                  ) : (
                    <></>
                  )
                }
                errorMessage={getFieldErrorMessage("instantTradePercentage")}
                onBlur={() => touchField("instantTradePercentage")}
              />
            </CardFormControl>
          </S.MobileCard>
        </Layout.Body>
        <Layout.Footer>
          <Layout.Buttons>
            <AppButton
              disabled={!isFieldsValid}
              text="Create risky proposal"
              size="large"
              color="primary"
              full
              onClick={handleSubmit}
            />
          </Layout.Buttons>
        </Layout.Footer>
      </Layout.Container>
    </>
  )
}

export default Form
