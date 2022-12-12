import CreateInsuranceAccidentForm from "forms/CreateInsuranceAccidentForm"
import InsuranceAccidentCreatingContextProvider from "context/InsuranceAccidentCreatingContext"

import { Container } from "./styled"
import Header from "components/Header/Layout"
import { useWeb3React } from "@web3-react/core"

const InsuranceCreate = () => {
  const { account } = useWeb3React()
  return (
    <>
      <Header>Proposal create</Header>
      <Container>
        <InsuranceAccidentCreatingContextProvider
          customLSKey={`${account}-creating-new-dao-proposal-insurance-accident`}
        >
          <CreateInsuranceAccidentForm />
        </InsuranceAccidentCreatingContextProvider>
      </Container>
    </>
  )
}

export default InsuranceCreate
