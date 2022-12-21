import { Flex, Center, To } from "theme"
import React, { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CubeSpinner } from "react-spinners-kit"
import { Routes, Route } from "react-router-dom"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import LoadMore from "components/LoadMore"
import TopMembersBar from "components/TopMembersBar"
import PoolStatisticCard from "components/cards/PoolStatistic"

import { PoolType } from "constants/types"

import {
  selectBasicPools,
  selectInvestPools,
  selectPayload,
  selectPools,
} from "state/pools/selectors"

import {
  StyledTopMembers,
  MembersList,
  ListContainer,
  LoadingText,
} from "./styled"
import { AppDispatch } from "state"
import { setActivePoolType } from "state/pools/actions"
import { useWindowSize } from "react-use"

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

  const { width: windowWidth } = useWindowSize()
  const isMobile = useMemo(() => windowWidth < 1194, [windowWidth])

  return loading && !pools[poolType].length ? (
    <Center>
      <CubeSpinner size={40} loading />
      <Flex p="10px 0">
        <LoadingText>Retrieving pools</LoadingText>
      </Flex>
    </Center>
  ) : (
    <ListContainer>
      <MembersList
        ref={investScrollRef}
        style={{ height: window.innerHeight - 117 }}
      >
        {pools[poolType].map((pool, index) => (
          <To key={pool.id} to={`/pool/profile/${pool.id}`}>
            <Flex p="16px 0 0" full>
              <PoolStatisticCard
                data={pool}
                index={index}
                isMobile={isMobile}
              />
            </Flex>
          </To>
        ))}
        {/* // TODO: make loading indicator stick to bottom of the list */}
        <LoadMore
          isLoading={loading && !!pools[poolType].length}
          handleMore={loadMore}
          r={investScrollRef}
        />
      </MembersList>
    </ListContainer>
  )
}

function TopMembers() {
  return (
    <StyledTopMembers>
      <TopMembersBar />
      <Routes>
        <Route path="/" element={<List poolType="ALL_POOL" />}></Route>
        <Route path="basic" element={<List poolType="BASIC_POOL" />}></Route>
        <Route path="invest" element={<List poolType="INVEST_POOL" />}></Route>
      </Routes>
    </StyledTopMembers>
  )
}

export default TopMembers
