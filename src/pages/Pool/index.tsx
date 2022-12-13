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
import { AppButton } from "common"
import PoolStatisticCard from "components/cards/PoolStatistic"

import {
  Container,
  ButtonContainer,
  Indents,
  Label,
  Value,
  Divider,
} from "./styled"

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
import { usePoolContract } from "hooks/usePool"
import { useTraderPoolContract } from "contracts"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"

const poolsClient = createClient({
  url: process.env.REACT_APP_ALL_POOLS_API_URL || "",
  requestPolicy: "network-only",
})

function Pool() {
  const navigate = useNavigate()
  const { account, chainId } = useWeb3React()
  const { poolAddress } = useParams()

  const traderPool = useTraderPoolContract(poolAddress)
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
              `/pool/swap/${poolData?.type}/${poolData?.id}/${poolData?.baseToken}/0x`
            ),
          text: "Open new trade",
        },
        rightNode: {
          onClick: () => navigate(`/fund-positions/${poolData?.id}/open`),
          text: `Positions`,
        },
      }
    } else {
      return {
        leftNode: {
          onClick: () => navigate(`/fund-positions/${poolData?.id}/closed`),
          text: "Fund positions",
        },
        rightNode: {
          onClick: () => navigate(`/pool/invest/${poolData?.id}`),
          text: `Buy ${poolData?.ticker}`,
        },
      }
    }
  }, [isTrader, poolData, navigate])

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
                <TabPoolPnl address={poolData?.id} />
              ),
            },
            {
              name: "Locked funds",
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
                <TabPoolLockedFunds
                  address={poolData?.id}
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
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
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
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
                <TabPoolStatistic poolData={poolData} poolInfo={poolInfoData} />
              ),
            },
            {
              name: "Holders",
              child: load ? (
                <Center>
                  <GuardSpinner size={20} loading />
                </Center>
              ) : (
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
  }, [
    poolData,
    poolInfoData,
    baseToken,
    isTrader,
    accountLPsPrice,
    poolMetadata,
    chainId,
  ])

  return (
    <>
      <Header>
        My trader profile
        <Pools />
      </Header>
      <Container>
        {!isNil(poolData) ? (
          <>
            <Indents top>
              <PoolStatisticCard data={poolData}>
                <>
                  <ButtonContainer>
                    <AppButton
                      color="secondary"
                      size="small"
                      full
                      onClick={actions.leftNode.onClick}
                      text={actions.leftNode.text}
                    />
                    <AppButton
                      color="primary"
                      size="small"
                      onClick={actions.rightNode.onClick}
                      full
                      text={actions.rightNode.text}
                    />
                  </ButtonContainer>
                  {!isTrader && (
                    <>
                      <Divider />
                      <Flex full ai="center" jc="space-between">
                        <Label>Your share</Label>
                        <Value.Medium color="#E4F2FF">
                          {normalizeBigNumber(accountLPs, 18, 2)}{" "}
                          {poolData?.ticker}
                        </Value.Medium>
                      </Flex>
                    </>
                  )}
                </>
              </PoolStatisticCard>
            </Indents>
            {PoolPageTabs}
          </>
        ) : (
          <Center>
            <GuardSpinner size={20} loading />
          </Center>
        )}
      </Container>
    </>
  )
}

const PoolWithProviders = () => {
  const { poolAddress } = useParams()

  return (
    <GraphProvider value={poolsClient}>
      <WithPoolAddressValidation
        poolAddress={poolAddress ?? ""}
        loader={
          <Center>
            <GuardSpinner size={20} loading />
          </Center>
        }
      >
        <Pool />
      </WithPoolAddressValidation>
    </GraphProvider>
  )
}

export default PoolWithProviders
