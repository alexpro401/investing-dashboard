import { FC, HTMLAttributes, useCallback } from "react"
import { Icon } from "common"

import * as S from "./styled"
import { ICON_NAMES } from "constants/icon-names"

interface Props extends HTMLAttributes<HTMLDivElement> {
  steps: { title: string; number: number }[]
  currentStep: number
}

const SideStepsNavigationBar: FC<Props> = ({ steps, currentStep, ...rest }) => {
  const isStepPassed = useCallback(
    (step: number) => {
      return (
        Object.values(steps)
          .map((el) => el.number)
          .indexOf(step) <
        Object.values(steps)
          .map((el) => el.number)
          .indexOf(currentStep)
      )
    },
    [currentStep, steps]
  )

  return (
    <S.SideStepsNavigationBar {...rest}>
      {steps.map((el, idx) => (
        <S.SideStepsNavigationBarItem
          key={idx}
          isPassed={isStepPassed(el.number)}
          isActive={el.number === currentStep}
        >
          <S.SideStepsNavigationBarItemIcon
            isPassed={isStepPassed(el.number)}
            isActive={el.number === currentStep}
          >
            {isStepPassed(el.number) ? (
              <Icon name={ICON_NAMES.gradientCheck} />
            ) : (
              <>{idx + 1}</>
            )}
          </S.SideStepsNavigationBarItemIcon>
          <S.SideStepsNavigationBarItemText
            isPassed={isStepPassed(el.number)}
            isActive={el.number === currentStep}
          >
            {el.title}
          </S.SideStepsNavigationBarItemText>
        </S.SideStepsNavigationBarItem>
      ))}
    </S.SideStepsNavigationBar>
  )
}

export default SideStepsNavigationBar
