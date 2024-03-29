import * as S from "./styled"

import { FC, HTMLAttributes } from "react"
import Header from "components/Header/Layout"
import {
  useParams,
  Navigate,
  generatePath,
  Route,
  Routes,
} from "react-router-dom"
import { DaoProposalsList } from "common"
import { ROUTE_PATHS } from "consts"

interface Props extends HTMLAttributes<HTMLDivElement> {}

const DaoProposals: FC<Props> = () => {
  const { daoAddress } = useParams()

  const TABS = [
    {
      title: "Opened voting",
      source: generatePath(ROUTE_PATHS.daoProposalList, {
        daoAddress: daoAddress!,
        "*": "opened",
      }),
    },
    {
      title: "Ended voting",
      source: generatePath(ROUTE_PATHS.daoProposalList, {
        daoAddress: daoAddress!,
        "*": "ended",
      }),
    },
    {
      title: "Completed",
      source: generatePath(ROUTE_PATHS.daoProposalList, {
        daoAddress: daoAddress!,
        "*": "completed",
      }),
    },
  ]

  const ENDED_TABS = [
    {
      title: "Passed",
      source: generatePath(ROUTE_PATHS.daoProposalList, {
        daoAddress: daoAddress!,
        "*": "ended/passed",
      }),
    },
    {
      title: "Rejected",
      source: generatePath(ROUTE_PATHS.daoProposalList, {
        daoAddress: daoAddress!,
        "*": "ended/rejected",
      }),
    },
  ]

  const COMPLETED_TABS = [
    {
      title: "All",
      source: generatePath(ROUTE_PATHS.daoProposalList, {
        daoAddress: daoAddress!,
        "*": "completed/all",
      }),
    },
    {
      title: "Rewards",
      source: generatePath(ROUTE_PATHS.daoProposalList, {
        daoAddress: daoAddress!,
        "*": "completed/rewards",
      }),
    },
  ]

  return (
    <>
      <Header />
      <S.Root>
        <S.HeadContainer>
          <S.PageHeadTabs tabs={TABS} />
        </S.HeadContainer>
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
                to={generatePath(ROUTE_PATHS.daoProposalList, {
                  daoAddress: daoAddress!,
                  "*": "ended/passed",
                })}
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
                to={generatePath(ROUTE_PATHS.daoProposalList, {
                  daoAddress: daoAddress!,
                  "*": "completed/all",
                })}
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
          <Route path="*" element={<Navigate replace to={TABS[0].source} />} />
        </Routes>
      </S.Root>
    </>
  )
}

export default DaoProposals
