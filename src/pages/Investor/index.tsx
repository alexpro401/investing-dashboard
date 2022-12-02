import { useWeb3React } from "@web3-react/core"
import { useParams, useNavigate } from "react-router-dom"
import { createClient, Provider as GraphProvider, useQuery } from "urql"
import { useMemo } from "react"
import { isEmpty, isNil } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { PulseSpinner } from "react-spinners-kit"

import { To, Text, Flex } from "theme"

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
import PoolPnlChart from "components/PoolPnlChart"
import { usePoolQuery, usePoolsByInvestors } from "hooks/usePool"
import { InvestorQuery } from "queries"
import { IInvestorQuery } from "interfaces/thegraphs/investors"
import InvestedFund from "components/cards/InvestedFund"
import InvestorStatisticCard from "components/cards/InvestorStatistic"

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

  const investors = useMemo(
    () => (isNil(account) ? [] : [String(account).toLocaleLowerCase()]),
    [account]
  )
  const [{ data: investorPools, fetching: fetchingInvestorPools }] =
    usePoolsByInvestors(investors)

  const redirectToTrader = () => {
    navigate("/me/trader")
  }

  const InvestorPools = useMemo(() => {
    if ((isNil(investorPools) && fetchingInvestorPools) || isNil(account)) {
      return (
        <PoolsList maxH={false}>
          <Flex full p="16px" ai="center" jc="center">
            <PulseSpinner />
          </Flex>
        </PoolsList>
      )
    }

    if (
      !fetchingInvestorPools &&
      (isNil(investorPools) || isEmpty(investorPools.traderPools))
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
        <>
          <TabContainer>
            <Tab active>Funds I invest in</Tab>
          </TabContainer>
          <PoolsList maxH={investorPools.traderPools.length >= 3}>
            {investorPools.traderPools.map((traderPool) => (
              <To key={uuidv4()} to={`/pool/profile/${traderPool.id}`}>
                <InvestedFund data={traderPool} account={account} />
              </To>
            ))}
          </PoolsList>
        </>
      )
    }

    return null
  }, [investorPools, fetchingInvestorPools, account])

  return (
    <>
      <Header left={<Profiles onClick={redirectToTrader} />}>
        My investor profile
      </Header>
      <Container>
        <InvestorStatisticCard activePools={_activePools} />

        <TabCard>
          <TabContainer>
            <Tab active>Profit & Loss</Tab>
          </TabContainer>
          <Flex full dir={"column"} p={"0 16px"}>
            <PoolPnlChart
              address={poolAddress}
              baseToken={poolData?.baseToken}
              tfPosition="bottom"
            />
            <BarChart address={poolAddress} m="4px 0 12px" />
          </Flex>
          <Row>
            <MainText>P&L LP - $ETH</MainText>
            <MainValue>+ 13.1% (+112.132 ETH)</MainValue>
          </Row>
          <Row>
            <MainText>P&L LP - USD% - USD</MainText>
            <MainValue>+ 19.1% - 19.1 USD </MainValue>
          </Row>
        </TabCard>
        <TabCard>{InvestorPools}</TabCard>
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
