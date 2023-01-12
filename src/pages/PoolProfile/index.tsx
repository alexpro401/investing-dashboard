import { useWeb3React } from "@web3-react/core"
import { GuardSpinner } from "react-spinners-kit"
import { useState, useEffect, useMemo } from "react"
import { generatePath, useNavigate, useParams } from "react-router-dom"
import { isNil } from "lodash"
import { useSelector } from "react-redux"

import { Center, Flex } from "theme"
import { Pools } from "pages/PoolProfile/components"
import Header from "components/Header/Layout"
import { AppButton } from "common"
import PoolStatisticCard from "components/cards/PoolStatistic"

import * as S from "./styled"

import {
  TabPoolPnl,
  TabPoolLockedFunds,
  TabPoolStatistic,
  TabPoolInfo,
  TabPoolHolders,
} from "./tabs"

import { AppState } from "state"
import { useERC20Data } from "state/erc20/hooks"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { selectPoolByAddress } from "state/pools/selectors"

import { ROUTE_PATHS, ZERO } from "consts"
import { normalizeBigNumber } from "utils"
import usePoolPrice from "hooks/usePoolPrice"
import { multiplyBignumbers } from "utils/formulas"
import { usePoolContract } from "hooks/usePool"
import { useTraderPoolContract } from "contracts"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import { useBreakpoints } from "hooks"

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

  const { isDesktop } = useBreakpoints()

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
              generatePath(ROUTE_PATHS.poolSwap, {
                poolType: poolData?.type,
                poolToken: poolData?.id,
                inputToken: poolData?.baseToken,
                outputToken: "0x",
                "*": "",
              })
            ),
          text: "+ Open new trade",
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
      <S.Indents>
        <S.Tabs
          tabs={[
            {
              name: "P&L",
              child: <TabPoolPnl address={poolData?.id} />,
            },
            {
              name: "Locked funds",
              child: (
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
      </S.Indents>
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
      <WithPoolAddressValidation
        poolAddress={poolAddress ?? ""}
        loader={
          <Center>
            <GuardSpinner size={20} loading />
          </Center>
        }
      >
        <S.Container>
          {!isNil(poolData) ? (
            <>
              <S.Indents top>
                <PoolStatisticCard data={poolData} hideChart>
                  <>
                    <S.ButtonContainer>
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
                    </S.ButtonContainer>
                    {!isTrader && (
                      <>
                        {!isDesktop && <S.Divider />}
                        <Flex
                          full
                          ai={!isDesktop ? "center" : "flex-end"}
                          jc="space-between"
                          dir={!isDesktop ? "row" : "column"}
                        >
                          <S.Label>Your share</S.Label>
                          <S.Value.Medium color="#E4F2FF">
                            {normalizeBigNumber(accountLPs, 18, 2)}{" "}
                            {poolData?.ticker}
                          </S.Value.Medium>
                        </Flex>
                      </>
                    )}
                  </>
                </PoolStatisticCard>
              </S.Indents>
              {PoolPageTabs}
            </>
          ) : (
            <Center>
              <GuardSpinner size={20} loading />
            </Center>
          )}
        </S.Container>
      </WithPoolAddressValidation>
    </>
  )
}

export default Pool
