import CreateInsuranceAccidentForm from "forms/CreateInsuranceAccidentForm"
import InsuranceAccidentCreatingContextProvider from "context/InsuranceAccidentCreatingContext"

import { Container } from "./styled"

const InsuranceCreate = () => {
  return (
    <>
      <Container>
        <InsuranceAccidentCreatingContextProvider>
          <CreateInsuranceAccidentForm />
        </InsuranceAccidentCreatingContextProvider>
      </Container>
    </>
  )
}

export default InsuranceCreate
