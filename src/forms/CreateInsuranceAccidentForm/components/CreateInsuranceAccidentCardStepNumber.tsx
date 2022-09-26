import { FC } from "react"
import { CreateInsuranceAccidentCard as CIACard } from "forms/CreateInsuranceAccidentForm/styled"

interface Props {
  number: number
}

const CreateInsuranceAccidentCardStepNumber: FC<Props> = ({ number }) => {
  return (
    <CIACard.NumberIcon>
      <CIACard.NumberIconText>{number}</CIACard.NumberIconText>
    </CIACard.NumberIcon>
  )
}

export default CreateInsuranceAccidentCardStepNumber
