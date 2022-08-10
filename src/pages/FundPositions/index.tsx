import { Routes, Route, useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"

import Header from "components/Header/Layout"

import FundProposals from "pages/FundProposals"
import FundPositionsList from "./FundPositionsList"

import S from "./styled"

const AllPoolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
  requestPolicy: "network-only", // disable urql cache
})

const FundPositions = () => {
  const { poolAddress } = useParams()

  return (
    <>
      <Header
        tabs={[
          {
            title: "Open positions",
            source: `/fund-positions/${poolAddress}/open`,
          },
          {
            title: "Proposals",
            source: `/fund-positions/${poolAddress}/proposals/open`,
            activeSource: [
              `/fund-positions/${poolAddress}/proposals/open`,
              `/fund-positions/${poolAddress}/proposals/positions`,
              `/fund-positions/${poolAddress}/proposals/closed`,
            ],
          },
          {
            title: "Closed positions",
            source: `/fund-positions/${poolAddress}/closed`,
          },
        ]}
      >
        Fund Positions
      </Header>
      <S.Container>
        <Routes>
          <Route path="open" element={<FundPositionsList closed={false} />} />
          <Route path="proposals/*" element={<FundProposals />} />
          <Route path="closed" element={<FundPositionsList closed={true} />} />
        </Routes>
      </S.Container>
    </>
  )
}

const FundPositionsWithProvider = () => (
  <GraphProvider value={AllPoolsClient}>
    <FundPositions />
  </GraphProvider>
)

export default FundPositionsWithProvider
