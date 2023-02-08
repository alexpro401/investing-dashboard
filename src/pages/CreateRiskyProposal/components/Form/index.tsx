import {
  AppButton,
  Card,
  CardDescription,
  CardFormControl,
  CardHead,
  Icon,
} from "common"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { InputField, TextareaField } from "fields"
import DateField from "fields/DateField"
import * as FaqS from "pages/CreateRiskyProposal/components/Faq/styled"
import useCreateRiskyProposal from "pages/CreateRiskyProposal/useCreateRiskyProposal"
import { generatePath, useParams } from "react-router-dom"
import TokenTile from "../TokenTile"
import * as S from "./styled"

const Form = () => {
  const { tokenAddress, poolAddress } = useParams()
  const [{ timestampLimit }] = useCreateRiskyProposal(poolAddress)

  const CardHeadTemplate = (
    <FaqS.Header>
      <FaqS.Title>
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
      </FaqS.Title>
      <Icon name={ICON_NAMES.modalClose} />
    </FaqS.Header>
  )

  return (
    <S.Container>
      {CardHeadTemplate}
      <FaqS.Body>
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
            <DateField
              date={timestampLimit}
              setDate={(value: number) => {
                // touchField("timestampLimit")
              }}
              placeholder={"Investment closing date"}
              minDate={new Date()}
              //   errorMessage={getFieldErrorMessage("sellStartDate")}
            />
            <InputField
              value={""}
              setValue={() => {}}
              label="New ticker LP2"
              //   labelNodeRight={
              // isFieldValid("daoName") ? (
              //   <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
              // ) : (
              //   <></>
              // )
              //   }
              //   errorMessage={getFieldErrorMessage("daoName")}
              //   onBlur={() => touchField("daoName")}
            />
            <TextareaField
              value={""}
              setValue={() => {}}
              label="Description"
              //   errorMessage={getFieldErrorMessage("description")}
              //   onBlur={() => touchField("description")}
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
              value={""}
              setValue={() => {}}
              label="New ticker LP2"
              //   labelNodeRight={
              // isFieldValid("daoName") ? (
              //   <S.FieldValidIcon name={ICON_NAMES.greenCheck} />
              // ) : (
              //   <></>
              // )
              //   }
              //   errorMessage={getFieldErrorMessage("daoName")}
              //   onBlur={() => touchField("daoName")}
            />
            <TextareaField
              value={""}
              setValue={() => {}}
              label="Description"
              //   errorMessage={getFieldErrorMessage("description")}
              //   onBlur={() => touchField("description")}
            />
          </CardFormControl>
        </S.MobileCard>
      </FaqS.Body>
    </S.Container>
  )
}

export default Form
