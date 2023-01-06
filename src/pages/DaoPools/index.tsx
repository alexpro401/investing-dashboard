import * as React from "react"

import * as S from "./styled"

import Header from "components/Header/Layout"
import { ITab } from "interfaces"
import tutorialImageSrc from "assets/others/create-fund-docs.png"
import TutorialCard from "components/TutorialCard"
import DaoPoolsList from "./components/DaoPoolsList"
import { generatePath, Navigate, Route, Routes } from "react-router-dom"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { useBreakpoints } from "hooks"
import { useState } from "react"

const DaoPools: React.FC = () => {
  const tabs: ITab[] = [
    {
      title: "TOP DAO",
      source: generatePath(ROUTE_PATHS.daoList, {
        "*": "top",
      }),
    },
    {
      title: "Voting power",
      source: generatePath(ROUTE_PATHS.daoList, {
        "*": "voting-power",
      }),
    },
  ]

  const [searchInput, setSearchInput] = useState<string>("")

  const { isMobile } = useBreakpoints()

  return (
    <>
      <Header>DAO</Header>
      <S.Container>
        <S.Indents top={false}>
          {isMobile ? (
            <TutorialCard
              text="Create unique DAO in 5 steps, manage through proposals, get rewards"
              linkText="Read the tutorial"
              imageSrc={tutorialImageSrc}
              href="https://dexe.network/"
            />
          ) : (
            <S.PromoBlock>
              <S.PromoBlockImg src={tutorialImageSrc} />
              <S.PromoBlockDetails>
                <S.PromoBlockDetailsTitle>
                  Shape your DAO with your best ideas
                </S.PromoBlockDetailsTitle>
                <S.PromoBlockDetailsLink href={"#"}>
                  Read the tutorial
                </S.PromoBlockDetailsLink>
              </S.PromoBlockDetails>
              <S.PromoBlockActionBtn
                text={"Create own DAO"}
                color="tertiary"
                routePath={ROUTE_PATHS.createFundDao}
              />
            </S.PromoBlock>
          )}
        </S.Indents>
        <S.List.Container>
          <S.Indents>
            <S.List.Header>
              {isMobile ? (
                <>
                  <S.List.RouteTabsWrp m="0" tabs={tabs} />
                  <S.Action
                    text="+ Create new"
                    routePath={generatePath(ROUTE_PATHS.createFundDao)}
                  />
                </>
              ) : (
                <>
                  <S.List.Title>DAO</S.List.Title>
                  <S.List.RouteTabsWrp m="0" tabs={tabs} />
                  <S.List.FiltersWrp>
                    <S.List.SearchInput
                      value={searchInput}
                      onInput={(event) =>
                        setSearchInput(event.currentTarget.value as string)
                      }
                      placeholder={"Search"}
                      nodeLeft={<S.List.SearchIcon name={ICON_NAMES.search} />}
                    />
                    <S.List.FiltersBtn
                      color="secondary"
                      text="Filter"
                      size="small"
                      iconLeft={ICON_NAMES.filter}
                      iconRight={ICON_NAMES.angleDown}
                    />
                  </S.List.FiltersWrp>
                </>
              )}
            </S.List.Header>
          </S.Indents>
          <Routes>
            <Route path={"top"} element={<DaoPoolsList />} />
            <Route path={"voting-power"} element={<DaoPoolsList />} />
            <Route
              path={"/"}
              element={
                <Navigate
                  replace
                  to={generatePath(ROUTE_PATHS.daoList, {
                    "*": "top",
                  })}
                />
              }
            />
          </Routes>
        </S.List.Container>
      </S.Container>
    </>
  )
}

export default DaoPools
