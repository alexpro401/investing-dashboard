import React, { useContext } from "react"

import { Icon } from "common"
import { stepsControllerContext } from "context/StepsControllerContext"
import { ICON_NAMES } from "consts"
import TokenSaleProposalsNavigation from "./TokenSaleProposalsNavigation"
import AddTokenSaleButton from "./AddTokenSaleButton"

import * as S from "./styled"

const SideBarNavigation: React.FC = () => {
  const { currentStepNumber } = useContext(stepsControllerContext)

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
      <TokenSaleProposalsNavigation />
      <AddTokenSaleButton />
    </S.SideBarNavigationWrapper>
  )
}

export default SideBarNavigation
