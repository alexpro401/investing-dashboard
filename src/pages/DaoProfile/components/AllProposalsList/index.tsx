import React, { useState, useMemo } from "react"
import { useParams } from "react-router-dom"

import { DaoProposalsList } from "common"

import * as S from "./styled"

type FirstLevelTab = "opened" | "ended" | "completed"

type EndedLevelTab = "passed" | "rejected"

type CompletedLevelTab = "all" | "rewards"

const AllProposalsList: React.FC = () => {
  const { daoAddress } = useParams()

  const [firstLevelSelectedTab, setFirstLevelSelectedTab] =
    useState<FirstLevelTab>("opened")
  const [endedSelectedTab, setEndedSelectedTab] =
    useState<EndedLevelTab>("passed")
  const [completedSelectedTab, setCompletedSelectedTab] =
    useState<CompletedLevelTab>("all")

  const FIRST_LEVEL_TABS = useMemo(
    () => [
      {
        title: "Opened voting",
        isActive: firstLevelSelectedTab === "opened",
        onClick: () => setFirstLevelSelectedTab("opened"),
      },
      {
        title: "Ended voting",
        isActive: firstLevelSelectedTab === "ended",
        onClick: () => setFirstLevelSelectedTab("ended"),
      },
      {
        title: "Completed",
        isActive: firstLevelSelectedTab === "completed",
        onClick: () => setFirstLevelSelectedTab("completed"),
      },
    ],
    [firstLevelSelectedTab]
  )

  const ENDED_TABS = useMemo(
    () => [
      {
        title: "Passed",
        isActive: endedSelectedTab === "passed",
        onClick: () => setEndedSelectedTab("passed"),
      },
      {
        title: "Rejected",
        isActive: endedSelectedTab === "rejected",
        onClick: () => setEndedSelectedTab("rejected"),
      },
    ],
    [endedSelectedTab]
  )

  const COMPLETED_TABS = useMemo(
    () => [
      {
        title: "All",
        isActive: completedSelectedTab === "all",
        onClick: () => setCompletedSelectedTab("all"),
      },
      {
        title: "Rewards",
        isActive: completedSelectedTab === "rewards",
        onClick: () => setCompletedSelectedTab("rewards"),
      },
    ],
    [completedSelectedTab]
  )

  return (
    <S.Root>
      <S.HeaderTabsWrp tabs={FIRST_LEVEL_TABS} />
      {firstLevelSelectedTab === "opened" && (
        <DaoProposalsList govPoolAddress={daoAddress} status="opened" />
      )}
      {firstLevelSelectedTab === "ended" && (
        <>
          <S.PageSubTabs tabs={ENDED_TABS} />
          {endedSelectedTab === "passed" && (
            <DaoProposalsList
              govPoolAddress={daoAddress}
              status="ended-passed"
            />
          )}
          {endedSelectedTab === "rejected" && (
            <DaoProposalsList
              govPoolAddress={daoAddress}
              status="ended-rejected"
            />
          )}
        </>
      )}
      {firstLevelSelectedTab === "completed" && (
        <>
          <S.PageSubTabs tabs={COMPLETED_TABS} />
          {completedSelectedTab === "all" && (
            <DaoProposalsList
              govPoolAddress={daoAddress}
              status="completed-all"
            />
          )}
          {completedSelectedTab === "rewards" && (
            <DaoProposalsList
              govPoolAddress={daoAddress}
              status="completed-rewards"
            />
          )}
        </>
      )}
    </S.Root>
  )
}

export default AllProposalsList
