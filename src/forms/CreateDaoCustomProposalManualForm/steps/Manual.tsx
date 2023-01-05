import React, {
  useContext,
  useCallback,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react"
import { useParams } from "react-router-dom"

import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  CreateDaoCardStepNumber,
  CollapsedCard,
  Headline1,
  RegularText,
} from "common"
import { useFormValidation } from "hooks/useFormValidation"
import { AdvancedManualContext } from "context/govPool/proposals/custom/AdvancedManualContext"
import {
  TextareaField,
  InputField,
  SelectField,
  OverlapInputField,
} from "fields"
import { stepsControllerContext } from "context/StepsControllerContext"
import theme from "theme"
import { ICON_NAMES } from "consts/icon-names"
import { isAddressValidator, required } from "utils/validators"
import { useBreakpoints } from "hooks"
import {
  useGovPoolSettingsIdToExecutors,
  useGovPoolExecutorToSettings,
} from "hooks/dao"
import { readFromClipboard } from "utils/clipboard"
import { isAddress, shortenAddress } from "utils"

import * as S from "../styled"
import * as SForms from "common/FormSteps/styled"

const ManualStep: React.FC = () => {
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()

  const { isMobile } = useBreakpoints()
  const [settingsId] = useGovPoolExecutorToSettings(daoAddress, executorAddress)
  const [executors] = useGovPoolSettingsIdToExecutors(
    daoAddress,
    settingsId ? settingsId.toString() : undefined
  )

  const executorsShorten = useMemo(
    () => (executors ? executors.map((el) => el.executorAddress) : []),
    [executors]
  )

  const { contracts, executorContract, onContractDelete, onContractAdd } =
    useContext(AdvancedManualContext)
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)

  const { getFieldErrorMessage, isFieldsValid, touchForm, touchField } =
    useFormValidation(
      {
        contractAddresses: contracts.get.map((el) => el.contractAddress),
        executorAddress: executorContract.get.contractAddress,
        executorTransactionData: executorContract.get.transactionData,
        transactionsData: contracts.get.map((el) => el.transactionData),
        values: contracts.get.map((el) => el.value),
      },
      {
        executorAddress: {
          required,
          isAddressValidator,
        },
        executorTransactionData: {
          required,
        },
        ...(contracts.get.length !== 0
          ? {
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
          : {}),
      }
    )

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  const handleNextStep = useCallback(() => {
    touchForm()
    if (!isFieldsValid) return

    nextCb()
  }, [nextCb, touchForm, isFieldsValid])

  return (
    <SForms.StepsRoot>
      {isMobile && (
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
            title="Заповніть дані"
          />
          <CardDescription>
            <p>Insert in the field below the DATA of the formed transaction:</p>
          </CardDescription>
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
      )}
      {!isMobile && (
        <S.DesktopHeaderWrp>
          <Headline1 color={theme.statusColors.info} desktopWeight={900}>
            Заповніть дані
          </Headline1>
          <RegularText
            color={theme.textColors.secondary}
            desktopWeight={500}
            desktopSize={"14px"}
          >
            Insert in the field below the DATA of the formed transaction:
          </RegularText>
          <br />
          <AppButton
            type="button"
            text="+ Add more contract addresses"
            color="default"
            size="no-paddings"
            onClick={() => onContractAdd()}
          />
        </S.DesktopHeaderWrp>
      )}
      {contracts.get.map((contract, index) => {
        return (
          <CollapsedCard key={contract.id} title={`Contract ${index + 1}`}>
            <InputField
              label="Value (optional)"
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
              onBlur={() => touchField(`contractAddresses[${index}]`)}
              overlapNodeLeft={
                isAddress(contract.contractAddress) ? (
                  <S.Address>
                    {shortenAddress(contract.contractAddress, 4)}
                  </S.Address>
                ) : null
              }
              nodeLeft={null}
              nodeRight={
                !isAddress(contract.contractAddress) ? (
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
      <CollapsedCard title="Executor contract">
        <InputField
          label="Value (optional)"
          type="number"
          value={executorContract.get.value}
          setValue={(value) =>
            executorContract.set({
              ...executorContract.get,
              value: value as string,
            })
          }
          nodeRight={<S.TokenLabel>BNB</S.TokenLabel>}
        />
        <SelectField
          placeholder="Contract address"
          selected={executorContract.get.contractAddress ?? undefined}
          setSelected={(newSelectedAddress) => {
            executorContract.set({
              ...executorContract.get,
              contractAddress: newSelectedAddress ?? "",
            })
          }}
          list={executorsShorten}
          errorMessage={getFieldErrorMessage("executorAddress")}
          onBlur={() => touchField("executorAddress")}
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
          value={executorContract.get.transactionData}
          setValue={(value) =>
            executorContract.set({
              ...executorContract.get,
              transactionData: value as string,
            })
          }
          label="DATA Transaction"
          errorMessage={getFieldErrorMessage("executorTransactionData")}
          onBlur={() => touchField("executorTransactionData")}
        />
      </CollapsedCard>
      <SForms.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </SForms.StepsRoot>
  )
}

export default ManualStep
