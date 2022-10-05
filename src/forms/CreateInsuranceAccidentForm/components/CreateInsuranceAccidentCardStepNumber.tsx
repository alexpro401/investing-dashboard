import { FC } from "react"
import { StepNumber } from "forms/CreateInsuranceAccidentForm/styled"

interface Props {
  number: number
}

const CreateInsuranceAccidentCardStepNumber: FC<Props> = ({ number }) => {
  return (
    <StepNumber.Icon>
      <StepNumber.Text>{number}</StepNumber.Text>
    </StepNumber.Icon>
  )
}

export default CreateInsuranceAccidentCardStepNumber
