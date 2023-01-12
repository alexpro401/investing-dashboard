import { useWeb3React } from "@web3-react/core"
import { GuardSpinner } from "react-spinners-kit"
import { useEffect, useMemo, useState } from "react"
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
  TabPoolHolders,
  TabPoolInfo,
  TabPoolLockedFunds,
  TabPoolPnl,
  TabPoolStatistic,
} from "./tabs"

import { AppState } from "state"
import { useERC20Data } from "state/erc20/hooks"
import { usePoolMetadata } from "state/ipfsMetadata/hooks"
import { selectPoolByAddress } from "state/pools/selectors"

import { DATE_FORMAT, ICON_NAMES, ROUTE_PATHS, ZERO } from "consts"
import { DateUtil, formatNumber, normalizeBigNumber } from "utils"
import { multiplyBignumbers } from "utils/formulas"
import { useTraderPoolContract } from "contracts"
import WithPoolAddressValidation from "components/WithPoolAddressValidation"
import {
  useBreakpoints,
  usePoolContract,
  usePoolPrice,
  usePoolStatistics,
} from "hooks"
import { PoolStatisticsItem } from "./components"
import { PoolProfileDefaultInfo, PoolProfileGeneral } from "./styled"

const PoolProfile = () => {
  const { poolAddress } = useParams()
  const navigate = useNavigate()
  const { isSmallTablet, isDesktop, isTablet } = useBreakpoints()
  const { account, chainId } = useWeb3React()

  const traderPool = useTraderPoolContract(poolAddress)
  const poolData = useSelector((s: AppState) =>
    selectPoolByAddress(s, poolAddress)
  )

  const { priceLP, tvl, apy, pnl, pnl24h, depositors } =
    usePoolStatistics(poolData)

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
      const [isAdmin, balance] = await Promise.all([
        traderPool.isTraderAdmin(account),
        traderPool.balanceOf(account),
      ])
      setIsTrader(isAdmin)
      setAccountLPs(balance)
    })()
  }, [traderPool, account])

  const actions = useMemo(
    () => (
      <S.PoolProfileActions>
        {isTrader ? (
          <>
            <S.PoolProfileActionBtn
              text="+ Open new trade"
              color="secondary"
              routePath={generatePath(ROUTE_PATHS.poolSwap, {
                poolType: poolData?.type,
                poolToken: poolData?.id,
                inputToken: poolData?.baseToken,
                outputToken: "0x",
                "*": "",
              })}
            />
            <S.PoolProfileActionBtn
              text="Fund positions"
              color="tertiary"
              routePath={generatePath(ROUTE_PATHS.fundPositions, {
                poolAddress: poolData?.id,
                "*": "open",
              })}
            />
          </>
        ) : (
          <>
            <S.PoolProfileActionBtn
              text="Fund positions"
              color="secondary"
              routePath={generatePath(ROUTE_PATHS.fundPositions, {
                poolAddress: poolData?.id,
                "*": "open",
              })}
            />
            <S.PoolProfileActionBtn
              text={`Buy ${poolData?.ticker}`}
              color="tertiary"
              routePath={generatePath(ROUTE_PATHS.poolSwap, {
                poolType: poolData?.type,
                poolToken: poolData?.id,
                inputToken: poolData?.baseToken,
                outputToken: "0x",
                "*": "",
              })}
            />
          </>
        )}
      </S.PoolProfileActions>
    ),
    [isTrader, poolData]
  )

  const loader = useMemo(
    () => (
      <Center>
        <GuardSpinner size={20} loading />
      </Center>
    ),
    []
  )

  return (
    <WithPoolAddressValidation poolAddress={poolAddress ?? ""} loader={loader}>
      <Header />
      <S.Container>
        <S.Content>
          {/*<Pools />*/}
          {isNil(poolData) ? (
            loader
          ) : (
            <>
              <S.PoolProfileDefaultInfo>
                <S.PoolProfileGeneral>
                  <S.PoolProfileAppearance
                    imgUrl={
                      poolMetadata?.assets[poolMetadata?.assets.length - 1]
                    }
                    symbol={poolData?.ticker}
                    name={poolData?.name}
                  >
                    {isSmallTablet ? (
                      <S.PageHeadDetailsRow>
                        <S.PoolDetailsBadge>
                          <S.PoolDetailsBadgeIcon
                            name={ICON_NAMES.dollarOutline}
                          />
                          <S.PoolDetailsBadgeText>
                            {DateUtil.format(
                              poolData.creationTime * 1000,
                              DATE_FORMAT
                            )}
                          </S.PoolDetailsBadgeText>
                        </S.PoolDetailsBadge>
                        <S.PoolDetailsBadge>
                          <S.PoolDetailsBadgeIcon
                            name={ICON_NAMES.dollarOutline}
                          />
                          <S.PoolDetailsBadgeText>
                            {pnl24h.toString()}%
                          </S.PoolDetailsBadgeText>
                        </S.PoolDetailsBadge>
                        <S.PoolDetailsBadge>
                          <S.PoolDetailsBadgeIcon
                            name={ICON_NAMES.dollarOutline}
                          />
                          <S.PoolDetailsBadgeText>
                            {depositors}
                          </S.PoolDetailsBadgeText>
                        </S.PoolDetailsBadge>
                      </S.PageHeadDetailsRow>
                    ) : (
                      <></>
                    )}
                  </S.PoolProfileAppearance>
                  {isSmallTablet ? (
                    <></>
                  ) : (
                    <S.PoolProfileBaseToken
                      tokenAddress={poolData?.baseToken}
                      label={baseToken?.symbol}
                      value={formatNumber(priceLP, 2)}
                      percentage={pnl24h}
                    />
                  )}
                </S.PoolProfileGeneral>
                <S.PoolProfileStatisticsWrp>
                  <S.PoolProfileStatistics>
                    {isSmallTablet ? (
                      <S.PoolProfileBaseToken
                        tokenAddress={poolData?.baseToken}
                        label={baseToken?.symbol}
                        value={formatNumber(priceLP, 2)}
                        percentage={pnl24h}
                      />
                    ) : (
                      <></>
                    )}
                    <PoolStatisticsItem
                      label={"TVL"}
                      value={`$${normalizeBigNumber(tvl, 18, 2)}`}
                      percentage={"1.13%"}
                    />

                    <PoolStatisticsItem
                      label={"APY"}
                      value={apy?.toString()}
                      percentage={"1.13%"}
                    />

                    <PoolStatisticsItem
                      label={"P&L"}
                      value={`${pnl}%`}
                      percentage={"1.13%"}
                    />
                    {isDesktop ? actions : <></>}
                  </S.PoolProfileStatistics>
                  {!isDesktop ? actions : <></>}
                </S.PoolProfileStatisticsWrp>
              </S.PoolProfileDefaultInfo>

              {/*<PoolStatisticCard data={poolData} hideChart>*/}
              {/*  <>*/}
              {/*    <S.ButtonContainer>*/}
              {/*      <AppButton*/}
              {/*          color="secondary"*/}
              {/*          size="small"*/}
              {/*          full*/}
              {/*          onClick={actions.leftNode.onClick}*/}
              {/*          text={actions.leftNode.text}*/}
              {/*      />*/}
              {/*      <AppButton*/}
              {/*          color="primary"*/}
              {/*          size="small"*/}
              {/*          onClick={actions.rightNode.onClick}*/}
              {/*          full*/}
              {/*          text={actions.rightNode.text}*/}
              {/*      />*/}
              {/*    </S.ButtonContainer>*/}
              {/*    {!isTrader && (*/}
              {/*        <>*/}
              {/*          {!isDesktop && <S.Divider />}*/}
              {/*          <Flex*/}
              {/*              full*/}
              {/*              ai={!isDesktop ? "center" : "flex-end"}*/}
              {/*              jc="space-between"*/}
              {/*              dir={!isDesktop ? "row" : "column"}*/}
              {/*          >*/}
              {/*            <S.Label>Your share</S.Label>*/}
              {/*            <S.Value.Medium color="#E4F2FF">*/}
              {/*              {normalizeBigNumber(accountLPs, 18, 2)}{" "}*/}
              {/*              {poolData?.ticker}*/}
              {/*            </S.Value.Medium>*/}
              {/*          </Flex>*/}
              {/*        </>*/}
              {/*    )}*/}
              {/*  </>*/}
              {/*</PoolStatisticCard>*/}

              <S.TabsWrp
                tabs={[
                  {
                    name: "P&L",
                    child: (
                      <S.TabContainer>
                        <TabPoolPnl address={poolData?.id} />
                      </S.TabContainer>
                    ),
                  },
                  {
                    name: "Locked funds",
                    child: (
                      <S.TabContainer>
                        <TabPoolLockedFunds
                          address={poolData?.id}
                          poolData={poolData}
                          poolInfo={poolInfoData}
                          baseToken={baseToken}
                          isTrader={isTrader}
                          accountLPsPrice={accountLPsPrice}
                        />
                      </S.TabContainer>
                    ),
                  },
                  {
                    name: "About fund",
                    child: (
                      <S.TabContainer>
                        <TabPoolInfo
                          data={poolData}
                          poolInfo={poolInfoData}
                          baseToken={baseToken}
                          poolMetadata={poolMetadata}
                          isTrader={isTrader}
                        />
                      </S.TabContainer>
                    ),
                  },
                  {
                    name: "Statistic",
                    child: (
                      <S.TabContainer>
                        <TabPoolStatistic
                          poolData={poolData}
                          poolInfo={poolInfoData}
                        />
                      </S.TabContainer>
                    ),
                  },
                  {
                    name: "Holders",
                    child: (
                      <S.TabContainer>
                        <TabPoolHolders
                          poolData={poolData}
                          chainId={chainId}
                          baseToken={baseToken}
                        />
                      </S.TabContainer>
                    ),
                  },
                ]}
              />
            </>
          )}
        </S.Content>
      </S.Container>
    </WithPoolAddressValidation>
  )
}

export default PoolProfile
