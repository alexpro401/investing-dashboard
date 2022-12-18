import React, { useContext, useCallback, Dispatch, SetStateAction } from "react"
import { createPortal } from "react-dom"

import {
  Card,
  CardHead,
  CardDescription,
  CreateDaoCardStepNumber,
  StepsNavigation,
  CollapsedCard,
  AppButton,
} from "common"
import { stepsControllerContext } from "context/StepsControllerContext"
import { createCustomProposalTypeContext } from "context/govPool/proposals/regular/CreateCustomProposalType"
import { InputField } from "fields"
import { readFromClipboard } from "utils/clipboard"
import { useFormValidation } from "hooks/useFormValidation"
import { required, isAddressValidator } from "utils/validators"
import { ICON_NAMES } from "constants/icon-names"
import theme from "theme"

import * as S from "../styled"

const ExecutorsStep: React.FC = () => {
  const { currentStepNumber, nextCb } = useContext(stepsControllerContext)
  const { executorAddresses, addExecutorAddress, deleteExecutorAddress } =
    useContext(createCustomProposalTypeContext)

  const { getFieldErrorMessage, touchField, isFieldsValid, touchForm } =
    useFormValidation(
      { executorAddresses: executorAddresses.get.map((el) => el.address) },
      {
        executorAddresses: {
          $every: {
            required,
            isAddressValidator,
          },
        },
      }
    )

  const handleNextStepCb = useCallback(() => {
    touchForm()
    if (!isFieldsValid) return

    nextCb()
  }, [nextCb, touchForm, isFieldsValid])

  const pasteFromClipboard = useCallback(
    async (dispatchCb: Dispatch<SetStateAction<any>>) => {
      dispatchCb(await readFromClipboard())
    },
    []
  )

  const appNavigationEl = document.querySelector("#app-navigation")

  return (
    <>
      <S.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<CreateDaoCardStepNumber number={currentStepNumber} />}
            title="Налаштування пропоузала"
          />
          <CardDescription>
            <p>В майбутньому замінити текст.</p>
          </CardDescription>
          <S.ButtonsContainer>
            <AppButton
              type="button"
              text="+ Add more contract addresses"
              color="default"
              size="no-paddings"
              onClick={addExecutorAddress}
            />
          </S.ButtonsContainer>
        </Card>
        {executorAddresses.get.map((el, index) => {
          return (
            <CollapsedCard title={`Contract ${index + 1}`} key={el.id}>
              <InputField
                value={el.address}
                setValue={(value: string) => {
                  executorAddresses.set(index, value)
                }}
                label="Contract address"
                errorMessage={getFieldErrorMessage(
                  `executorAddresses[${index}]`
                )}
                onBlur={() => touchField(`executorAddresses[${index}]`)}
                nodeRight={
                  <AppButton
                    type="button"
                    text="Paste"
                    color="default"
                    size="no-paddings"
                    onClick={() =>
                      pasteFromClipboard((value: string) => {
                        executorAddresses.set(index, value)
                      })
                    }
                  />
                }
              />
              <S.ButtonsContainer>
                <AppButton
                  disabled={executorAddresses.get.length === 1}
                  style={{ color: theme.statusColors.error }}
                  iconLeft={ICON_NAMES.trash}
                  iconSize={16}
                  type="button"
                  text="Delete"
                  color="default"
                  size="no-paddings"
                  onClick={() => deleteExecutorAddress(index)}
                />
              </S.ButtonsContainer>
            </CollapsedCard>
          )
        })}
      </S.StepsRoot>
      {appNavigationEl ? (
        createPortal(
          <StepsNavigation customNextCb={handleNextStepCb} />,
          appNavigationEl
        )
      ) : (
        <></>
      )}
    </>
  )
}

export default ExecutorsStep
