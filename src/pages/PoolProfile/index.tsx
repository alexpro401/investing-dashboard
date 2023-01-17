import { GuardSpinner } from "react-spinners-kit"
import { useContext, useMemo } from "react"
import { generatePath } from "react-router-dom"
import { isNil } from "lodash"

import {
  TabPoolHolders,
  TabPoolInfo,
  TabPoolLockedFunds,
  TabPoolPnl,
  TabPoolStatistic,
} from "./tabs"

import { Center } from "theme"
import Header from "components/Header/Layout"

import * as S from "./styled"

import { DATE_FORMAT, ICON_NAMES, ROUTE_PATHS } from "consts"
import { DateUtil, formatNumber, normalizeBigNumber } from "utils"
import { useBreakpoints } from "hooks"
import { PoolStatisticsItem } from "pages/PoolProfile/components"
import {
  PoolProfileContext,
  PoolProfileContextProvider,
} from "pages/PoolProfile/context"

const PoolProfileContent = () => {
  const { isSmallTablet, isMediumTablet } = useBreakpoints()

  const {
    poolData,
    poolMetadata,
    baseToken,
    priceLP,
    tvl,
    apy,
    pnl,
    pnl24h,
    depositors,
    isTrader,
  } = useContext(PoolProfileContext)

  const actions = useMemo(
    () => (
      <S.PoolProfileActions>
        {isTrader ? (
          <>
            <S.PoolProfileActionBtn
              text="+ Open new trade"
              color="secondary"
              routePath={
                poolData
                  ? generatePath(ROUTE_PATHS.poolSwap, {
                      poolType: poolData?.type,
                      poolToken: poolData?.id,
                      inputToken: poolData?.baseToken,
                      outputToken: "0x",
                      "*": "",
                    })
                  : ""
              }
            />
            <S.PoolProfileActionBtn
              text="Fund positions"
              color="tertiary"
              routePath={
                poolData
                  ? generatePath(ROUTE_PATHS.fundPositions, {
                      poolAddress: poolData?.id,
                      "*": "open",
                    })
                  : ""
              }
            />
          </>
        ) : (
          <>
            <S.PoolProfileActionBtn
              text="Fund positions"
              color="secondary"
              routePath={
                poolData
                  ? generatePath(ROUTE_PATHS.fundPositions, {
                      poolAddress: poolData?.id,
                      "*": "open",
                    })
                  : ""
              }
            />
            <S.PoolProfileActionBtn
              text={`Buy ${poolData?.ticker}`}
              color="tertiary"
              routePath={
                poolData
                  ? generatePath(ROUTE_PATHS.poolSwap, {
                      poolType: poolData?.type,
                      poolToken: poolData?.id,
                      inputToken: poolData?.baseToken,
                      outputToken: "0x",
                      "*": "",
                    })
                  : ""
              }
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
    <>
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
                            name={ICON_NAMES.chatOutline}
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
                          <S.PoolDetailsBadgeIcon name={ICON_NAMES.users} />
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
                      tokenAddress={baseToken?.address}
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
                        tokenAddress={baseToken?.address}
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
                      value={`${normalizeBigNumber(pnl, 4)}%`}
                      percentage={"1.13%"}
                    />
                    {actions}
                  </S.PoolProfileStatistics>
                </S.PoolProfileStatisticsWrp>
              </S.PoolProfileDefaultInfo>

              <S.OptionalTabSplitter>
                <S.TabsWrp
                  tabs={[
                    {
                      name: "P&L",
                      child: (
                        <S.TabContainer>
                          <TabPoolPnl />
                        </S.TabContainer>
                      ),
                    },
                    {
                      name: "Locked funds",
                      child: (
                        <S.TabContainer>
                          <TabPoolLockedFunds />
                        </S.TabContainer>
                      ),
                    },
                    ...(!isSmallTablet
                      ? [
                          {
                            name: "About fund",
                            child: (
                              <S.TabContainer>
                                <TabPoolInfo />
                              </S.TabContainer>
                            ),
                          },
                          {
                            name: "Statistic",
                            child: (
                              <S.TabContainer>
                                <TabPoolStatistic />
                              </S.TabContainer>
                            ),
                          },
                          {
                            name: "Holders",
                            child: (
                              <S.TabContainer>
                                <TabPoolHolders />
                              </S.TabContainer>
                            ),
                          },
                        ]
                      : []),
                  ]}
                />
                {isMediumTablet ? (
                  <S.SpecificStatistics>
                    <S.SpecificStatisticsTitle>
                      Statistic
                    </S.SpecificStatisticsTitle>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsTitle>
                      Total P&L
                    </S.SpecificStatisticsTitle>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsTitle>
                      Details
                    </S.SpecificStatisticsTitle>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                    <S.SpecificStatisticsRow>
                      <S.SpecificStatisticsLabel>
                        Trades per Day
                      </S.SpecificStatisticsLabel>
                      <S.SpecificStatisticsValue>2.1</S.SpecificStatisticsValue>
                    </S.SpecificStatisticsRow>
                  </S.SpecificStatistics>
                ) : (
                  <></>
                )}
              </S.OptionalTabSplitter>
              {isSmallTablet ? (
                <S.TabsWrp
                  tabs={[
                    ...(!isMediumTablet
                      ? [
                          {
                            name: "Statistic",
                            child: (
                              <S.TabContainer>
                                <TabPoolStatistic />
                              </S.TabContainer>
                            ),
                          },
                        ]
                      : []),
                    {
                      name: "About fund",
                      child: (
                        <S.TabContainer>
                          <TabPoolInfo />
                        </S.TabContainer>
                      ),
                    },
                    {
                      name: "Holders",
                      child: (
                        <S.TabContainer>
                          <TabPoolHolders />
                        </S.TabContainer>
                      ),
                    },
                  ]}
                />
              ) : (
                <></>
              )}
            </>
          )}
        </S.Content>
      </S.Container>
    </>
  )
}

const PoolProfile = () => {
  return (
    <PoolProfileContextProvider>
      <PoolProfileContent />
    </PoolProfileContextProvider>
  )
}

export default PoolProfile
