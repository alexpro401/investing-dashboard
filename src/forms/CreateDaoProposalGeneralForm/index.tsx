import React, { useContext, useCallback, Dispatch, SetStateAction } from "react"

import {
  Card,
  CardDescription,
  CardHead,
  StepsNavigation,
  CardFormControl,
  AppButton,
} from "common"
import { InputField, TextareaField } from "fields"
import { useFormValidation } from "hooks/useFormValidation"
import { required } from "utils/validators"
import { readFromClipboard } from "utils/clipboard"
import { DaoProposalCreatingContext } from "context/DaoProposalCreatingContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import { CreateDaoCardStepNumber } from "forms/CreateFundDaoForm/components"

import * as S from "./styled"

interface ICreateDaoProposalGeneralFormProps {
  withContractName?: boolean
}

const CreateDaoProposalGeneralForm: React.FC<
  ICreateDaoProposalGeneralFormProps
> = ({ withContractName = false }) => {
  const { contractAddress, description, proposalName } = useContext(
    DaoProposalCreatingContext
  )

  const { currentStepNumber } = useContext(stepsControllerContext)

  const { getFieldErrorMessage, touchField } = useFormValidation(
    {
      ...(withContractName ? { contractAddress: contractAddress.get } : {}),
      proposalName: proposalName.get,
      description: description.get,
    },
    {
      ...(withContractName ? { contractAddress: { required } } : {}),
      proposalName: { required },
      description: { required },
    }
  )

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  return (
    <>
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
                  >
                    Paste
                  </AppButton>
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
              value={description.get}
              setValue={description.set}
              label="Description"
              errorMessage={getFieldErrorMessage("description")}
              onBlur={() => touchField("description")}
            />
          </CardFormControl>
        </Card>
      </S.StepsRoot>
      <StepsNavigation />
    </>
  )
}

export default CreateDaoProposalGeneralForm
