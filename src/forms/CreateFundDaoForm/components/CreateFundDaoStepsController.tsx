import { FC, HTMLAttributes, useMemo } from "react"
import { Flex } from "theme"

import * as S from "../styled"
import { ICON_NAMES } from "constants/icon-names"
import { RoundedIcon } from "../styled"

interface Props extends HTMLAttributes<HTMLDivElement> {
  totalStepsCount: number
  currentStepNumber: number
  nextCb: () => void
  prevCb: () => void
}

const CreateFundDaoStepsController: FC<Props> = ({
  totalStepsCount,
  currentStepNumber,
  nextCb,
  prevCb,
}) => {
  const progress = useMemo(
    () => (currentStepNumber / totalStepsCount) * 100,
    [currentStepNumber, totalStepsCount]
  )

  return (
    <Flex dir="column" full>
      <S.CreateFundDaoStepsProgress progress={progress} />
      <Flex jc="space-between" full p="25px">
        <S.StepsControllerButton onClick={prevCb}>
          <S.RoundedIcon name={ICON_NAMES.angleLeft} />
          Back
        </S.StepsControllerButton>
        <S.StepsControllerButton isActive={true} onClick={nextCb}>
          Continue
          <S.RoundedIcon isActive={true} name={ICON_NAMES.angleRight} />
        </S.StepsControllerButton>
      </Flex>
    </Flex>
  )
}

export default CreateFundDaoStepsController
