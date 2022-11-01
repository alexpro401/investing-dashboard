import { isEmpty, map } from "lodash"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { PulseSpinner } from "react-spinners-kit"
import { useCallback, useEffect, useMemo, useRef } from "react"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { Text, To } from "theme"
import Header from "components/Header/Layout"
import { Profiles } from "components/Header/Components"
import PoolStatisticCard from "components/cards/PoolStatistic"
import TraderStatisticCard from "components/cards/TraderStatistic"

import { Container, Indents, List } from "./styled"

import { selectPayload } from "state/pools/selectors"
import {
  selectLoadingState,
  selectOwnedPoolsData,
  selectTotalOwnedPoolsStatistic,
} from "state/user/selectors"
import { useNavigate } from "react-router-dom"

function Trader() {
  const { account } = useWeb3React()
  const navigate = useNavigate()

  const totalStatistic = useSelector(selectTotalOwnedPoolsStatistic)
  const userStoreLoading = useSelector(selectLoadingState)
  const poolsStorePayload = useSelector(selectPayload)

  const loading = useMemo(() => {
    return userStoreLoading || poolsStorePayload.loading
  }, [userStoreLoading, poolsStorePayload])

  const pools = useSelector(selectOwnedPoolsData)

  const scrollRef = useRef(null)
  useEffect(() => {
    if (!scrollRef.current) return
    disableBodyScroll(scrollRef.current)

    return () => clearAllBodyScrollLocks()
  }, [scrollRef])

  const _poolsInView = useMemo(() => !isEmpty(pools), [loading, pools, account])

  const redirectToInvestor = useCallback(() => {
    navigate("/me/investor")
  }, [navigate])

  const PoolsList = useMemo(() => {
    if (loading && isEmpty(pools)) {
      return <PulseSpinner />
    }

    if (!loading && isEmpty(pools)) {
      return <Text color="#B1C7FC">No owned pools</Text>
    }

    return map(pools, function (pool, index) {
      return (
        <To key={pool.id} to={`/me/trader/profile/${pool.type}/${pool.id}`}>
          <Indents>
            <PoolStatisticCard data={pool} index={index} />
          </Indents>
        </To>
      )
    })
  }, [loading, pools])

  return (
    <>
      <Header left={<Profiles onClick={redirectToInvestor} />}>
        Personal trader profile
      </Header>
      <Container>
        <Indents>
          <TraderStatisticCard
            account={account}
            data={totalStatistic}
            pools={pools}
          />
        </Indents>
        <List.Container>
          <Indents>
            <List.Header>
              <Text block color="#E4F2FF" fw={700} fz={16} lh="1">
                All my funds
              </Text>
              <List.Action text="+ Create new" routePath="/create-fund" />
            </List.Header>
          </Indents>
          <List.Scroll ref={scrollRef} center={!_poolsInView}>
            {PoolsList}
          </List.Scroll>
        </List.Container>
      </Container>
    </>
  )
}

export default Trader
