import { FC, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock"

import { AppButton } from "common"
import Modal from "components/Modal"
import {
  Scroll,
  List,
  ListHead,
  ListPlaceholder,
  AccountCard,
  Divider,
  PoolCard,
  ButtonContainer,
} from "./styled"

import { IPoolQuery } from "interfaces/thegraphs/all-pools"
import { getLastInArray, getPNL, getPriceLP, getUSDPrice } from "utils/formulas"

interface Props {
  isOpen: boolean
  toggle: () => void
  ownedPools: IPoolQuery[]
  managedPools: IPoolQuery[]
}

const OwnedPoolsList: FC<Props> = ({
  isOpen,
  toggle,
  ownedPools,
  managedPools,
}) => {
  const navigate = useNavigate()
  const { account } = useWeb3React()

  const scrollRef = useRef<any>(null)

  const basicPools = ownedPools.filter(({ type }) => type === "BASIC_POOL")
  const investPools = ownedPools.filter(({ type }) => type === "INVEST_POOL")

  useEffect(() => {
    if (!scrollRef.current || !isOpen) return () => clearAllBodyScrollLocks()
    disableBodyScroll(scrollRef.current)

    return () => clearAllBodyScrollLocks()
  }, [scrollRef, isOpen])

  const createFund = () => {
    navigate("/create-fund")
  }

  const basicPoolsList = basicPools.map((pool) => {
    const priceLP = getPriceLP(pool.priceHistory)
    const pnl = getPNL(priceLP)
    const lastHistoryPoint = getLastInArray(pool.priceHistory)

    return (
      <PoolCard
        onClick={toggle}
        descriptionURL={pool.descriptionURL}
        baseAddress={pool.baseToken}
        poolType="BASIC_POOL"
        name={pool.name}
        symbol={pool.ticker}
        pnl={String(pnl)}
        address={pool.id}
        key={pool.id}
        tvl={`$${getUSDPrice(lastHistoryPoint ? lastHistoryPoint.usdTVL : 0)}`}
      />
    )
  })

  const investPoolsList = investPools.map((pool) => {
    const priceLP = getPriceLP(pool.priceHistory)
    const pnl = getPNL(priceLP)
    const lastHistoryPoint = getLastInArray(pool.priceHistory)

    return (
      <PoolCard
        onClick={toggle}
        descriptionURL={pool.descriptionURL}
        baseAddress={pool.baseToken}
        poolType="INVEST_POOL"
        name={pool.name}
        symbol={pool.ticker}
        pnl={String(pnl)}
        address={pool.id}
        key={pool.id}
        tvl={`$${getUSDPrice(lastHistoryPoint ? lastHistoryPoint.usdTVL : 0)}`}
      />
    )
  })

  const adminedPoolsList = managedPools.map((pool) => {
    const priceLP = getPriceLP(pool.priceHistory)
    const pnl = getPNL(priceLP)
    const lastHistoryPoint = getLastInArray(pool.priceHistory)

    return (
      <PoolCard
        onClick={toggle}
        descriptionURL={pool.descriptionURL}
        baseAddress={pool.baseToken}
        poolType={pool.type}
        name={pool.name}
        symbol={pool.ticker}
        pnl={String(pnl)}
        address={pool.id}
        key={pool.id}
        tvl={`$${getUSDPrice(lastHistoryPoint ? lastHistoryPoint.usdTVL : 0)}`}
      />
    )
  })

  return (
    <Modal isOpen={isOpen} toggle={toggle} title="All my funds">
      <>
        <AccountCard account={account} />
        <Divider />
        <Scroll ref={scrollRef}>
          <List.Container>
            <ListHead title="My basic funds" />
            <List.Body>
              {!basicPools.length ? (
                <ListPlaceholder title="You do not have open basic funds yet" />
              ) : (
                basicPoolsList
              )}
            </List.Body>
          </List.Container>
          <Divider />
          <List.Container>
            <ListHead title="My investment funds" showLabels={false} />
            <List.Body>
              {!investPools.length ? (
                <ListPlaceholder title="You do not have open investment funds yet" />
              ) : (
                investPoolsList
              )}
            </List.Body>
          </List.Container>
          <Divider />
          <List.Container>
            <ListHead title="Management funds" showLabels={false} />
            <List.Body>
              {!managedPools.length ? (
                <ListPlaceholder title="You do not have admined funds yet" />
              ) : (
                adminedPoolsList
              )}
            </List.Body>
          </List.Container>
          <Divider />
        </Scroll>
        <ButtonContainer>
          <AppButton
            size="large"
            color="secondary"
            onClick={createFund}
            text="Create new fund"
          />
        </ButtonContainer>
      </>
    </Modal>
  )
}

export default OwnedPoolsList
