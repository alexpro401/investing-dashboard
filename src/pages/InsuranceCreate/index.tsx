import CreateInsuranceAccidentForm from "forms/CreateInsuranceAccidentForm"
import InsuranceAccidentCreatingContextProvider from "context/InsuranceAccidentCreatingContext"

import { Container } from "./styled"
import Header from "components/Header/Layout"

const InsuranceCreate = () => {
  return (
    <>
      <Header>Proposal create</Header>
      <Container>
        <InsuranceAccidentCreatingContextProvider>
          <CreateInsuranceAccidentForm />
        </InsuranceAccidentCreatingContextProvider>
      </Container>
    </>
  )
}

export default InsuranceCreate
