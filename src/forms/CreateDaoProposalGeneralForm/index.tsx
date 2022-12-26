import React, { useContext, useCallback } from "react"

import {
  Card,
  CardDescription,
  CardHead,
  CardFormControl,
  CreateDaoCardStepNumber,
  Headline1,
  RegularText,
} from "common"
import { InputField, TextareaField } from "fields"
import { useBreakpoints } from "hooks"
import { useFormValidation } from "hooks/useFormValidation"
import { required, minLength, maxLength } from "utils/validators"
import { GovProposalCreatingContext } from "context/govPool/proposals/GovProposalCreatingContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import theme from "theme"

import { CreatingProposalSuccessModal } from "common/GovProposal"

import * as S from "common/FormSteps/styled"
import { DesktopHeaderWrp } from "./styled"

interface ICreateDaoProposalGeneralFormProps {
  withProposalTypeName?: boolean
  withProposalTypeDescription?: boolean
}

const CreateDaoProposalGeneralForm: React.FC<
  ICreateDaoProposalGeneralFormProps
> = ({ withProposalTypeName = false, withProposalTypeDescription = false }) => {
  const { isMobile } = useBreakpoints()

  const {
    proposalTypeName,
    proposalTypeDescription,
    proposalDescription,
    proposalName,
  } = useContext(GovProposalCreatingContext)

  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)

  const { getFieldErrorMessage, touchField, isFieldsValid, touchForm } =
    useFormValidation(
      {
        ...(withProposalTypeName
          ? { proposalTypeName: proposalTypeName.get }
          : {}),
        ...(withProposalTypeDescription
          ? { proposalTypeDescription: proposalTypeDescription.get }
          : {}),
        proposalName: proposalName.get,
        description: proposalDescription.get,
      },
      {
        ...(withProposalTypeName
          ? {
              proposalTypeName: {
                required,
                minLength: minLength(4),
                maxLength: maxLength(40),
              },
            }
          : {}),
        ...(withProposalTypeDescription
          ? {
              proposalTypeDescription: {
                maxLength: maxLength(1000),
              },
            }
          : {}),
        proposalName: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(40),
        },
        proposalDescription: {
          maxLength: maxLength(1000),
        },
      }
    )

  const handleNextStepCb = useCallback(() => {
    touchForm()
    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, isFieldsValid, touchForm])

  return (
    <>
      <CreatingProposalSuccessModal />
      <S.StepsRoot>
        {!isMobile && (
          <DesktopHeaderWrp>
            <Headline1 color={theme.statusColors.info} desktopWeight={900}>
              Basic info
            </Headline1>
            <RegularText color={theme.textColors.secondary}>
              Describe your proposal and give it a clear name so voters can
              immediately grasp what it’s about. A thorough and concise
              description helps DAO members make the right decision when voting
              on it.
            </RegularText>
          </DesktopHeaderWrp>
        )}
        <Card>
          {isMobile && (
            <>
              <CardHead
                nodeLeft={
                  <CreateDaoCardStepNumber number={currentStepNumber} />
                }
                title="Basic info"
              />
              <CardDescription>
                <p>
                  Describe your proposal and give it a clear name so voters can
                  immediately grasp what it’s about.
                </p>
                <p>
                  A thorough and concise description helps DAO members make the
                  right decision when voting on it.
                </p>
              </CardDescription>
            </>
          )}
          {!isMobile && (
            <RegularText desktopWeight={700} desktopSize={"16px"}>
              Proposal
            </RegularText>
          )}
          <CardFormControl>
            <InputField
              value={proposalName.get}
              setValue={proposalName.set}
              label="Proposal name"
              errorMessage={getFieldErrorMessage("proposalName")}
              onBlur={() => touchField("proposalName")}
            />
            <TextareaField
              value={proposalDescription.get}
              setValue={proposalDescription.set}
              label="Description"
              errorMessage={getFieldErrorMessage("proposalDescription")}
              onBlur={() => touchField("proposalDescription")}
            />
            {withProposalTypeName && (
              <InputField
                value={proposalTypeName.get}
                setValue={proposalTypeName.set}
                label="Proposal type name"
                errorMessage={getFieldErrorMessage("proposalTypeName")}
                onBlur={() => touchField("proposalTypeName")}
              />
            )}
            {withProposalTypeDescription && (
              <TextareaField
                value={proposalTypeDescription.get}
                setValue={proposalTypeDescription.set}
                label="Proposal type description"
                errorMessage={getFieldErrorMessage("proposalTypeDescription")}
                onBlur={() => touchField("proposalTypeDescription")}
              />
            )}
          </CardFormControl>
        </Card>
        <S.FormStepsNavigationWrp
          customNextCb={handleNextStepCb}
          nextLabel={"Create Proposal"}
        />
      </S.StepsRoot>
    </>
  )
}

export default CreateDaoProposalGeneralForm
