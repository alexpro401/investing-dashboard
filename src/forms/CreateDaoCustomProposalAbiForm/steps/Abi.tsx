import { useParams } from "react-router-dom"
import theme from "theme"

import {
  FC,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from "react"

import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  CreateDaoCardStepNumber,
} from "common"

import {
  InputField,
  OverlapInputField,
  SelectField,
  TextareaField,
} from "fields"

import ABIConstructor from "modals/ABIConstructor"

import { ICON_NAMES } from "constants/icon-names"
import { AdvancedABIContext } from "context/govPool/proposals/custom/AdvancedABIContext"

import { useFormValidation } from "hooks/useFormValidation"
import useAbiKeeper from "hooks/useAbiKeeper"

import { isAddress, shortenAddress } from "utils"
import { readFromClipboard } from "utils/clipboard"
import { required, isAddressValidator } from "utils/validators"

import * as S from "../styled"

// TODO: improvements
// 1. save selected method & params decoded in context - needed to parse data in preview
// 2. improve ABI form fields - add loading state, add clear button, add paste button

const AbiStep: FC = () => {
  const { daoAddress, executorAddress } = useParams<
    "daoAddress" | "executorAddress"
  >()

  // TODO: Dummy data -> replace to hook data
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
    contractValues,
    executorSelectedAddress,
    executorValue,
    encodedMethods,
    modal,
    onContractAddressDelete,
    onContractAddressAdd,
  } = useContext(AdvancedABIContext)

  const adresses = useMemo(
    () => contractAdresses.get.map((a) => a[1]),
    [contractAdresses.get]
  )

  const { abis, executorsAbis, handleCustomAbi } = useAbiKeeper(
    adresses,
    executors
  )

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

        <InputField
          placeholder="Value (optional)"
          type="text"
          value={executorValue.get}
          setValue={(value) => executorValue.set(value as string)}
          nodeRight={<S.FieldNodeRight>BNB</S.FieldNodeRight>}
        />

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
          value={executorsAbis[executors.indexOf(executorSelectedAddress.get)]}
          setValue={(value) =>
            handleCustomAbi(executorSelectedAddress.get, value as string)
          }
          label="ABI"
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
      executorValue,
      executorSelectedAddress,
      executors,
      executorsAbis,
      encodedMethods.get,
      modal.get,
      handleCustomAbi,
      handleOpenContractMethodSelector,
    ]
  )

  const addressCardRenderer = useCallback(
    ([id, address]: [id: string, address: string], index: number) => (
      <S.ContractCard key={id}>
        <CardHead title={`Contract ${index + 1}`} />
        <InputField
          placeholder="Value (optional)"
          type="text"
          value={contractValues.get[index]}
          setValue={(value) => contractValues.set(index, value as string)}
          nodeRight={<S.FieldNodeRight>BNB</S.FieldNodeRight>}
        />
        <OverlapInputField
          readonly
          value={address}
          setValue={(value) => contractAdresses.set(index, id, value as string)}
          label="Contract address"
          errorMessage={getFieldErrorMessage("contractAdresses")}
          onBlur={() => touchField("contractAdresses")}
          overlapNodeLeft={
            isAddress(address) ? (
              <S.Address>{shortenAddress(address, 4)}</S.Address>
            ) : null
          }
          nodeLeft={null}
          nodeRight={
            !isAddress(address) ? (
              <AppButton
                type="button"
                text="Paste"
                color="default"
                size="no-paddings"
                onClick={() =>
                  pasteFromClipboard((value) =>
                    contractAdresses.set(index, id, value as string)
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
                onClick={() => contractAdresses.set(index, id, "")}
              />
            )
          }
        />

        <TextareaField
          placeholder="ABI"
          value={abis[index]}
          setValue={(value) => handleCustomAbi(address, value)}
        />

        <OverlapInputField
          readonly
          label=""
          placeholder="Contract method"
          setValue={() => {}}
          onClick={() => handleOpenContractMethodSelector(address)}
          value={
            (address in encodedMethods.get && encodedMethods.get[address][0]) ||
            ""
          }
          overlapNodeLeft={
            (
              <S.SelectItem>
                {address in encodedMethods.get &&
                  encodedMethods.get[address][0]}
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
      contractValues,
      getFieldErrorMessage,
      abis,
      encodedMethods.get,
      modal.get,
      contractAdresses,
      touchField,
      pasteFromClipboard,
      handleCustomAbi,
      handleOpenContractMethodSelector,
      onContractAddressDelete,
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
            onClick={onContractAddressAdd}
          />
        </S.CardFooter>
      </Card>

      {contractAdresses.get.map(addressCardRenderer)}

      {executorCardRenderer()}

      <ABIConstructor
        abi={
          abis[adresses.indexOf(modal.get)] ||
          executorsAbis[executors.indexOf(modal.get)]
        }
        allowedMethods={adresses.indexOf(modal.get) > -1 ? ["approve"] : []}
        onSubmit={handleConstructorSubmit}
        isOpen={modal.get !== ""}
        onClose={() => modal.set("")}
      />
    </S.StepsRoot>
  )
}

export default AbiStep
