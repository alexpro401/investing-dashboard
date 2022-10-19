import React, { useContext } from "react"

import { StepsNavigation } from "common"
import { stepsControllerContext } from "context/StepsControllerContext"

import * as S from "../styled"

const ChangeDAOSettings: React.FC = () => {
  const { currentStepNumber } = useContext(stepsControllerContext)

  return (
    <>
      <p>123</p>
      <StepsNavigation />
    </>
  )
}

export default ChangeDAOSettings
