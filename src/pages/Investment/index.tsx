import { Routes, Route } from "react-router-dom"

import { ITab } from "interfaces"

import InvestmentPositions from "pages/InvestmentPositions"
import InvestmentRiskyProposals from "pages/InvestmentRiskyProposals"
import InvestmentInvestProposals from "pages/InvestmentInvestProposals"

import Header from "components/Header/Layout"

import * as S from "./styled"
import { useBreakpoints } from "hooks"

const InvestPositions = () => {
  const { isMobile } = useBreakpoints()

  const TABS: ITab[] = [
    {
      title: "My positions",
      source: "/investment/positions/open",
      activeSource: [
        "/investment/positions/open",
        "/investment/positions/closed",
      ],
    },
    {
      title: "Risk proposals",
      source: "/investment/risk-proposals/open",
      activeSource: [
        "/investment/risk-proposals/open",
        "/investment/risk-proposals/positions",
        "/investment/risk-proposals/closed",
      ],
    },
    {
      title: "Investment",
      source: `/investment/invest-proposals/new`,
      activeSource: [
        "/investment/invest-proposals/new",
        "/investment/invest-proposals/invested",
      ],
    },
  ]

  return (
    <>
      <Header>{isMobile && "My investment"}</Header>
      <S.Root>
        <S.HeadContainer>
          <S.PageTitle>All Proposals</S.PageTitle>
          <S.PageHeadTabs tabs={TABS} />
        </S.HeadContainer>
        <Routes>
          <Route path="positions/*" element={<InvestmentPositions />}></Route>
          <Route
            path="risk-proposals/*"
            element={<InvestmentRiskyProposals />}
          ></Route>
          <Route
            path="invest-proposals/*"
            element={<InvestmentInvestProposals />}
          ></Route>
        </Routes>
      </S.Root>
    </>
  )
}

export default InvestPositions
