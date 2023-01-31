import { Routes, Route, useParams } from "react-router-dom"

import Header from "components/Header/Layout"

import FundProposals from "pages/FundProposals"
import FundPositionsList from "./FundPositionsList"

import * as S from "./styled"
import { Center } from "theme"
import { GuardSpinner } from "react-spinners-kit"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { useBreakpoints } from "hooks"

const FundPositions = () => {
  const { poolAddress } = useParams()
  const { isMobile } = useBreakpoints()

  const TABS = [
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
  ]

  return (
    <>
      <Header>{isMobile && "Fund Positions"}</Header>
      <S.Root>
        <WithPoolAddressValidation
          poolAddress={poolAddress ?? ""}
          loader={
            <Center>
              <GuardSpinner size={20} loading />
            </Center>
          }
        >
          <S.HeadContainer>
            <S.PageTitle>All Proposals</S.PageTitle>
            <S.PageHeadTabs tabs={TABS} />
          </S.HeadContainer>
          <Routes>
            <Route path="open" element={<FundPositionsList closed={false} />} />
            <Route path="proposals/*" element={<FundProposals />} />
            <Route
              path="closed"
              element={<FundPositionsList closed={true} />}
            />
          </Routes>
        </WithPoolAddressValidation>
      </S.Root>
    </>
  )
}

export default FundPositions
