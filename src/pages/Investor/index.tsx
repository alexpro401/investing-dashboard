import { To } from "theme"
import { useWeb3React } from "@web3-react/core"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"
import { useSelector } from "react-redux"

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
import { getRedirectedPoolAddress } from "utils"
import { useEffect } from "react"
import ProfitLossChart from "components/ProfitLossChart"
import { usePoolQuery } from "hooks/usePool"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

interface Props {}

function Investor(props: Props) {
  const {} = props

  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { poolAddress } = useParams<{
    poolAddress: string
  }>()

  const { account } = useWeb3React()
  const [poolData] = usePoolQuery(poolAddress)

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
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <InvestorMobile account={account}>
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
