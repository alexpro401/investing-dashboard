import { useWeb3React } from "@web3-react/core"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider, useQuery } from "urql"
import { useSelector } from "react-redux"
import { useEffect, useMemo } from "react"
import { isEmpty, isNil } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { PulseSpinner } from "react-spinners-kit"

import { To, Text, Flex } from "theme"
import Button, { SecondaryButton } from "components/Button"
import InvestorMobile from "components/InvestorMobile"

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
  ButtonContainer,
  PoolsList,
} from "./styled"
import Header from "components/Header/Layout"
import { Profiles } from "components/Header/Components"
import Pools from "components/Header/Pools"
import { getRedirectedPoolAddress, normalizeBigNumber } from "utils"
import ProfitLossChart from "components/ProfitLossChart"
import { usePoolQuery, usePoolsByInvestors } from "hooks/usePool"
import { InvestorQuery } from "queries"
import { IInvestorQuery } from "interfaces/thegraphs/investors"
import useInvestorTotalInvest from "hooks/useInvestorTotalInvest"
import Skeleton from "components/Skeleton"
import useInvestorTV from "hooks/useInvestorTV"
import InvestedFund from "components/cards/InvestedFund"

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

  const activePoolsCount = useMemo(() => {
    if (investorFetching || isNil(investorData)) {
      return <Skeleton w="25px" h="16px" />
    }
    return <>{_activePools.length}</>
  }, [_activePools, investorFetching])

  const [{ usd: totalInvestUSD }, { loading: totalLoading }] =
    useInvestorTotalInvest(account)

  const totalInvested = useMemo(() => {
    if (totalLoading) {
      return <Skeleton w="45px" h="16px" />
    }
    const res = normalizeBigNumber(totalInvestUSD, 18, 2)
    return <>${res}</>
  }, [totalInvestUSD, totalLoading])

  const [{ usd: tvUSD }, { loading: tvLoading }] = useInvestorTV(
    account,
    _activePools
  )

  const tv = useMemo(() => {
    if (isEmpty(_activePools)) {
      return <>$0.0</>
    }

    if (tvLoading) {
      return <Skeleton w="45px" h="16px" />
    }

    const res = normalizeBigNumber(tvUSD, 18, 2)
    return <>${res}</>
  }, [_activePools, tvUSD, tvLoading])

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
        <InvestorMobile
          account={account}
          totalInvested={totalInvested}
          activePoolsCount={activePoolsCount}
          tv={tv}
        >
          <ButtonContainer>
            <To to="/">
              <SecondaryButton full fz={14}>
                New investment
              </SecondaryButton>
            </To>
            <To to="/investment/positions/open">
              <Button full fz={14}>
                My investments
              </Button>
            </To>
          </ButtonContainer>
        </InvestorMobile>
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
