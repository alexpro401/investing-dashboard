import * as React from "react"

import { Container, Indents, Action, List } from "./styled"

import Header from "components/Header/Layout"
import RouteTabs from "components/RouteTabs"
import { ITab } from "interfaces"
import tutorialImageSrc from "assets/others/create-fund-docs.png"
import TutorialCard from "components/TutorialCard"
import DaoPoolsList from "./components/DaoPoolsList"
import { Route, Routes } from "react-router-dom"

const DaoPools: React.FC = () => {
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
          <Routes>
            <Route path={"top"} element={<DaoPoolsList />} />
            <Route path={"voting-power"} element={<DaoPoolsList />} />
          </Routes>
        </List.Container>
      </Container>
    </>
  )
}

export default DaoPools
