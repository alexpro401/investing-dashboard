import React, { useContext, useCallback } from "react"
import { useParams } from "react-router-dom"

import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  CreateDaoCardStepNumber,
  StepsNavigation,
} from "common"
import { useFormValidation } from "hooks/useFormValidation"
import { AdvancedManualContext } from "context/govPool/proposals/custom/AdvancedManualContext"
import { OverlapInputField, TextareaField, InputField } from "fields"
import { isAddress, shortenAddress } from "utils"
import { stepsControllerContext } from "context/StepsControllerContext"
import { readFromClipboard } from "utils/clipboard"
import theme from "theme"
import { ICON_NAMES } from "constants/icon-names"
import { isAddressValidator, required } from "utils/validators"

import * as S from "../styled"

const ManualStep: React.FC = () => {
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()

  const { contracts, onContractDelete, onContractAdd } = useContext(
    AdvancedManualContext
  )
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)

  const { getFieldErrorMessage, isFieldsValid, touchForm, touchField } =
    useFormValidation(
      {
        contractAddresses: contracts.get.map((el) => el.contractAddress),
        transactionsData: contracts.get.map((el) => el.transactionData),
        values: contracts.get.map((el) => el.value),
      },
      {
        contractAddresses: {
          $every: {
            required,
            isAddressValidator,
          },
        },
        transactionsData: {
          $every: {
            required,
          },
        },
        values: {
          $every: {
            required,
          },
        },
      }
    )

  const pasteFromClipboard = useCallback(async (dispatchCb: any) => {
    dispatchCb(await readFromClipboard())
  }, [])

  const handleNextStep = useCallback(() => {
    touchForm()
    if (!isFieldsValid) return

    nextCb()
  }, [nextCb, touchForm, isFieldsValid])

  return (
    <S.StepsRoot>
      <Card>
        <CardHead
          nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
          title="Заповніть дані"
        />
        <CardDescription>
          <p>Insert in the field below the DATA of the formed transaction:</p>
        </CardDescription>
      </Card>
      {contracts.get.map((contract, index) => {
        return (
          <S.ContractCard key={contract.id}>
            <CardHead title={`Contract ${index + 1}`} />
            <OverlapInputField
              readonly
              value={contract.contractAddress}
              setValue={(value) =>
                contracts.set(index, {
                  ...contract,
                  contractAddress: value as string,
                })
              }
              label="Contract address"
              errorMessage={getFieldErrorMessage(`contractAddresses[${index}]`)}
              onBlur={() => touchField(`contractAdresses[${index}]`)}
              overlapNodeLeft={
                isAddress(contract.contractAddress) ? (
                  <S.Address>
                    {shortenAddress(contract.contractAddress, 4)}
                  </S.Address>
                ) : null
              }
              nodeLeft={null}
              nodeRight={
                contract.contractAddress === "" ? (
                  <AppButton
                    type="button"
                    text="Paste"
                    color="default"
                    size="no-paddings"
                    onClick={() =>
                      pasteFromClipboard((value) =>
                        contracts.set(index, {
                          ...contract,
                          contractAddress: value as string,
                        })
                      )
                    }
                  />
                ) : (
                  <AppButton
                    style={{ color: theme.statusColors.error }}
                    type="button"
                    text="Clear"
                    color="default"
                    size="no-paddings"
                    onClick={() =>
                      contracts.set(index, {
                        ...contract,
                        contractAddress: "",
                      })
                    }
                  />
                )
              }
            />
            <TextareaField
              value={contract.transactionData}
              setValue={(value) =>
                contracts.set(index, {
                  ...contract,
                  transactionData: value as string,
                })
              }
              label="DATA Transaction"
              errorMessage={getFieldErrorMessage(`transactionsData[${index}]`)}
              onBlur={() => touchField(`transactionsData[${index}]`)}
            />
            <InputField
              label="Value"
              type="number"
              value={contract.value}
              errorMessage={getFieldErrorMessage(`values[${index}]`)}
              onBlur={() => touchField(`values[${index}]`)}
              setValue={(value) =>
                contracts.set(index, {
                  ...contract,
                  value: value as string,
                })
              }
              nodeRight={<S.TokenLabel>BNB</S.TokenLabel>}
            />
            <S.ButtonsContainer>
              <AppButton
                disabled={contracts.get.length === 1}
                style={{ color: theme.statusColors.error }}
                iconLeft={ICON_NAMES.trash}
                iconSize={16}
                type="button"
                text="Delete"
                color="default"
                size="no-paddings"
                onClick={() => onContractDelete(index)}
              />
            </S.ButtonsContainer>
          </S.ContractCard>
        )
      })}
      <Card>
        <S.ButtonsContainer>
          <AppButton
            type="button"
            text="+ Add more contract addresses"
            color="default"
            size="no-paddings"
            onClick={() => onContractAdd()}
          />
        </S.ButtonsContainer>
      </Card>
      <StepsNavigation customNextCb={handleNextStep} />
    </S.StepsRoot>
  )
}

export default ManualStep
