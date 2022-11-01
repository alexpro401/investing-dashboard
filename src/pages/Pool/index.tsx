import { useWeb3React } from "@web3-react/core"
import { GuardSpinner } from "react-spinners-kit"
import { createClient, Provider as GraphProvider } from "urql"
import { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { isNil } from "lodash"
import { useSelector } from "react-redux"

import { Center, Flex } from "theme"
import Tabs from "common/Tabs"
import Pools from "components/Header/Pools"
import Header from "components/Header/Layout"
import Button, { SecondaryButton } from "components/Button"
import PoolStatisticCard from "components/cards/PoolStatistic"

import { Container, ButtonContainer, Indents, Label, Value } from "./styled"

import TabPoolPnl from "./tabs/Pnl"
import TabPoolLockedFunds from "./tabs/LockedFunds"
import TabPoolStatistic from "./tabs/Statistic"
import TabPoolInfo from "./tabs/Info"
import TabPoolHolders from "./tabs/Holders"

import { AppState } from "state"
import { useERC20Data } from "state/erc20/hooks"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { selectPoolByAddress } from "state/pools/selectors"

import { ZERO } from "constants/index"
import { normalizeBigNumber } from "utils"
import usePoolPrice from "hooks/usePoolPrice"
import { multiplyBignumbers } from "utils/formulas"
import { usePoolContract, useTraderPool } from "hooks/usePool"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
})

function Pool() {
  const navigate = useNavigate()
  const { account, chainId } = useWeb3React()
  const { poolAddress } = useParams()

  const traderPool = useTraderPool(poolAddress)
  const poolData = useSelector((s: AppState) =>
    selectPoolByAddress(s, poolAddress)
  )
  const [, poolInfoData] = usePoolContract(poolAddress)
  const [{ poolMetadata }] = usePoolMetadata(
    poolData?.id,
    poolData?.descriptionURL
  )

  const [{ priceUSD }] = usePoolPrice(poolAddress)
  const [baseToken] = useERC20Data(poolData?.baseToken)

  const [isTrader, setIsTrader] = useState(false)
  const [accountLPs, setAccountLPs] = useState(ZERO)
  const accountLPsPrice = useMemo(() => {
    if (accountLPs.isZero() || priceUSD.isZero()) {
      return "0.0"
    }
    const BN = multiplyBignumbers([accountLPs, 18], [priceUSD, 18])
    return normalizeBigNumber(BN, 18, 2)
  }, [priceUSD, accountLPs])

  useEffect(() => {
    if (!traderPool || !account) return
    ;(async () => {
      const isAdmin = await traderPool.isTraderAdmin(account)
      setIsTrader(isAdmin)
      const balance = await traderPool.balanceOf(account)
      setAccountLPs(balance)
    })()
  }, [traderPool, account])

  const actions = useMemo(() => {
    if (!poolData) {
      return {
        leftNode: { onClick: () => {}, text: "" },
        rightNode: { onClick: () => {}, text: "" },
      }
    }
    if (isTrader) {
      return {
        leftNode: {
          onClick: () =>
            navigate(
              `/pool/swap/${poolData.type}/${poolData.id}/${poolData.baseToken}/0x`
            ),
          text: "Open new trade",
        },
        rightNode: {
          onClick: () => navigate(`/fund-positions/${poolData.id}/open`),
          text: `Positions`,
        },
      }
    } else {
      return {
        leftNode: {
          onClick: () => navigate(`/fund-positions/${poolData.id}/closed`),
          text: "Fund positions",
        },
        rightNode: {
          onClick: () => navigate(`/pool/invest/${poolData.id}`),
          text: `Buy ${poolData.ticker}`,
        },
      }
    }
  }, [isTrader, poolData])

  const PoolPageTabs = useMemo(() => {
    const load = isNil(poolData) || isNil(poolInfoData)

    return (
      <Indents>
        <Tabs
          tabs={[
            {
              name: "P&L",
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
                <TabPoolPnl address={poolData.id} />
              ),
            },
            {
              name: "Locked funds",
              child: (
                <TabPoolLockedFunds
                  address={poolData.id}
                  poolData={poolData}
                  poolInfo={poolInfoData}
                  baseToken={baseToken}
                  isTrader={isTrader}
                  accountLPsPrice={accountLPsPrice}
                />
              ),
            },
            {
              name: "About fund",
              child: (
                <TabPoolInfo
                  data={poolData}
                  poolInfo={poolInfoData}
                  baseToken={baseToken}
                  poolMetadata={poolMetadata}
                  isTrader={isTrader}
                />
              ),
            },
            {
              name: "Statistic",
              child: (
                <TabPoolStatistic poolData={poolData} poolInfo={poolInfoData} />
              ),
            },
            {
              name: "Holders",
              child: (
                <TabPoolHolders
                  poolData={poolData}
                  chainId={chainId}
                  baseToken={baseToken}
                />
              ),
            },
          ]}
        />
      </Indents>
    )
  }, [poolData, poolInfoData, actions, accountLPs, chainId])

  return (
    <>
      <Header>
        My trader profile
        <Pools />
      </Header>
      <Container>
        <Indents top>
          <PoolStatisticCard data={poolData}>
            <>
              <ButtonContainer>
                <SecondaryButton
                  fz={14}
                  full
                  onClick={actions.leftNode.onClick}
                >
                  {actions.leftNode.text}
                </SecondaryButton>
                <Button fz={14} onClick={actions.rightNode.onClick} full>
                  {actions.rightNode.text}
                </Button>
              </ButtonContainer>
              {!isTrader && (
                <>
                  <hr />
                  <Flex full ai="center" jc="space-between">
                    <Label>Your share</Label>
                    <Value.Medium color="#E4F2FF">
                      {normalizeBigNumber(accountLPs, 18, 2)} {poolData.ticker}
                    </Value.Medium>
                  </Flex>
                </>
              )}
            </>
          </PoolStatisticCard>
        </Indents>
        {PoolPageTabs}
      </Container>
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
