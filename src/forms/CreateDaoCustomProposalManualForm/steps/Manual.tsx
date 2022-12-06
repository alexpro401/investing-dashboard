import React, { useContext, useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"

import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  CreateDaoCardStepNumber,
  StepsNavigation,
  CollapsedCard,
} from "common"
import { useFormValidation } from "hooks/useFormValidation"
import { AdvancedManualContext } from "context/govPool/proposals/custom/AdvancedManualContext"
import { TextareaField, InputField, SelectField } from "fields"
import { shortenAddress } from "utils"
import { stepsControllerContext } from "context/StepsControllerContext"
import theme from "theme"
import { ICON_NAMES } from "constants/icon-names"
import { isAddressValidator, required } from "utils/validators"
import {
  useGovPoolSettingsIdToExecutors,
  useGovPoolExecutorToSettings,
} from "hooks/dao"

import * as S from "../styled"

const ManualStep: React.FC = () => {
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()

  const [settingsId] = useGovPoolExecutorToSettings(daoAddress, executorAddress)
  const [executors] = useGovPoolSettingsIdToExecutors(
    daoAddress,
    settingsId ? settingsId.toString() : undefined
  )

  const executorsShorten = useMemo(
    () => (executors ? executors.map((el) => el.executorAddress) : []),
    [executors]
  )

  console.log("executors: ", executors)

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
      }
    )

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
          <CollapsedCard key={contract.id} title={`Contract ${index + 1}`}>
            <SelectField
              placeholder="Contract address"
              selected={contract.contractAddress ?? undefined}
              setSelected={(newSelectedAddress) => {
                contracts.set(index, {
                  ...contract,
                  contractAddress: newSelectedAddress ?? "",
                })
              }}
              list={executorsShorten}
              errorMessage={getFieldErrorMessage(`contractAddresses[${index}]`)}
              onBlur={() => touchField(`contractAdresses[${index}]`)}
              renderSelected={(address) =>
                address ? (
                  <S.SelectFieldAddress>
                    {shortenAddress(address)}
                  </S.SelectFieldAddress>
                ) : null
              }
              renderItem={(item) => {
                return (
                  <S.SelectFieldAddress>
                    {shortenAddress(item)}
                  </S.SelectFieldAddress>
                )
              }}
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
          </CollapsedCard>
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
