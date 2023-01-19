import React, { useContext, useCallback, useMemo } from "react"

import { stepsControllerContext } from "context/StepsControllerContext"
import { TokenSaleCreatingContext } from "context/govPool/proposals/TokenSaleContext"

import { Icon, Collapse } from "common"
import { ICON_NAMES } from "consts"

import * as S from "./styled"

const TOKEN_SELL_STEPS = [
  { stepNumber: 2, number: 1, text: "Настройка" },
  { stepNumber: 3, number: 2, text: "Параметри вестінгу" },
  { stepNumber: 4, number: 3, text: "Вайтліст" },
]

const TokenSaleProposalsNavigation: React.FC = () => {
  const {
    tokenSaleProposals,
    handleDeleteTokenSellProposal,
    setCurrentProposalIndex,
    currentProposalIndex,
    settingsValidation,
    vestingValidation,
    whitelistValidation,
  } = useContext(TokenSaleCreatingContext)
  const { currentStepNumber, setStep } = useContext(stepsControllerContext)

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

  const handleSwitchAnotherTokenSale = useCallback(
    (idx: number) => {
      setCurrentProposalIndex(idx)
      if (setStep) {
        setStep(1)
      }
    },
    [setCurrentProposalIndex, setStep]
  )

  const onDeleteTokenSellProposal = useCallback(
    (idx: number) => {
      setCurrentProposalIndex(0)
      handleDeleteTokenSellProposal(idx)
      if (setStep) {
        setStep(1)
      }
    },
    [handleDeleteTokenSellProposal, setStep, setCurrentProposalIndex]
  )

  return (
    <>
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
              {currentStepNumber > 1 && tokenSaleProposals.length !== 1 && (
                <S.DeleteTokenSellProposalButton
                  text={"Delete"}
                  onClick={() => onDeleteTokenSellProposal(index)}
                />
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
    </>
  )
}

export default TokenSaleProposalsNavigation
