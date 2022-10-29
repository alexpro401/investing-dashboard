import { useWeb3React } from "@web3-react/core"
import { GuardSpinner } from "react-spinners-kit"
import { formatEther } from "@ethersproject/units"
import { createClient, Provider as GraphProvider } from "urql"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import { TabCard } from "pages/Investor/styled"

import { Flex, Center } from "theme"
import Pools from "components/Header/Pools"
import TabsLight from "components/TabsLight"
import Header from "components/Header/Layout"
import IconButton from "components/IconButton"
import PoolPnlInfo from "components/PoolPnlInfo"
import { Profiles } from "components/Header/Components"
import PoolLockedFunds from "components/PoolLockedFunds"
import FundDetailsCard from "components/FundDetailsCard"
import Button, { SecondaryButton } from "components/Button"
import FundStatisticsCard from "components/FundStatisticsCard"
import PerformanceFeeCard from "components/PerformanceFeeCard"
import PoolStatisticCard from "components/cards/PoolStatistic"

import pencil from "assets/icons/pencil.svg"

import { formatBigNumber } from "utils"
import { usePoolQuery, usePoolContract, useTraderPool } from "hooks/usePool"

import {
  Container,
  ButtonContainer,
  Details,
  DetailsEditLinkFrame,
  OwnInvesting,
  OwnInvestingLabel,
  OwnInvestingValue,
  OwnInvestingLink,
} from "./styled"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

function Pool() {
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const { poolAddress, poolType } = useParams<{
    poolAddress: string
    poolType: string
  }>()

  const [commisionUnlockTime, setCommisionUnlockTime] = useState<number>(0)
  const [hasFee, setHasFee] = useState<boolean>(false)
  const [ownInvestUsd, setOwnInvestUsd] = useState<string>("0")

  useEffect(() => {
    localStorage.setItem(`last-visited-profile-${account}`, pathname)
  }, [pathname, account])

  const traderPool = useTraderPool(poolAddress)
  const [poolData] = usePoolQuery(poolAddress)
  const [, poolInfoData] = usePoolContract(poolAddress)
  const navigate = useNavigate()

  const redirectToInvestor = useCallback(() => {
    navigate("/me/investor")
  }, [navigate])

  const handleBuyRedirect = () => {
    navigate(`/pool/invest/${poolData?.id}`)
  }

  const commissionPercentage = useMemo<string>(() => {
    if (!poolInfoData) return "0"

    return formatBigNumber(poolInfoData?.parameters.commissionPercentage, 25, 0)
  }, [poolInfoData])

  useEffect(() => {
    if (!traderPool || !account) return
    ;(async () => {
      const isAdmin = await traderPool?.isTraderAdmin(account)
      if (!isAdmin) redirectToInvestor()
    })()
  }, [traderPool, account, redirectToInvestor])

  useEffect((): void => {
    if (!traderPool || !account) return
    ;(async () => {
      const investors = await traderPool?.totalInvestors()

      const limit = +formatEther(investors) + 1
      const res = await traderPool?.getUsersInfo(account, 0, limit)

      const commisionTime = res[1].commissionUnlockTimestamp.toString()

      setCommisionUnlockTime(Number(commisionTime))
    })()
  }, [traderPool, account])

  useEffect((): void => {
    if (!traderPool) return
    ;(async () => {
      const investors = await traderPool?.totalInvestors()

      const limit = +formatEther(investors) + 1
      const fees = await traderPool?.getReinvestCommissions([0, limit])

      setHasFee(fees.traderBaseCommission.gt(0))
    })()
  }, [traderPool])

  useEffect((): void => {
    if (!traderPool) return
    ;(async () => {
      const poolInfo = await traderPool?.getPoolInfo()

      setOwnInvestUsd(formatBigNumber(poolInfo.traderUSD, 18, 3))
    })()
  }, [traderPool])

  const body = !poolData ? (
    <Center>
      <GuardSpinner size={20} loading />
    </Center>
  ) : (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <PoolStatisticCard data={poolData}>
        <ButtonContainer>
          <SecondaryButton
            fz={14}
            full
            onClick={() =>
              navigate(
                `/pool/swap/${poolType}/${poolData.id}/${poolData.baseToken}/0x`
              )
            }
          >
            Open new trade
          </SecondaryButton>
          <Button
            fz={14}
            onClick={() => navigate(`/fund-positions/${poolData.id}/open`)}
            full
          >
            Positions
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

      <OwnInvesting>
        <Flex dir="column" ai="flex-start">
          <OwnInvestingLabel>My own investing</OwnInvestingLabel>
          <OwnInvestingValue>$ {ownInvestUsd}</OwnInvestingValue>
        </Flex>
        <OwnInvestingLink onClick={handleBuyRedirect} />
      </OwnInvesting>

      <Details>
        <DetailsEditLinkFrame>
          <IconButton
            filled
            media={pencil}
            onClick={() => {
              navigate(`/fund-details/${poolData.id}/edit`)
            }}
            size={10}
          />
        </DetailsEditLinkFrame>
        <TabsLight
          tabs={[
            {
              name: "Statistic",
              child: <FundStatisticsCard data={poolData} info={poolInfoData} />,
            },
            {
              name: "Details",
              child: (
                <FundDetailsCard poolInfo={poolInfoData} pool={poolData}>
                  <PerformanceFeeCard
                    p="15px 0 0"
                    hasFee={hasFee}
                    poolAddress={poolAddress}
                    commisionUnlockTime={commisionUnlockTime}
                    performanceFeePercent={commissionPercentage}
                  />
                </FundDetailsCard>
              ),
            },
          ]}
        />
      </Details>
    </Container>
  )

  return (
    <>
      <Header left={<Profiles onClick={redirectToInvestor} />}>
        My trader profile
        <Pools />
      </Header>
      {body}
    </>
  )
}

const PoolWithProvider = () => {
  return (
    <GraphProvider value={poolsClient}>
      <Pool />
    </GraphProvider>
  )
}

export default PoolWithProvider
