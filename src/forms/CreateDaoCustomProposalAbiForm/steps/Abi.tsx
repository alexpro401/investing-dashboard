import {
  FC,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
} from "react"
import { createPortal } from "react-dom"
import { useParams } from "react-router-dom"
import theme from "theme"

import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  CollapsedCard,
  CreateDaoCardStepNumber,
  StepsNavigation,
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
import { stepsControllerContext } from "context/StepsControllerContext"

import { useFormValidation } from "hooks/useFormValidation"
import useAbiKeeper from "hooks/useAbiKeeper"
import {
  useGovPoolSettingsIdToExecutors,
  useGovPoolExecutorToSettings,
} from "hooks/dao"

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

  const [settingsId] = useGovPoolExecutorToSettings(daoAddress, executorAddress)
  const [executors] = useGovPoolSettingsIdToExecutors(
    daoAddress,
    settingsId ? settingsId.toString() : undefined
  )
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)

  const executorsShorten = useMemo(
    () => (executors ? executors.map((el) => el.executorAddress) : []),
    [executors]
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
    executorsShorten
  )

  const selectedExecutorAbi = useMemo(
    () => executorsAbis[executorsShorten.indexOf(executorSelectedAddress.get)],
    [executorsAbis, executorSelectedAddress, executorsShorten]
  )

  const selectedExecutorEncodeMethod = useMemo(
    () =>
      executorSelectedAddress.get &&
      encodedMethods.get[executorSelectedAddress.get] &&
      encodedMethods.get[executorSelectedAddress.get][0]
        ? encodedMethods.get[executorSelectedAddress.get][0]
        : "",
    [encodedMethods, executorSelectedAddress]
  )

  const { getFieldErrorMessage, touchField, isFieldsValid, touchForm } =
    useFormValidation(
      {
        executorSelectedAddress: executorSelectedAddress.get,
        selectedExecutorAbi,
        selectedExecutorEncodeMethod,
        contractAdresses: contractAdresses.get.map((el) => el[1]),
        abis: abis,
      },
      {
        executorSelectedAddress: { required, isAddressValidator },
        selectedExecutorAbi: { required },
        selectedExecutorEncodeMethod: { required },
        contractAdresses: { $every: { required, isAddressValidator } },
        abis: { $every: { required } },
      }
    )

  const handleNextStep = useCallback(() => {
    touchForm()

    for (const [, address] of contractAdresses.get) {
      if (!(address in encodedMethods.get) || !encodedMethods.get[address][0])
        return
    }

    if (!isFieldsValid) return

    nextCb()
  }, [nextCb, touchForm, isFieldsValid, encodedMethods, contractAdresses])

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
      <CollapsedCard title="Executor contract">
        <InputField
          placeholder="Value (optional)"
          type="number"
          value={executorValue.get}
          setValue={(value) => executorValue.set(value as string)}
          nodeRight={<S.FieldNodeRight>BNB</S.FieldNodeRight>}
        />

        <SelectField
          placeholder="Contract address"
          selected={executorSelectedAddress.get}
          setSelected={(value) => executorSelectedAddress.set(value!)}
          errorMessage={getFieldErrorMessage("executorSelectedAddress")}
          onBlur={() => touchField("executorSelectedAddress")}
          list={executorsShorten}
          renderItem={(item) => (
            <S.SelectItem>{shortenAddress(item, 5)}</S.SelectItem>
          )}
          renderSelected={(item) => (
            <S.SelectItem>{shortenAddress(item, 5)}</S.SelectItem>
          )}
        />

        <TextareaField
          value={selectedExecutorAbi}
          setValue={(value) =>
            handleCustomAbi(executorSelectedAddress.get, value as string)
          }
          label="ABI"
          errorMessage={getFieldErrorMessage("selectedExecutorAbi")}
          onBlur={() => touchField("selectedExecutorAbi")}
        />

        <OverlapInputField
          readonly
          disabled={!executorSelectedAddress.get}
          label=""
          placeholder="Contract method"
          value={selectedExecutorEncodeMethod}
          overlapNodeLeft={
            <S.SelectItem>{selectedExecutorEncodeMethod}</S.SelectItem> || null
          }
          setValue={() => {}}
          onClick={() =>
            handleOpenContractMethodSelector(executorSelectedAddress.get)
          }
          errorMessage={getFieldErrorMessage("selectedExecutorEncodeMethod")}
          onBlur={() => touchField("selectedExecutorEncodeMethod")}
          overlapNodeRight={
            <S.NodeRightContainer>
              {!modal.get && <S.NodeRightIcon name={ICON_NAMES.angleDown} />}
              {modal.get && <S.NodeRightIcon name={ICON_NAMES.angleUp} />}
            </S.NodeRightContainer>
          }
        />
      </CollapsedCard>
    ),
    [
      executorValue,
      executorSelectedAddress,
      executorsShorten,
      modal.get,
      handleCustomAbi,
      handleOpenContractMethodSelector,
      getFieldErrorMessage,
      touchField,
      selectedExecutorAbi,
      selectedExecutorEncodeMethod,
    ]
  )

  const addressCardRenderer = useCallback(
    ([id, address]: [id: string, address: string], index: number) => (
      <CollapsedCard key={id} title={`Contract ${index + 1}`}>
        <InputField
          placeholder="Value (optional)"
          type="number"
          value={contractValues.get[index]}
          setValue={(value) => contractValues.set(index, value as string)}
          nodeRight={<S.FieldNodeRight>BNB</S.FieldNodeRight>}
        />
        <OverlapInputField
          readonly
          value={address}
          setValue={(value) => contractAdresses.set(index, id, value as string)}
          label="Contract address"
          errorMessage={getFieldErrorMessage(`contractAdresses[${index}]`)}
          onBlur={() => touchField(`contractAdresses[${index}]`)}
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
          setValue={(value) => handleCustomAbi(address, value as string)}
          errorMessage={getFieldErrorMessage(`abis[${index}]`)}
          onBlur={() => touchField(`abis[${index}]`)}
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
          errorMessage={
            !(address in encodedMethods.get) || !encodedMethods.get[address][0]
              ? "Please fill out this field"
              : undefined
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
      </CollapsedCard>
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

  const appNavigationEl = document.querySelector("#app-navigation")

  return (
    <S.StepsRoot>
      <Card>
        <CardHead
          nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
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
          executorsAbis[executorsShorten.indexOf(modal.get)]
        }
        allowedMethods={adresses.indexOf(modal.get) > -1 ? ["approve"] : []}
        onSubmit={handleConstructorSubmit}
        isOpen={modal.get !== ""}
        onClose={() => modal.set("")}
      />
      {appNavigationEl ? (
        createPortal(
          <StepsNavigation customNextCb={handleNextStep} />,
          appNavigationEl
        )
      ) : (
        <></>
      )}
    </S.StepsRoot>
  )
}

export default AbiStep
