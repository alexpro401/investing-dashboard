import { FC, HTMLAttributes, useMemo } from "react"
import { Flex } from "theme"

import * as S from "forms/CreateInsuranceAccidentForm/styled/steps"
import { ICON_NAMES } from "constants/icon-names"
import { appeareFromLeftVariants } from "motion/variants"

interface Props extends HTMLAttributes<HTMLDivElement> {
  totalStepsCount: number
  currentStepNumber: number
  nextCb: () => void
  prevCb: () => void
}

const CreateInsuranceAccidentStepsController: FC<Props> = ({
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
      <S.StepsProgress progress={progress} />
      <Flex jc="space-between" full p="25px">
        <S.StepsControllerButton
          variants={appeareFromLeftVariants}
          initial="hidden"
          animate={currentStepNumber > 1 ? "visible" : "hidden"}
          onClick={prevCb}
        >
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

export default CreateInsuranceAccidentStepsController
