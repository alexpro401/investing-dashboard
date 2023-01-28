import React, { useCallback, useMemo, useContext } from "react"

import { stepsControllerContext } from "context/StepsControllerContext"
import { TokenSaleCreatingContext } from "context/govPool/proposals/TokenSaleContext"

import { Icon } from "common"
import { ICON_NAMES } from "consts"

import * as S from "./styled"

const AddTokenSaleButton: React.FC = () => {
  const { currentStepNumber, setStep } = useContext(stepsControllerContext)
  const {
    handleAddTokenSaleProposal,
    setCurrentProposalIndex,
    settingsValidation,
    vestingValidation,
    whitelistValidation,
    tokenSaleProposals,
  } = useContext(TokenSaleCreatingContext)

  const actionsActive = useMemo(() => {
    if (currentStepNumber < 5) return false

    if (
      settingsValidation.isFieldsValid &&
      vestingValidation.isFieldsValid &&
      whitelistValidation.isFieldsValid
    )
      return true

    return false
  }, [
    settingsValidation,
    vestingValidation,
    whitelistValidation,
    currentStepNumber,
  ])

  const handleAddTokenSale = useCallback(() => {
    const prevProposalsLength = tokenSaleProposals.length

    handleAddTokenSaleProposal()
    setCurrentProposalIndex(prevProposalsLength - 1 + 1)
    if (setStep) {
      setStep(1)
    }
  }, [
    setCurrentProposalIndex,
    tokenSaleProposals,
    handleAddTokenSaleProposal,
    setStep,
  ])

  return (
    <S.AddTokenSale isDisabled={!actionsActive} onClick={handleAddTokenSale}>
      <Icon name={ICON_NAMES.plusOutline} />
      <span>Додати токенсейл</span>
    </S.AddTokenSale>
  )
}

export default AddTokenSaleButton
