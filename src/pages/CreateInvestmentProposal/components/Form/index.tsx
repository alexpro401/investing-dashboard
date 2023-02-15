import {
  AppButton,
  CardDescription,
  CardFormControl,
  CardHead,
  Icon,
} from "common"
import { useTranslation } from "react-i18next"
import { ICON_NAMES, ROUTE_PATHS, SubmitState } from "consts"
import { useCreateInvestProposalContext } from "context/fund/CreateInvestProposalContext"
import { InputField, TextareaField } from "fields"
import DateField from "fields/DateField"
import { useFormValidation, usePoolContract } from "hooks"
import TransactionSent from "modals/TransactionSent"
import useCreateInvestmentProposal from "pages/CreateInvestmentProposal/useCreateInvestmentProposal"
import * as Layout from "pages/CreateRiskyProposal/styled"
import { generatePath, useNavigate, useParams } from "react-router-dom"
import { expandTimestamp, formatBigNumber, shortTimestamp } from "utils"
import { required, minLength, maxLength } from "utils/validators"
import * as S from "./styled"

const Form = () => {
  const { poolAddress } = useParams()
  const navigate = useNavigate()
  const { description, investLPLimit, lpAmount, symbol, timestampLimit } =
    useCreateInvestProposalContext()
  const [
    { totalProposals, lpAvailable, payload },
    { handleSubmit, setPayload },
  ] = useCreateInvestmentProposal(poolAddress)
  const [, poolInfo] = usePoolContract(poolAddress)
  const { t } = useTranslation()

  const { getFieldErrorMessage, isFieldValid, isFieldsValid, touchField } =
    useFormValidation(
      {
        symbol: symbol.get,
        description: description.get,
        timestampLimit: timestampLimit.get,
        investLPLimit: investLPLimit.get,
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
        lpAmount: { required },
      }
    )

  const CardHeadTemplate = (
    <Layout.Header>
      <Layout.Title>
        {t("create-invest-proposal-card.card-title")}
        <AppButton
          text={t("create-invest-proposal-card.action-more")}
          size="no-paddings"
          color="default"
          routePath={generatePath(ROUTE_PATHS.investmentProposalCreate, {
            poolAddress: poolAddress!,
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
        title={t("create-invest-proposal-card.modal-title")}
        description={t("create-invest-proposal-card.modal-description")}
      >
        <AppButton
          onClick={() => {
            setPayload(SubmitState.IDLE)
            navigate(
              generatePath(ROUTE_PATHS.investmentProposalInvest, {
                poolAddress: poolAddress!,
                proposalId: (totalProposals - 1).toString(),
              })
            )
          }}
          size="large"
          color="primary"
          full
          text={t("create-invest-proposal-card.modal-action")}
        />
      </TransactionSent>

      {/* FORM */}

      <Layout.Container>
        {CardHeadTemplate}
        <Layout.Body>
          <S.Description>
            {t("create-invest-proposal-card.card-description")}
          </S.Description>

          <S.MobileCard>
            <CardHead
              nodeLeft={
                <Icon style={{ width: 20, height: 20 }} name={ICON_NAMES.cog} />
              }
              title={t("create-invest-proposal-card.section-label-settings")}
            />
            <CardDescription>
              <p>
                {t("create-invest-proposal-card.section-description-settings")}
              </p>
            </CardDescription>
            <CardFormControl>
              <InputField
                value={symbol.get}
                setValue={symbol.set}
                label={t("create-invest-proposal-card.section-label-symbol")}
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
                  "create-invest-proposal-card.section-label-description"
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
                  "create-invest-proposal-card.section-label-timestamp-limit"
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
              title={t("create-invest-proposal-card.section-label-investment")}
            />
            <CardDescription>
              <p>
                {t(
                  "create-invest-proposal-card.section-description-investment"
                )}
              </p>
            </CardDescription>
            <CardFormControl>
              <InputField
                value={investLPLimit.get}
                setValue={investLPLimit.set}
                label={t(
                  "create-invest-proposal-card.section-label-max-lp-limit"
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
                  "create-invest-proposal-card.section-label-personal-invest"
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
            </CardFormControl>
          </S.MobileCard>
        </Layout.Body>
        <Layout.Footer>
          <Layout.Buttons>
            <AppButton
              disabled={!isFieldsValid}
              text={t("create-invest-proposal-card.action-submit")}
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
