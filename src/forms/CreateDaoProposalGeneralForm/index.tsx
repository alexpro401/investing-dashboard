import React, { useContext, useCallback, Dispatch, SetStateAction } from "react"

import {
  Card,
  CardDescription,
  CardHead,
  StepsNavigation,
  CardFormControl,
  AppButton,
} from "common"
import Button from "components/Button"
import { InputField, TextareaField } from "fields"
import { useFormValidation } from "hooks/useFormValidation"
import {
  required,
  isAddressValidator,
  minLength,
  maxLength,
} from "utils/validators"
import { readFromClipboard } from "utils/clipboard"
import { DaoProposalCreatingContext } from "context/DaoProposalCreatingContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import { CreateDaoCardStepNumber } from "forms/CreateFundDaoForm/components"
import TransactionSent from "modals/TransactionSent"

import * as S from "./styled"

interface ICreateDaoProposalGeneralFormProps {
  withContractName?: boolean
  withProposalTypeName?: boolean
  withProposalTypeDescription?: boolean
}

const CreateDaoProposalGeneralForm: React.FC<
  ICreateDaoProposalGeneralFormProps
> = ({
  withContractName = false,
  withProposalTypeName = false,
  withProposalTypeDescription = false,
}) => {
  const {
    contractAddress,
    proposalTypeName,
    proposalTypeDescription,
    proposalDescription,
    proposalName,
    successModalState,
  } = useContext(DaoProposalCreatingContext)

  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)

  const { getFieldErrorMessage, touchField, isFieldsValid, touchForm } =
    useFormValidation(
      {
        ...(withContractName ? { contractAddress: contractAddress.get } : {}),
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
        ...(withContractName
          ? { contractAddress: { required, isAddressValidator } }
          : {}),
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

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  const handleNextStepCb = useCallback(() => {
    touchForm()
    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, isFieldsValid, touchForm])

  return (
    <>
      <TransactionSent
        isOpen={successModalState.opened}
        toggle={() => {
          successModalState.onClick()
        }}
        title={successModalState.title}
        description={successModalState.text}
      >
        <Button
          onClick={() => {
            successModalState.onClick()
          }}
          size="large"
          theme="primary"
          fz={22}
          full
        >
          {successModalState.buttonText}
        </Button>
      </TransactionSent>
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
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
          <CardFormControl>
            {withContractName && (
              <InputField
                value={contractAddress.get}
                setValue={contractAddress.set}
                label="Contract address"
                errorMessage={getFieldErrorMessage("contractAddress")}
                onBlur={() => touchField("contractAddress")}
                nodeRight={
                  <AppButton
                    type="button"
                    text="Paste"
                    color="default"
                    size="no-paddings"
                    onClick={() => pasteFromClipboard(contractAddress.set)}
                  />
                }
              />
            )}
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
      </S.StepsRoot>
      <StepsNavigation
        customNextCb={handleNextStepCb}
        nextLabel={"Create Proposal"}
      />
    </>
  )
}

export default CreateDaoProposalGeneralForm
