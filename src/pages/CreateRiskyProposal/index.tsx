import { Center } from "theme"
import { Route, Routes, useParams } from "react-router-dom"

import { Wrapper } from "./styled"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { GuardSpinner } from "react-spinners-kit"

import Faq from "pages/CreateRiskyProposal/components/Faq"
import Form from "./components/Form"
import CreateRiskyProposalContextProvider from "context/fund/CreateRiskyProposalContext"
import Header from "components/Header/Layout"

const CreateRiskyProposalWithProvider = () => {
  const { poolAddress } = useParams()

  return (
    <WithPoolAddressValidation
      poolAddress={poolAddress ?? ""}
      loader={
        <Center>
          <GuardSpinner size={20} loading />
        </Center>
      }
    >
      <Header>Create risky proposal</Header>

      <CreateRiskyProposalContextProvider>
        <Wrapper>
          <Routes>
            <Route path="faq" element={<Faq />} />
            <Route path="create" element={<Form />} />
          </Routes>
        </Wrapper>
      </CreateRiskyProposalContextProvider>
    </WithPoolAddressValidation>
  )
}

export default CreateRiskyProposalWithProvider
