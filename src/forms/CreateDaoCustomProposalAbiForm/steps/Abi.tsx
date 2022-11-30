import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  CreateDaoCardStepNumber,
} from "common"
import { ICON_NAMES } from "constants/icon-names"
import { AdvancedABIContext } from "context/govPool/proposals/custom/AdvancedABIContext"
import { OverlapInputField, SelectField, TextareaField } from "fields"
import { useAbiList } from "hooks/useABI"
import { useFormValidation } from "hooks/useFormValidation"
import ABIConstructor from "modals/ABIConstructor"
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from "react"
import { useParams } from "react-router-dom"
import theme from "theme"
import { isAddress, shortenAddress } from "utils"
import { readFromClipboard } from "utils/clipboard"
import { required, isAddressValidator } from "utils/validators"

import * as S from "../styled"

const AbiStep: React.FC = () => {
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()

  const executors = useMemo(
    () => [
      "0x8eff9efd56581bb5b8ac5f5220fab9a7349160e3",
      "0xCC09139C13775Fd660A0601a055520F7967cf63f",
      "0x36119c25B7710fcbDEf1408cfaD2F24D4A95A41b",
    ],
    []
  )

  const {
    contractAdresses,
    executorSelectedAddress,
    encodedMethods,
    modal,
    onContractAddressDelete,
  } = useContext(AdvancedABIContext)

  const abis = useAbiList(contractAdresses.get)
  const executorAbis = useAbiList(executors)

  const { getFieldErrorMessage, touchField } = useFormValidation(
    {
      contractAdresses: contractAdresses.get,
    },
    {
      contractAdresses: { required, isAddressValidator },
    }
  )

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  const handleConstructorSubmit = useCallback(
    (methodName: string, encoded: string) => {
      encodedMethods.set(modal.get, [methodName, encoded])
      modal.set("")
    },
    [encodedMethods, modal]
  )

  const handleOpenContractMethodSelector = useCallback(
    (address: string) => {
      modal.set(address)
    },
    [modal]
  )

  const executorCardRenderer = useCallback(
    () => (
      <S.ContractCard>
        <CardHead title="Executor contract" />

        <SelectField
          placeholder="Contract address"
          selected={executorSelectedAddress.get}
          setSelected={(value) => executorSelectedAddress.set(value!)}
          list={executors}
          renderItem={(item) => (
            <S.SelectItem>{shortenAddress(item, 5)}</S.SelectItem>
          )}
          renderSelected={(item) => (
            <S.SelectItem>{shortenAddress(item, 5)}</S.SelectItem>
          )}
        />

        <TextareaField
          value={JSON.stringify(
            executorAbis[executors.indexOf(executorSelectedAddress.get)]
          )}
          setValue={() => {}}
          label="ABI"
          errorMessage={getFieldErrorMessage("abi")}
          onBlur={() => touchField("abi")}
        />

        <OverlapInputField
          readonly
          disabled={!executorSelectedAddress.get}
          label=""
          placeholder="Contract method"
          value={
            (executorSelectedAddress.get in encodedMethods.get &&
              encodedMethods.get[executorSelectedAddress.get][0]) ||
            ""
          }
          overlapNodeLeft={
            (
              <S.SelectItem>
                {executorSelectedAddress.get in encodedMethods.get &&
                  encodedMethods.get[executorSelectedAddress.get][0]}
              </S.SelectItem>
            ) || null
          }
          setValue={() => {}}
          onClick={() =>
            handleOpenContractMethodSelector(executorSelectedAddress.get)
          }
          overlapNodeRight={
            <S.NodeRightContainer>
              {!modal.get && <S.NodeRightIcon name={ICON_NAMES.angleDown} />}
              {modal.get && <S.NodeRightIcon name={ICON_NAMES.angleUp} />}
            </S.NodeRightContainer>
          }
        />
      </S.ContractCard>
    ),
    [
      executorSelectedAddress,
      executors,
      executorAbis,
      getFieldErrorMessage,
      encodedMethods.get,
      modal.get,
      touchField,
      handleOpenContractMethodSelector,
    ]
  )

  const addressCardRenderer = useCallback(
    (contractAddress: string, index: number) => (
      <S.ContractCard key={contractAddress}>
        <CardHead title={`Contract ${index + 1}`} />
        <OverlapInputField
          readonly
          value={contractAddress}
          setValue={(value) => contractAdresses.set(index, value as string)}
          label="Contract address"
          errorMessage={getFieldErrorMessage("contractAdresses")}
          onBlur={() => touchField("contractAdresses")}
          overlapNodeLeft={
            isAddress(contractAddress) ? (
              <S.Address>{shortenAddress(contractAddress, 4)}</S.Address>
            ) : null
          }
          nodeLeft={null}
          nodeRight={
            !isAddress(contractAddress) ? (
              <AppButton
                type="button"
                text="Paste"
                color="default"
                size="no-paddings"
                onClick={() =>
                  pasteFromClipboard((value) =>
                    contractAdresses.set(index, value as string)
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
                onClick={() => contractAdresses.set(index, "")}
              />
            )
          }
        />

        <TextareaField
          value={JSON.stringify(abis[index]) || ""}
          setValue={() => {}}
          label="ABI"
          errorMessage={getFieldErrorMessage("abi")}
          onBlur={() => touchField("abi")}
        />

        <OverlapInputField
          readonly
          label=""
          placeholder="Contract method"
          setValue={() => {}}
          onClick={() => handleOpenContractMethodSelector(contractAddress)}
          value={
            (contractAddress in encodedMethods.get &&
              encodedMethods.get[contractAddress][0]) ||
            ""
          }
          overlapNodeLeft={
            (
              <S.SelectItem>
                {contractAddress in encodedMethods.get &&
                  encodedMethods.get[contractAddress][0]}
              </S.SelectItem>
            ) || null
          }
          overlapNodeRight={
            <S.NodeRightContainer>
              {!modal.get && <S.NodeRightIcon name={ICON_NAMES.angleDown} />}
              {modal.get && <S.NodeRightIcon name={ICON_NAMES.angleUp} />}
            </S.NodeRightContainer>
          }
        />

        <S.CardFooter>
          <AppButton
            style={{ color: theme.statusColors.error }}
            iconLeft={ICON_NAMES.trash}
            iconSize={16}
            type="button"
            text="Delete"
            color="default"
            size="no-paddings"
            onClick={() => onContractAddressDelete(index)}
          />
        </S.CardFooter>
      </S.ContractCard>
    ),
    [
      abis,
      contractAdresses,
      encodedMethods.get,
      getFieldErrorMessage,
      handleOpenContractMethodSelector,
      modal.get,
      onContractAddressDelete,
      pasteFromClipboard,
      touchField,
    ]
  )

  return (
    <S.StepsRoot>
      <Card>
        <CardHead
          nodeLeft={<CreateDaoCardStepNumber number={2} />}
          title="Конструктор транзакции ABI"
        />
        <CardDescription>
          <p>
            description Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim{" "}
          </p>
        </CardDescription>

        <S.CardFooter p="10px 0 0">
          <AppButton
            type="button"
            text="+ Add more contract adresses"
            color="default"
            size="no-paddings"
            onClick={() =>
              contractAdresses.set(contractAdresses.get.length, "")
            }
          />
        </S.CardFooter>
      </Card>

      {contractAdresses.get.map(addressCardRenderer)}

      {executorCardRenderer()}

      <ABIConstructor
        abi={
          abis[contractAdresses.get.indexOf(modal.get)] ||
          executorAbis[executors.indexOf(modal.get)]
        }
        allowedMethods={
          contractAdresses.get.indexOf(modal.get) > -1 ? ["approve"] : []
        }
        onSubmit={handleConstructorSubmit}
        isOpen={modal.get !== ""}
        onClose={() => modal.set("")}
      />
    </S.StepsRoot>
  )
}

export default AbiStep
