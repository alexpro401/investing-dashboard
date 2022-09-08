import { useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { createClient, Provider as GraphProvider } from "urql"
import { GuardSpinner } from "react-spinners-kit"

import TabsLight from "components/TabsLight"
import Header from "components/Header/Layout"
import PoolPnlInfo from "components/PoolPnlInfo"
import MemberMobile from "components/MemberMobile"
import PoolLockedFunds from "components/PoolLockedFunds"
import FundDetailsCard from "components/FundDetailsCard"
import Button, { SecondaryButton } from "components/Button"
import FundStatisticsCard from "components/FundStatisticsCard"

import { Center } from "theme"
import { Container, ButtonContainer, Details } from "./styled"

import { TabCard } from "pages/Investor/styled"

import { shortenAddress } from "utils"
import { useActiveWeb3React } from "hooks"
import { PoolType } from "constants/types"
import { usePoolContract, usePoolQuery } from "hooks/usePool"

interface Props {}

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

const Profile: React.FC<Props> = () => {
  const { account } = useActiveWeb3React()
  const { poolAddress, poolType } = useParams<{
    poolAddress: string
    poolType: PoolType
  }>()

  const [poolData] = usePoolQuery(poolAddress)
  const [leverageInfo, poolInfoData] = usePoolContract(poolAddress)

  const navigate = useNavigate()

  const isPoolOwner = useMemo(() => {
    if (!account || !poolInfoData) return false
    return account === poolInfoData.parameters.trader
  }, [account, poolInfoData])

  const handleBuyRedirect = () => {
    navigate(`/pool/invest/${poolData?.id}`)
  }

  const handlePositionsRedirect = () => {
    const tabPath = isPoolOwner ? "open" : "closed"
    navigate(`/fund-positions/${poolData?.id}/${tabPath}`)
  }

  const back = () => navigate(-1)

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
        <MemberMobile data={poolData}>
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
        </MemberMobile>

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
                  <FundStatisticsCard
                    data={poolData}
                    leverage={leverageInfo}
                    info={poolInfoData}
                  />
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
