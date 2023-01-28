import React, { useContext, useMemo, useCallback } from "react"

import {
  Card,
  CardHead,
  Icon,
  CardDescription,
  CardFormControl,
  Collapse,
  AppButton,
} from "common"
import { InputField } from "fields"
import { TokenSaleCreatingContext } from "context/govPool/proposals/TokenSaleContext"
import { stepsControllerContext } from "context/StepsControllerContext"
import { readFromClipboard } from "utils/clipboard"
import { isAddress, shortenAddress } from "utils"
import Switch from "components/Switch"
import { ICON_NAMES } from "consts"

import { CreatingProposalSuccessModal } from "common/GovProposal"

import * as SForms from "common/FormSteps/styled"

const WhitelistStep: React.FC = () => {
  const { nextCb } = useContext(stepsControllerContext)
  const {
    currentProposalIndex,
    tokenSaleProposals,
    handleUpdateTokenSaleProposal,
    whitelistValidation,
  } = useContext(TokenSaleCreatingContext)

  const { isWhitelist, whitelistAddresses } = useMemo(
    () => tokenSaleProposals[currentProposalIndex],
    [currentProposalIndex, tokenSaleProposals]
  )

  const { getFieldErrorMessage, isFieldsValid, touchField, touchForm } =
    useMemo(() => whitelistValidation, [whitelistValidation])

  const handleNextStep = useCallback(() => {
    touchForm()

    if (isFieldsValid) {
      nextCb()
    }
  }, [nextCb, touchForm, isFieldsValid])

  const handlePasteAddresses = useCallback(async () => {
    try {
      const text = await readFromClipboard()
      const textFiltered = text
        .replace(" ", "")
        .split(",")
        .filter((el) => isAddress(el))
      handleUpdateTokenSaleProposal(
        currentProposalIndex,
        "whitelistAddresses",
        textFiltered
      )
    } catch (error) {
      console.log(error)
    }
    touchField("whitelistAddressesValid")
  }, [handleUpdateTokenSaleProposal, currentProposalIndex, touchField])

  const handleCopyWhitelist = useCallback(
    (idx: number) => {
      const whitelistFromAnotherTokenSell =
        tokenSaleProposals[idx].whitelistAddresses

      handleUpdateTokenSaleProposal(
        currentProposalIndex,
        "whitelistAddresses",
        whitelistFromAnotherTokenSell
      )
    },
    [tokenSaleProposals, handleUpdateTokenSaleProposal, currentProposalIndex]
  )

  return (
    <>
      <CreatingProposalSuccessModal />
      <SForms.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.users} />}
            title="Додати вайтліст"
            nodeRight={
              <Switch
                isOn={isWhitelist}
                onChange={(n, v) =>
                  handleUpdateTokenSaleProposal(
                    currentProposalIndex,
                    "isWhitelist",
                    v
                  )
                }
                name={"token-sale-is-whitelist"}
              />
            }
          />
          <CardDescription>
            <p>
              описать что можно добавить паком адресса в формате через запятую
            </p>
          </CardDescription>
          {isWhitelist && (
            <CardFormControl>
              <Collapse isOpen={isWhitelist}>
                {tokenSaleProposals.map(({ whitelistAddresses }, index) => {
                  if (
                    !isWhitelist ||
                    whitelistAddresses.filter((el) => isAddress(el)).length !==
                      whitelistAddresses.length ||
                    whitelistAddresses.length === 0
                  )
                    return null

                  if (index === currentProposalIndex) return null

                  return (
                    <AppButton
                      key={index}
                      color="default"
                      size="no-paddings"
                      text={`Використовувати вайтліст з ${
                        index + 1
                      } токенсейлу`}
                      onClick={() => handleCopyWhitelist(index)}
                      style={{ marginBottom: "16px" }}
                    />
                  )
                })}
                <InputField
                  readonly
                  value={whitelistAddresses
                    .map((el) => shortenAddress(el))
                    .join(", ")}
                  label={"addresses"}
                  nodeRight={
                    <AppButton
                      color="default"
                      size="no-paddings"
                      text="Paste"
                      onClick={handlePasteAddresses}
                    />
                  }
                  errorMessage={getFieldErrorMessage("whitelistAddressesValid")}
                />
              </Collapse>
            </CardFormControl>
          )}
        </Card>
      </SForms.StepsRoot>
      <SForms.FormStepsNavigationWrp
        customNextCb={handleNextStep}
        nextLabel={"Create proposal"}
      />
    </>
  )
}

export { WhitelistStep }
