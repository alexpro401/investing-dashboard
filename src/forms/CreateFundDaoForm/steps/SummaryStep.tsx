import { FC, HTMLAttributes, useCallback, useContext } from "react"
import { GovPoolFormContext } from "context/govPool/GovPoolFormContext"
import { stepsControllerContext } from "context/StepsControllerContext"

import * as S from "./styled"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const SummaryStep: FC<Props> = ({ ...rest }) => {
  const daoPoolFormContext = useContext(GovPoolFormContext)

  const { nextCb } = useContext(stepsControllerContext)

  const handleNextStep = useCallback(() => {
    nextCb()
  }, [nextCb])

  return (
    <>
      <S.StepsRoot {...rest}></S.StepsRoot>
      <S.FormStepsNavigationWrp customNextCb={handleNextStep} />
    </>
  )
}

export default SummaryStep
