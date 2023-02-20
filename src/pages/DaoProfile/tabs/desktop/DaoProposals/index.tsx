import { DaoProposalsList } from "common"

import {
  generatePath,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom"
import { ROUTE_PATHS } from "consts"

import * as S from "pages/GovPoolProposals/DaoProposals/styled"

export const DaoProposals = () => {
  const { daoAddress } = useParams()

  const TABS = [
    {
      title: "Opened voting",
      source: generatePath(ROUTE_PATHS.daoProfile, {
        daoAddress: daoAddress!,
        "*": "dao-proposals",
      }).concat("/opened"),
    },
    {
      title: "Ended voting",
      source: generatePath(ROUTE_PATHS.daoProfile, {
        daoAddress: daoAddress!,
        "*": "dao-proposals",
      }).concat("/ended"),
    },
    {
      title: "Completed",
      source: generatePath(ROUTE_PATHS.daoProfile, {
        daoAddress: daoAddress!,
        "*": "dao-proposals",
      }).concat("/completed"),
    },
  ]

  const ENDED_TABS = [
    {
      title: "Passed",
      source: generatePath(ROUTE_PATHS.daoProfile, {
        daoAddress: daoAddress!,
        "*": "dao-proposals",
      }).concat("/ended/passed"),
    },
    {
      title: "Rejected",
      source: generatePath(ROUTE_PATHS.daoProfile, {
        daoAddress: daoAddress!,
        "*": "dao-proposals",
      }).concat("/ended/rejected"),
    },
  ]

  const COMPLETED_TABS = [
    {
      title: "All",
      source: generatePath(ROUTE_PATHS.daoProfile, {
        daoAddress: daoAddress!,
        "*": "dao-proposals",
      }).concat("/completed/all"),
    },
    {
      title: "Rewards",
      source: generatePath(ROUTE_PATHS.daoProfile, {
        daoAddress: daoAddress!,
        "*": "dao-proposals",
      }).concat("/completed/rewards"),
    },
  ]

  return (
    <>
      <S.Root>
        <S.HeadContainer>
          <S.PageHeadTabs tabs={TABS} />
        </S.HeadContainer>
        <Routes>
          <Route path="*" element={<Navigate replace to={TABS[0].source} />} />

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
                to={generatePath(ROUTE_PATHS.daoProfile, {
                  daoAddress: daoAddress!,
                  "*": "dao-proposals",
                }).concat("/ended/passed")}
              />
            }
          />
          <Route
            path="ended/passed"
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
            path="ended/rejected"
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
                to={generatePath(ROUTE_PATHS.daoProfile, {
                  daoAddress: daoAddress!,
                  "*": "dao-proposals",
                }).concat("/completed/all")}
              />
            }
          />

          <Route
            path="completed/all"
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
            path="completed/rewards"
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
