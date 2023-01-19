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
import Switch from "components/Switch"
import { ICON_NAMES } from "consts"

import * as SForms from "common/FormSteps/styled"
import { readFromClipboard } from "utils/clipboard"
import { isAddress, shortenAddress } from "utils"

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

  return (
    <>
      <SForms.StepsRoot>
        <Card>
          <CardHead
            nodeLeft={<Icon name={ICON_NAMES.users} />}
            title="Add validator"
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
      <SForms.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export { WhitelistStep }
