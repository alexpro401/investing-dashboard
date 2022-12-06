import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import Header from "components/Header/Layout"
import { Routes, Route, useParams, Navigate } from "react-router-dom"
import DaoProposalsList from "pages/DaoProposals/DaoProposalsList"
import * as React from "react"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposals: FC<Props> = () => {
  const { daoAddress } = useParams()

  const TABS = [
    {
      title: "Opened voting",
      source: `/dao/${daoAddress}/proposals/opened`,
    },
    {
      title: "Ended voting",
      source: `/dao/${daoAddress}/proposals/ended`,
    },
    {
      title: "Completed",
      source: `/dao/${daoAddress}/proposals/completed`,
    },
  ]

  const ENDED_TABS = [
    {
      title: "Passed",
      source: `/dao/${daoAddress}/proposals/ended/passed`,
    },
    {
      title: "Rejected",
      source: `/dao/${daoAddress}/proposals/ended/rejected`,
    },
  ]

  const COMPLETED_TABS = [
    {
      title: "All",
      source: `/dao/${daoAddress}/proposals/completed/all`,
    },
    {
      title: "Rewards",
      source: `/dao/${daoAddress}/proposals/completed/rewards`,
    },
  ]

  return (
    <>
      <Header tabs={TABS}>All Proposals</Header>
      <S.Root>
        <Routes>
          <Route
            path="opened"
            element={
              <DaoProposalsList govPoolAddress={daoAddress} status="opened" />
            }
          />
          <Route
            path="ended"
            element={
              <Navigate
                replace
                to={`/dao/${daoAddress}/proposals/ended/passed`}
              />
            }
          />
          <Route
            path="/ended/passed"
            element={
              <>
                <S.PageSubTabs tabs={ENDED_TABS} />
                <DaoProposalsList
                  govPoolAddress={daoAddress}
                  status="ended-passed"
                />
              </>
            }
          />
          <Route
            path="/ended/rejected"
            element={
              <>
                <S.PageSubTabs tabs={ENDED_TABS} />
                <DaoProposalsList
                  govPoolAddress={daoAddress}
                  status="ended-rejected"
                />
              </>
            }
          />
          <Route
            path="completed"
            element={
              <Navigate
                replace
                to={`/dao/${daoAddress}/proposals/completed/all`}
              />
            }
          />

          <Route
            path="/completed/all"
            element={
              <>
                <S.PageSubTabs tabs={COMPLETED_TABS} />
                <DaoProposalsList
                  govPoolAddress={daoAddress}
                  status="completed-all"
                />
              </>
            }
          />
          <Route
            path="/completed/rewards"
            element={
              <>
                <S.PageSubTabs tabs={COMPLETED_TABS} />
                <DaoProposalsList
                  govPoolAddress={daoAddress}
                  status="completed-rewards"
                />
              </>
            }
          />
        </Routes>
      </S.Root>
    </>
  )
}

export default DaoProposals
