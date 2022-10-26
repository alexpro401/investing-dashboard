import { useWeb3React } from "@web3-react/core"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider, useQuery } from "urql"
import { useSelector } from "react-redux"
import { useEffect, useMemo } from "react"
import { isEmpty, isNil } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { PulseSpinner } from "react-spinners-kit"

import { To, Text, Flex } from "theme"

import { selectOwnedPools } from "state/user/selectors"
import BarChart from "components/BarChart"
import {
  Container,
  Tab,
  TabContainer,
  TabCard,
  Row,
  MainText,
  MainValue,
  PoolsList,
} from "./styled"
import Header from "components/Header/Layout"
import { Profiles } from "components/Header/Components"
import Pools from "components/Header/Pools"
import { getRedirectedPoolAddress } from "utils"
import ProfitLossChart from "components/ProfitLossChart"
import { usePoolQuery, usePoolsByInvestors } from "hooks/usePool"
import { InvestorQuery } from "queries"
import { IInvestorQuery } from "interfaces/thegraphs/investors"
import InvestedFund from "components/cards/InvestedFund"
import InvestorStatistic from "./InvestorStatistic"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

const investorGraphClient = createClient({
  url: process.env.REACT_APP_INVESTORS_API_URL || "",
  requestPolicy: "network-only",
})

function Investor() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { poolAddress } = useParams()

  const { account } = useWeb3React()
  const [poolData] = usePoolQuery(poolAddress)

  const [investorResp] = useQuery<{ investor: IInvestorQuery }>({
    pause: isNil(account),
    query: InvestorQuery,
    variables: {
      address: account,
    },
    context: investorGraphClient,
  })

  const { data: investorData, fetching: investorFetching } = investorResp

  const _activePools = useMemo(() => {
    if (
      investorFetching ||
      isNil(investorData) ||
      isNil(investorData.investor)
    ) {
      return []
    }
    return investorData.investor.activePools
  }, [investorData, investorFetching])

  const ownedPools = useSelector(selectOwnedPools)
  const noPools = !ownedPools.basic.length && !ownedPools.invest.length

  const investors = useMemo(
    () => (isNil(account) ? [] : [String(account).toLocaleLowerCase()]),
    [account]
  )
  const [{ data: investorPools, fetching: fetchingInvestorPools }] =
    usePoolsByInvestors(investors)

  useEffect(() => {
    localStorage.setItem(`last-visited-profile-${account}`, pathname)
  }, [pathname, account])

  const redirectToTrader = () => {
    const redirectPath = getRedirectedPoolAddress(ownedPools)

    if (!!redirectPath) {
      const TRADER_PATH = `/me/trader/profile/${redirectPath[0]}/${redirectPath[1]}`

      navigate(TRADER_PATH)
    }
  }

  const leftIcon = noPools ? <Pools /> : <Profiles onClick={redirectToTrader} />

  const InvestorPools = useMemo(() => {
    if ((isNil(investorPools) && investorFetching) || isNil(account)) {
      return (
        <PoolsList maxH={false}>
          <Flex full p="16px" ai="center" jc="center">
            <PulseSpinner />
          </Flex>
        </PoolsList>
      )
    }

    if (
      (isNil(investorPools) ||
        isEmpty(investorPools.traderPools) ||
        isNil(account)) &&
      !investorFetching
    ) {
      return (
        <PoolsList maxH={false}>
          <Text block align="center" p="16px">
            No active pools
          </Text>
        </PoolsList>
      )
    }

    if (
      !isNil(investorPools) &&
      !isNil(investorPools.traderPools) &&
      !isNil(account)
    ) {
      return (
        <PoolsList maxH={investorPools.traderPools.length >= 3}>
          {investorPools.traderPools.map((traderPool) => (
            <To
              key={uuidv4()}
              to={`/pool/profile/${traderPool.type}/${traderPool.id}`}
            >
              <InvestedFund data={traderPool} account={account} />
            </To>
          ))}
        </PoolsList>
      )
    }

    return null
  }, [investorPools, fetchingInvestorPools, account])

  return (
    <>
      <Header left={leftIcon}>My investor profile</Header>
      <Container>
        <InvestorStatistic activePools={_activePools} />

        <TabCard>
          <TabContainer>
            <Tab active>Profit & Loss</Tab>
          </TabContainer>
          <ProfitLossChart
            address={poolAddress}
            baseToken={poolData?.baseToken}
          />
          <BarChart address={poolAddress} />
          <Row>
            <MainText>P&L LP - $ETH</MainText>
            <MainValue>+ 13.1% (+112.132 ETH)</MainValue>
          </Row>
          <Row>
            <MainText>P&L LP - USD% - USD</MainText>
            <MainValue>+ 19.1% - 19.1 USD </MainValue>
          </Row>
        </TabCard>
        <TabCard>
          <TabContainer>
            <Tab active>Funds I invest in</Tab>
          </TabContainer>
          {InvestorPools}
        </TabCard>
      </Container>
    </>
  )
}

const InvestorWithProvider = () => {
  return (
    <GraphProvider value={poolsClient}>
      <Investor />
    </GraphProvider>
  )
}

export default InvestorWithProvider
