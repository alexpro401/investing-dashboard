import { Flex, Center, To } from "theme"
import React, { ElementType, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CubeSpinner } from "react-spinners-kit"
import { Routes, Route, generatePath, Navigate } from "react-router-dom"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import LoadMore from "components/LoadMore"
import PoolStatisticCard from "components/cards/PoolStatistic"

import { PoolType } from "consts/types"

import {
  selectBasicPools,
  selectInvestPools,
  selectPayload,
  selectPools,
  selectTotalBasicPools,
  selectTotalInvestPools,
} from "state/pools/selectors"

import * as S from "./styled"
import { AppDispatch } from "state"
import { setActivePoolType } from "state/pools/actions"
import { ICON_NAMES, ROUTE_PATHS } from "consts"
import { Icon } from "common"
import { useBreakpoints } from "hooks"
import Header from "components/Header/Layout"
import { ITab } from "interfaces"

import tutorialImageSrc from "assets/others/create-fund-docs.png"
import { usePoolsFilters } from "state/pools/hooks"
import { debounce } from "lodash"

interface Props {
  poolType: PoolType
}

const List: React.FC<Props> = ({ poolType }) => {
  const investScrollRef = React.useRef<any>(null)
  const ALL_POOL = useSelector(selectPools)
  const BASIC_POOL = useSelector(selectBasicPools)
  const INVEST_POOL = useSelector(selectInvestPools)
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector(selectPayload)

  const loadMore = () => {}

  const pools = {
    ALL_POOL,
    BASIC_POOL,
    INVEST_POOL,
  }

  useEffect(() => {
    if (!dispatch || !poolType) return

    dispatch(setActivePoolType({ type: poolType }))
  }, [dispatch, poolType])

  // manually disable scrolling *refresh this effect when ref container dissapeared from DOM
  useEffect(() => {
    if (!investScrollRef.current) return
    disableBodyScroll(investScrollRef.current)

    return () => clearAllBodyScrollLocks()
  }, [investScrollRef, loading])

  const { isDesktop } = useBreakpoints()

  return loading && !pools[poolType].length ? (
    <Center>
      <CubeSpinner size={40} loading />
      <Flex p="10px 0">
        <S.LoadingText>Retrieving pools</S.LoadingText>
      </Flex>
    </Center>
  ) : (
    <S.ListContainer>
      <S.MembersList ref={investScrollRef}>
        {pools[poolType].map((pool, index) => (
          <To
            key={pool.id}
            to={generatePath(ROUTE_PATHS.poolProfile, {
              poolAddress: pool.id,
              "*": "",
            })}
          >
            <Flex p="16px 0 0" full>
              <PoolStatisticCard data={pool} index={index}>
                {isDesktop ? (
                  <S.CardIconWrp>
                    <Icon name={ICON_NAMES.angleRight} color={"#6781BD"} />
                  </S.CardIconWrp>
                ) : (
                  <></>
                )}
              </PoolStatisticCard>
            </Flex>
          </To>
        ))}
        {/* // TODO: make loading indicator stick to bottom of the list */}
        <LoadMore
          isLoading={loading && !!pools[poolType].length}
          handleMore={loadMore}
          r={investScrollRef}
        />
      </S.MembersList>
    </S.ListContainer>
  )
}

function TopMembers() {
  const totalBasicPools = useSelector(selectTotalBasicPools)
  const totalInvestPools = useSelector(selectTotalInvestPools)

  const tabs: ITab[] = [
    {
      title: `All funds (${totalBasicPools + totalInvestPools})`,
      source: generatePath(ROUTE_PATHS.topMembers, { "*": "all" }),
    },
    {
      title: `Basic (${totalBasicPools})`,
      source: generatePath(ROUTE_PATHS.topMembers, { "*": "basic" }),
    },
    {
      title: `Investment (${totalInvestPools})`,
      source: generatePath(ROUTE_PATHS.topMembers, { "*": "invest" }),
    },
  ]

  const [, dispatchFilter] = usePoolsFilters()
  const [isFiltersActive, setIsFiltersActive] = useState(false)

  const [isSearchToggled, setIsSearchToggled] = useState(true)
  const [searchInput, setSearchInput] = useState<string>("")

  const { isMediumTablet } = useBreakpoints()

  useEffect(
    debounce(() => {
      dispatchFilter("query", searchInput)
    }, 500),
    [searchInput]
  )

  return (
    <S.StyledTopMembers>
      <Header>TOP Funds</Header>
      <S.TopMembersPromoBlock>
        <S.TopMembersPromoBlockImg src={tutorialImageSrc} />
        <S.TopMembersPromoBlockDetails>
          <S.TopMembersPromoBlockDetailsTitle>
            Shape your Fund with your best ideas
          </S.TopMembersPromoBlockDetailsTitle>
          <S.TopMembersPromoBlockDetailsLink href={"#"}>
            Read the tutorial
          </S.TopMembersPromoBlockDetailsLink>
        </S.TopMembersPromoBlockDetails>
        <S.TopMembersPromoBlockActionBtn
          text={"Create own Fund"}
          color="tertiary"
          routePath={ROUTE_PATHS.createFund}
        />
      </S.TopMembersPromoBlock>
      <S.TopMembersHeader>
        <S.TopMembersTitle>Top Funds</S.TopMembersTitle>
        <S.TopMembersRouteTabsWrp tabs={tabs} />
        <S.TopMembersFiltersWrp>
          <S.ToggleSearchFieldWrp
            isToggled={Boolean(!isMediumTablet && isSearchToggled)}
            setIsToggled={isMediumTablet ? undefined : setIsSearchToggled}
            modelValue={searchInput}
            updateModelValue={(value: string) => setSearchInput(value)}
          />
          <S.TopMembersFiltersBtn
            text={isMediumTablet ? "Filters" : ""}
            iconLeft={ICON_NAMES.filter}
            iconRight={isMediumTablet ? ICON_NAMES.angleDown : undefined}
            onClick={() => setIsFiltersActive(!isFiltersActive)}
          />

          <S.TradersSortWrp
            handleClose={() => setIsFiltersActive(false)}
            isOpen={isFiltersActive}
          />
        </S.TopMembersFiltersWrp>
      </S.TopMembersHeader>
      <Routes>
        <Route path="all" element={<List poolType="ALL_POOL" />}></Route>
        <Route path="basic" element={<List poolType="BASIC_POOL" />}></Route>
        <Route path="invest" element={<List poolType="INVEST_POOL" />}></Route>
        <Route
          path="*"
          element={
            <Navigate
              replace
              to={generatePath(ROUTE_PATHS.topMembers, {
                "*": "all",
              })}
            />
          }
        ></Route>
      </Routes>
    </S.StyledTopMembers>
  )
}

export default TopMembers
