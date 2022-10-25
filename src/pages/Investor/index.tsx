import { To } from "theme"
import { useWeb3React } from "@web3-react/core"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider, useQuery } from "urql"
import { useSelector } from "react-redux"
import { useEffect, useMemo } from "react"
import { isNil } from "lodash"

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
} from "./styled"
import Header from "components/Header/Layout"
import { Profiles } from "components/Header/Components"
import Pools from "components/Header/Pools"
import { getRedirectedPoolAddress, normalizeBigNumber } from "utils"
import ProfitLossChart from "components/ProfitLossChart"
import { usePoolQuery } from "hooks/usePool"
import { InvestorQuery } from "queries"
import { IInvestorQuery } from "interfaces/thegraphs/investors"
import useInvestorTotalInvest from "hooks/useInvestorTotalInvest"
import Skeleton from "components/Skeleton"
import useInvestorTV from "hooks/useInvestorTV"

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
    if (investorFetching || isNil(investorData)) {
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
    if (tvLoading) {
      return <Skeleton w="45px" h="16px" />
    }
    const res = normalizeBigNumber(tvUSD, 18, 2)
    return <>${res}</>
  }, [tvUSD, tvLoading])

  const ownedPools = useSelector(selectOwnedPools)
  const noPools = !ownedPools.basic.length && !ownedPools.invest.length

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
