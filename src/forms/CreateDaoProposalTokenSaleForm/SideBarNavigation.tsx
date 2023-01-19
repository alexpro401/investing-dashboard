import React, { useContext, useMemo, useCallback } from "react"

import { Icon, Collapse } from "common"
import { stepsControllerContext } from "context/StepsControllerContext"
import { TokenSaleCreatingContext } from "context/govPool/proposals/TokenSaleContext"
import { ICON_NAMES } from "consts"

import * as S from "./styled"

const TOKEN_SELL_STEPS = [
  { stepNumber: 2, number: 1, text: "Настройка" },
  { stepNumber: 3, number: 2, text: "Параметри вестінгу" },
  { stepNumber: 4, number: 3, text: "Вайтліст" },
]

const SideBarNavigation: React.FC = () => {
  const { currentStepNumber, setStep } = useContext(stepsControllerContext)
  const {
    handleAddTokenSaleProposal,
    currentProposalIndex,
    setCurrentProposalIndex,
    settingsValidation,
    vestingValidation,
    whitelistValidation,
    tokenSaleProposals,
  } = useContext(TokenSaleCreatingContext)

  const actionsActive = useMemo(() => {
    if (currentStepNumber < 4) return false

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

  const handleSwitchAnotherTokenSale = useCallback(
    (idx: number) => {
      setCurrentProposalIndex(idx)
      if (setStep) {
        setStep(1)
      }
    },
    [setCurrentProposalIndex, setStep]
  )

  return (
    <S.SideBarNavigationWrapper>
      <S.SideStepsTitle>Create proposal</S.SideStepsTitle>
      <S.StepItem isActive={currentStepNumber === 1}>
        <S.StepIcon
          isPassed={currentStepNumber > 1}
          isActive={currentStepNumber === 1}
        >
          {currentStepNumber > 1 ? (
            <Icon name={ICON_NAMES.gradientCheck} />
          ) : (
            <>{1}</>
          )}
        </S.StepIcon>
        <span>Before you start</span>
      </S.StepItem>
      {tokenSaleProposals.map((_, index) => {
        if (index === currentProposalIndex) {
          return (
            <S.TokenSellProposalWrapper key={index}>
              <S.TokenSellProposalHeader>
                <S.TokenSellProposalHeaderLeft>
                  <S.TokenSellProposalTitle isSelected={currentStepNumber > 1}>
                    Token Sale №{index + 1}
                  </S.TokenSellProposalTitle>
                </S.TokenSellProposalHeaderLeft>
                <S.TokenSellProposalHeaderRight
                  isActive={currentStepNumber > 1}
                >
                  <Icon name={ICON_NAMES.angleUp} />
                </S.TokenSellProposalHeaderRight>
              </S.TokenSellProposalHeader>
              {currentStepNumber > 1 && (
                <Collapse isOpen style={{ width: "100%" }}>
                  <S.TokenSellSteps>
                    {TOKEN_SELL_STEPS.map(
                      ({ number, stepNumber, text }, index) => (
                        <S.TokenSellStep
                          isActive={currentStepNumber === stepNumber}
                          key={index}
                        >
                          <S.StepIcon
                            isPassed={currentStepNumber > stepNumber}
                            isActive={currentStepNumber === stepNumber}
                          >
                            {currentStepNumber > stepNumber ? (
                              <Icon name={ICON_NAMES.gradientCheck} />
                            ) : (
                              number
                            )}
                          </S.StepIcon>
                          <span>{text}</span>
                        </S.TokenSellStep>
                      )
                    )}
                  </S.TokenSellSteps>
                </Collapse>
              )}
            </S.TokenSellProposalWrapper>
          )
        }

        return (
          <S.TokenSellProposalWrapper
            key={index}
            isEnabled={actionsActive}
            onClick={
              actionsActive
                ? () => handleSwitchAnotherTokenSale(index)
                : () => {}
            }
          >
            <S.TokenSellProposalHeader>
              <S.TokenSellProposalHeaderLeft>
                <S.StepIcon isPassed={currentStepNumber > 1} isActive={false}>
                  <Icon name={ICON_NAMES.gradientCheck} />
                </S.StepIcon>
                <S.TokenSellProposalTitle isSelected={false}>
                  Token Sale №{index + 1}
                </S.TokenSellProposalTitle>
              </S.TokenSellProposalHeaderLeft>
              <S.TokenSellProposalHeaderRight isActive={false}>
                <Icon name={ICON_NAMES.angleUp} />
              </S.TokenSellProposalHeaderRight>
            </S.TokenSellProposalHeader>
          </S.TokenSellProposalWrapper>
        )
      })}
      <S.AddTokenSale isDisabled={!actionsActive} onClick={handleAddTokenSale}>
        <Icon name={ICON_NAMES.plusOutline} />
        <span>Додати токенсейл</span>
      </S.AddTokenSale>
    </S.SideBarNavigationWrapper>
  )
}

export default SideBarNavigation
