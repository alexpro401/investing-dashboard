import { Routes, Route, generatePath, Navigate } from "react-router-dom"

import Header from "components/Header/Layout"
import {
  InvestorPoolPositionsList,
  InvestorRiskyPositionsList,
  InvestorRiskyProposalsList,
  InvestorInvestProposalsList,
} from "common"

import * as S from "./styled"
import { useBreakpoints } from "hooks"
import { ROUTE_PATHS } from "consts"

const InvestorPositions = () => {
  const { isMobile } = useBreakpoints()

  const TABS = [
    {
      title: "My positions",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "positions",
      }),
    },
    {
      title: "Risk proposals",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "risk-proposals",
      }),
    },
    {
      title: "Invest proposals",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "invest-proposals",
      }),
    },
  ]

  const POSITIONS_TABS = [
    {
      title: "Open",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "positions/open",
      }),
    },
    {
      title: "Closed",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "positions/closed",
      }),
    },
  ]

  const RISKY_PROPOSALS_TABS = [
    {
      title: "Open",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "risk-proposals/open",
      }),
    },
    {
      title: "Positions",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "risk-proposals/positions",
      }),
    },
    {
      title: "Closed",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "risk-proposals/closed",
      }),
    },
  ]

  const INVEST_PROPOSALS_TABS = [
    {
      title: "New",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "invest-proposals/new",
      }),
    },
    {
      title: "Invested",
      source: generatePath(ROUTE_PATHS.investment, {
        "*": "invest-proposals/Invested",
      }),
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
          <>
            <Route
              path="positions"
              element={
                <Navigate
                  replace
                  to={generatePath(ROUTE_PATHS.investment, {
                    "*": "positions/open",
                  })}
                />
              }
            />
            <Route
              path="positions/open"
              element={
                <>
                  <S.PageSubTabs tabs={POSITIONS_TABS} />
                  <InvestorPoolPositionsList closed={false} />
                </>
              }
            />
            <Route
              path="positions/closed"
              element={
                <>
                  <S.PageSubTabs tabs={POSITIONS_TABS} />
                  <InvestorPoolPositionsList closed={true} />
                </>
              }
            />
          </>
          <>
            <Route
              path="risk-proposals"
              element={
                <Navigate
                  replace
                  to={generatePath(ROUTE_PATHS.investment, {
                    "*": "risk-proposals/open",
                  })}
                />
              }
            />
            <Route
              path="risk-proposals/open"
              element={
                <>
                  <S.PageSubTabs tabs={RISKY_PROPOSALS_TABS} />
                  <InvestorRiskyProposalsList />
                </>
              }
            />
            <Route
              path="risk-proposals/positions"
              element={
                <>
                  <S.PageSubTabs tabs={RISKY_PROPOSALS_TABS} />
                  <InvestorRiskyPositionsList closed={false} />
                </>
              }
            />
            <Route
              path="risk-proposals/closed"
              element={
                <>
                  <S.PageSubTabs tabs={RISKY_PROPOSALS_TABS} />
                  <InvestorRiskyPositionsList closed={true} />
                </>
              }
            />
          </>
          <>
            <Route
              path="invest-proposals"
              element={
                <Navigate
                  replace
                  to={generatePath(ROUTE_PATHS.investment, {
                    "*": "invest-proposals/new",
                  })}
                />
              }
            />
            <Route
              path="invest-proposals/new"
              element={
                <>
                  <S.PageSubTabs tabs={INVEST_PROPOSALS_TABS} />
                  <InvestorInvestProposalsList invested={false} />
                </>
              }
            />
            <Route
              path="invest-proposals/invested"
              element={
                <>
                  <S.PageSubTabs tabs={INVEST_PROPOSALS_TABS} />
                  <InvestorInvestProposalsList invested={true} />
                </>
              }
            />
          </>
          <Route path="/" element={<Navigate replace to={TABS[0].source} />} />
        </Routes>
      </S.Root>
    </>
  )
}

export default InvestorPositions
