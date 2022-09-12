import { Routes, Route } from "react-router-dom"
import { RequestDividendsProvider } from "modals/RequestDividend/useRequestDividendsContext"
import Proposals from "./Proposals"

const FundProposalsInvest = () => {
  return (
    <>
      <RequestDividendsProvider>
        <Routes>
          <Route path="open" element={<Proposals />}></Route>
        </Routes>
      </RequestDividendsProvider>
    </>
  )
}

export default FundProposalsInvest
