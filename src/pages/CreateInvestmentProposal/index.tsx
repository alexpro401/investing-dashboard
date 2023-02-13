import { Route, Routes, useParams } from "react-router-dom"

import { Center } from "theme"
import Header from "components/Header/Layout"

import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { GuardSpinner } from "react-spinners-kit"
import CreateInvestProposalContextProvider from "context/fund/CreateInvestProposalContext"
import Faq from "./components/Faq"
import Form from "./components/Form"

const CreateInvestmentProposalWithProvider = () => {
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
      <Header>Create invest proposal</Header>

      <CreateInvestProposalContextProvider>
        <Routes>
          <Route path="faq" element={<Faq />} />
          <Route path="create" element={<Form />} />
        </Routes>
      </CreateInvestProposalContextProvider>
    </WithPoolAddressValidation>
  )
}

export default CreateInvestmentProposalWithProvider
