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
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()

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
        {t("creeate-risky-proposal-card.card-title")}
        <AppButton
          text={t("creeate-risky-proposal-card.action-more")}
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
        title={t("creeate-risky-proposal-card.modal-title")}
        description={t("creeate-risky-proposal-card.modal-description")}
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
          text={t("creeate-risky-proposal-card.modal-action")}
        />
      </TransactionSent>

      {/* FORM */}

      <Layout.Container>
        {CardHeadTemplate}
        <Layout.Body>
          <S.Description>
            {t("creeate-risky-proposal-card.card-description")}
          </S.Description>
          <TokenTile tokenAddress={tokenAddress} />

          <S.MobileCard>
            <CardHead
              nodeLeft={
                <Icon style={{ width: 20, height: 20 }} name={ICON_NAMES.cog} />
              }
              title={t("creeate-risky-proposal-card.section-label-settings")}
            />
            <CardDescription>
              <p>
                {t("creeate-risky-proposal-card.section-description-settings")}
              </p>
            </CardDescription>
            <CardFormControl>
              <InputField
                value={symbol.get}
                setValue={symbol.set}
                label={t("creeate-risky-proposal-card.section-label-symbol")}
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
                label={t(
                  "creeate-risky-proposal-card.section-label-description"
                )}
                errorMessage={getFieldErrorMessage("description")}
                onBlur={() => touchField("description")}
              />
              <DateField
                date={expandTimestamp(timestampLimit.get)}
                setDate={(value: number) => {
                  timestampLimit.set(shortTimestamp(value))
                  touchField("timestampLimit")
                }}
                placeholder={t(
                  "creeate-risky-proposal-card.section-label-timestamp-limit"
                )}
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
              title={t("creeate-risky-proposal-card.section-label-investment")}
            />
            <CardDescription>
              <p>
                {t(
                  "creeate-risky-proposal-card.section-description-investment"
                )}
              </p>
            </CardDescription>
            <CardFormControl>
              <InputField
                value={investLPLimit.get}
                setValue={investLPLimit.set}
                label={t(
                  "creeate-risky-proposal-card.section-label-max-lp-limit"
                )}
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
                label={t(
                  "creeate-risky-proposal-card.section-label-personal-invest"
                )}
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
                label={t(
                  "creeate-risky-proposal-card.section-label-max-buying-price"
                )}
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
                label={t(
                  "creeate-risky-proposal-card.section-label-position-filled"
                )}
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
              text={t("creeate-risky-proposal-card.action-submit")}
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
