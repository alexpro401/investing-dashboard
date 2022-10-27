import { FC, useCallback, useMemo } from "react"
import { GuardSpinner } from "react-spinners-kit"
import { useNavigate, useParams } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"
import { useWeb3React } from "@web3-react/core"
import { isNil } from "lodash"

import TabsLight from "components/TabsLight"
import Header from "components/Header/Layout"
import PoolPnlInfo from "components/PoolPnlInfo"
import PoolLockedFunds from "components/PoolLockedFunds"
import FundDetailsCard from "components/FundDetailsCard"
import Button, { SecondaryButton } from "components/Button"
import FundStatisticsCard from "components/FundStatisticsCard"
import PoolStatisticCard from "components/cards/PoolStatistic"

import { Center } from "theme"
import { Container, Details, ButtonContainer } from "./styled"

import { TabCard } from "pages/Investor/styled"

import { shortenAddress } from "utils"
import { usePoolContract, usePoolQuery } from "hooks/usePool"

interface Props {}

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const Profile: FC<Props> = () => {
  console.log("Profile")
  const { account } = useWeb3React()

  const navigate = useNavigate()
  const { poolAddress } = useParams()

  const [poolData] = usePoolQuery(poolAddress)
  const [, poolInfoData] = usePoolContract(poolAddress)

  const isPoolOwner = useMemo(() => {
    if (!account || !poolInfoData) return false
    return account === poolInfoData.parameters.trader
  }, [account, poolInfoData])

  const handleBuyRedirect = useCallback(() => {
    if (isNil(poolData)) return
    navigate(`/pool/invest/${poolData.id}`)
  }, [poolData])

  const handlePositionsRedirect = useCallback(() => {
    if (!poolData) return

    const filter = isPoolOwner ? "open" : "closed"
    navigate(`/fund-positions/${poolData.id}/${filter}`)
  }, [poolData])

  if (!poolData) {
    return (
      <Center>
        <GuardSpinner size={20} loading />
      </Center>
    )
  }

  return (
    <>
      <Header>{shortenAddress(poolAddress)}</Header>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <PoolStatisticCard data={poolData}>
          <ButtonContainer>
            <SecondaryButton
              onClick={handlePositionsRedirect}
              m="0"
              fz={14}
              full
            >
              Fund positions
            </SecondaryButton>
            <Button onClick={handleBuyRedirect} m="0" fz={14} full>
              Buy {poolData.ticker}
            </Button>
          </ButtonContainer>
        </PoolStatisticCard>

        <TabCard>
          <TabsLight
            tabs={[
              {
                name: "Profit & Loss",
                child: (
                  <>
                    <PoolPnlInfo address={poolAddress} />
                  </>
                ),
              },
              {
                name: "Locked funds",
                child: (
                  <>
                    <PoolLockedFunds address={poolAddress} />
                  </>
                ),
              },
            ]}
          />
        </TabCard>

        <Details>
          <TabsLight
            tabs={[
              {
                name: "Statistic",
                child: (
                  <FundStatisticsCard data={poolData} info={poolInfoData} />
                ),
              },
              {
                name: "Details",
                child: (
                  <FundDetailsCard poolInfo={poolInfoData} pool={poolData} />
                ),
              },
            ]}
          />
        </Details>
      </Container>
    </>
  )
}

const ProfileWithProvider = () => {
  return (
    <GraphProvider value={poolsClient}>
      <Profile />
    </GraphProvider>
  )
}

export default ProfileWithProvider
