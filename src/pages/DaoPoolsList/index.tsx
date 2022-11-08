import * as React from "react"
import { isEmpty, isNil } from "lodash"
import { Route, Routes } from "react-router-dom"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { Container, Indents, Action, List } from "./styled"

import Header from "components/Header/Layout"
import RouteTabs from "components/RouteTabs"
import { ITab } from "interfaces"
import DaoPoolsListFiltered from "./List"
import tutorialImageSrc from "assets/others/create-fund-docs.png"
import TutorialCard from "components/TutorialCard"

const DaoPoolsList: React.FC = () => {
  const loading = true
  const pools = [] as { id: string }[]

  const scrollRef = React.useRef(null)
  React.useEffect(() => {
    if (!scrollRef.current) return
    disableBodyScroll(scrollRef.current)

    return () => clearAllBodyScrollLocks()
  }, [scrollRef])

  const tabs: ITab[] = [
    {
      title: "TOP DAO",
      source: "/dao/list/top",
    },
    {
      title: "Voting power",
      source: `/dao/list/voting-power`,
    },
  ]

  return (
    <>
      <Header>DAO</Header>
      <Container>
        <Indents top={false}>
          <TutorialCard
            text="Create unique DAO in 5 steps, manage through proposals, get rewards"
            linkText="Read the tutorial"
            imageSrc={tutorialImageSrc}
            href="https://dexe.network/"
          />
        </Indents>
        <List.Container>
          <Indents>
            <List.Header>
              <RouteTabs m="0" tabs={tabs} />
              <Action text="+ Create new" routePath="/create-fund" />
            </List.Header>
          </Indents>
          <List.Scroll ref={scrollRef} center={isNil(pools) || isEmpty(pools)}>
            <Routes>
              <Route
                path="top"
                element={
                  <DaoPoolsListFiltered pools={pools} loading={loading} />
                }
              />
              <Route
                path="voting-power"
                element={
                  <DaoPoolsListFiltered pools={pools} loading={loading} />
                }
              />
            </Routes>
          </List.Scroll>
        </List.Container>
      </Container>
    </>
  )
}

export default DaoPoolsList
