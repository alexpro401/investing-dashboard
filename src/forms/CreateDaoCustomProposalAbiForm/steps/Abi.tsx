import {
  AppButton,
  Card,
  CardDescription,
  CardHead,
  CreateDaoCardStepNumber,
} from "common"
import { ICON_NAMES } from "constants/icon-names"
import { AdvancedABIContext } from "context/govPool/proposals/custom/AdvancedABIContext"
import { OverlapInputField, TextareaField } from "fields"
import useABI from "hooks/useABI"
import { useFormValidation } from "hooks/useFormValidation"
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
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

  const getABI = useABI()

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getABI("0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82")
        console.log(data)
      } catch (e) {}
    })()
  }, [getABI])

  const { contractAdresses, modal, onContractAddressDelete } =
    useContext(AdvancedABIContext)
  const { getFieldErrorMessage, touchField } = useFormValidation(
    {
      contractAdresses: contractAdresses.get,
    },
    {
      contractAdresses: { required, isAddressValidator },
    }
  )

  // const abis = useAbisList(contractAdresses.get)

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  const handleOpenContractMethodSelector = useCallback(() => {
    modal.set(true)
  }, [modal])

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
      </Card>

      {contractAdresses.get.map((contractAddress, index) => (
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
            value={""}
            setValue={() => {}}
            label="ABI"
            errorMessage={getFieldErrorMessage("abi")}
            onBlur={() => touchField("abi")}
          />

          <OverlapInputField
            readonly
            label=""
            placeholder="Select contract method"
            value=""
            setValue={() => {}}
            onClick={handleOpenContractMethodSelector}
            overlapNodeLeft={null}
            overlapNodeRight={
              <S.NodeRightContainer>
                {!modal.get && <S.NodeRightIcon name={ICON_NAMES.angleDown} />}
                {modal.get && <S.NodeRightIcon name={ICON_NAMES.angleUp} />}
              </S.NodeRightContainer>
            }
          />

          <S.ButtonsContainer>
            <AppButton
              type="button"
              text="+ Add more"
              color="default"
              size="no-paddings"
              onClick={() =>
                contractAdresses.set(contractAdresses.get.length, "")
              }
            />
            <AppButton
              disabled={contractAdresses.get.length === 1}
              style={{ color: theme.statusColors.error }}
              iconLeft={ICON_NAMES.trash}
              iconSize={16}
              type="button"
              text="Delete"
              color="default"
              size="no-paddings"
              onClick={() => onContractAddressDelete(index)}
            />
          </S.ButtonsContainer>
        </S.ContractCard>
      ))}
    </S.StepsRoot>
  )
}

export default AbiStep
