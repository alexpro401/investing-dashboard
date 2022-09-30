import { FC, HTMLAttributes, ReactNode, useContext, useMemo } from "react"

import * as S from "./styled"
import { stepsControllerContext } from "context/StepsControllerContext"
import { ICON_NAMES } from "constants/icon-names"

interface Props extends HTMLAttributes<HTMLDivElement> {
  nodeLeft?: ReactNode
  nodeRight?: ReactNode

  customPrevCb?: () => void
  customNextCb?: () => void

  prevLabel?: string
  nextLabel?: string
}

const StepsNavigation: FC<Props> = ({
  nodeLeft,
  nodeRight,
  customPrevCb,
  customNextCb,
  prevLabel,
  nextLabel,
  ...rest
}) => {
  const { prevCb, nextCb, totalStepsAmount, currentStepNumber } = useContext(
    stepsControllerContext
  )

  const progress = useMemo(
    () => (currentStepNumber / totalStepsAmount) * 100,
    [currentStepNumber, totalStepsAmount]
  )

  const prevAction = useMemo(
    () => customPrevCb || prevCb,
    [customPrevCb, prevCb]
  )

  const nextAction = useMemo(
    () => customNextCb || nextCb,
    [customNextCb, nextCb]
  )

  return (
    <S.Root {...rest}>
      <S.StepsNavigationProgress progress={progress} />
      <S.StepsNavigationActions>
        <>
          {nodeLeft ? (
            { nodeLeft }
          ) : (
            <S.StepsNavigationButton
              scheme="filled"
              color="default"
              iconLeft={ICON_NAMES.angleLeftOutlined}
              iconSize={22}
              onClick={() => prevAction()}
              text={prevLabel || "Back"}
            />
          )}
          {nodeRight ? (
            nodeRight
          ) : (
            <S.StepsNavigationButton
              scheme="filled"
              color="default"
              iconRight={ICON_NAMES.angleRightOutlined}
              iconSize={22}
              onClick={() => nextAction()}
              text={nextLabel || "Continue"}
              isActive
            />
          )}
        </>
      </S.StepsNavigationActions>
    </S.Root>
  )
}

export default StepsNavigation
