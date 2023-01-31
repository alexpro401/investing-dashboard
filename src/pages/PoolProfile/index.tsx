import { GuardSpinner } from "react-spinners-kit"
import { useContext, useMemo } from "react"
import { generatePath, useParams } from "react-router-dom"

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
    fundType,
    fundAddress,
    basicToken,
    fundTicker,
    fundName,
    fundImageUrl,

    creationDate,
    isTrader,
    pnl,
    depositors,
    priceLP,
    tvl,
    apy,
    trades,
    orderSize,
    dailyProfitPercent,
    timePositions,
    sortino,
    maxLoss,
    emission,
    minInvestAmount,
    fundManagers,
    whiteList,
  } = useContext(PoolProfileContext)

  const actions = useMemo(
    () => (
      <S.PoolProfileActions>
        {fundType && fundAddress && basicToken && fundTicker ? (
          isTrader ? (
            <>
              <S.PoolProfileActionBtn
                text="+ Open new trade"
                color="secondary"
                routePath={generatePath(ROUTE_PATHS.poolSwap, {
                  poolType: fundType,
                  poolToken: fundAddress,
                  inputToken: basicToken.address,
                  outputToken: "0x",
                  "*": "",
                })}
              />
              <S.PoolProfileActionBtn
                text="Fund positions"
                color="tertiary"
                routePath={generatePath(ROUTE_PATHS.fundPositions, {
                  poolAddress: fundAddress,
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
                  poolAddress: fundAddress,
                  "*": "open",
                })}
              />
              <S.PoolProfileActionBtn
                text={`Buy ${fundTicker}`}
                color="tertiary"
                routePath={generatePath(ROUTE_PATHS.poolSwap, {
                  poolType: fundType,
                  poolToken: fundAddress,
                  inputToken: basicToken.address,
                  outputToken: "0x",
                  "*": "",
                })}
              />
            </>
          )
        ) : (
          <></>
        )}
      </S.PoolProfileActions>
    ),
    [basicToken, fundAddress, fundTicker, fundType, isTrader]
  )

  return (
    <>
      <Header />
      <S.Container>
        <S.Content>
          {/*<Pools />*/}
          <S.PoolProfileDefaultInfo>
            <S.PoolProfileGeneral>
              <S.PoolProfileAppearance
                imgUrl={fundImageUrl}
                symbol={fundTicker}
                name={fundName}
              >
                {isSmallTablet ? (
                  <S.PageHeadDetailsRow>
                    <S.PoolDetailsBadge>
                      <S.PoolDetailsBadgeIcon name={ICON_NAMES.chatOutline} />
                      {creationDate && (
                        <S.PoolDetailsBadgeText>
                          {DateUtil.format(creationDate * 1000, DATE_FORMAT)}
                        </S.PoolDetailsBadgeText>
                      )}
                    </S.PoolDetailsBadge>
                    {pnl?._24h && (
                      <S.PoolDetailsBadge>
                        <S.PoolDetailsBadgeIcon
                          name={ICON_NAMES.dollarOutline}
                        />
                        <S.PoolDetailsBadgeText>
                          {pnl?._24h.base.percent}%
                        </S.PoolDetailsBadgeText>
                      </S.PoolDetailsBadge>
                    )}
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
                priceLP && (
                  <S.PoolProfileBaseToken
                    tokenAddress={basicToken?.address}
                    label={basicToken?.symbol}
                    value={formatNumber(priceLP, 2)}
                    percentage={pnl?._24h?.base.percent}
                  />
                )
              )}
            </S.PoolProfileGeneral>
            <S.PoolProfileStatisticsWrp>
              <S.PoolProfileStatistics>
                {isSmallTablet ? (
                  priceLP && (
                    <S.PoolProfileBaseToken
                      tokenAddress={basicToken?.address}
                      label={basicToken?.symbol}
                      value={formatNumber(priceLP, 2)}
                      percentage={pnl?._24h?.base.percent}
                    />
                  )
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
                  value={`${pnl?.total?.base.percent}%`}
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
                <S.SpecificStatisticsTitle>Statistic</S.SpecificStatisticsTitle>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Trades per Day
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {trades?.perDay}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Order size
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {normalizeBigNumber(orderSize, 18)}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Daily profit
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {dailyProfitPercent}%
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Time positions
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {timePositions}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Sortino (ETH)
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {sortino?.eth}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Sortino (BTC)
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {sortino?.btc}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsTitle>Total P&L</S.SpecificStatisticsTitle>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>DEXE</S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {`${normalizeBigNumber(pnl?.total?.dexe?.amount, 18)} (${
                      pnl?.total?.dexe?.percent
                    }%)`}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>USD</S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {`${normalizeBigNumber(pnl?.total?.usd?.amount, 18)} (${
                      pnl?.total?.usd?.percent
                    }%)`}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>ETH</S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {`${normalizeBigNumber(pnl?.total?.eth?.amount, 18)} (${
                      pnl?.total?.eth?.percent
                    }%)`}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>BTC</S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {`${normalizeBigNumber(pnl?.total?.btc?.amount, 18)} (${
                      pnl?.total?.btc?.percent
                    }%)`}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsTitle>Details</S.SpecificStatisticsTitle>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Emission
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {normalizeBigNumber(emission, 18)}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Min. invest amount
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {normalizeBigNumber(minInvestAmount, 18)}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Fund managers
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {fundManagers?.length || 0}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    Whitelist
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {whiteList?.length || 0}
                  </S.SpecificStatisticsValue>
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
        </S.Content>
      </S.Container>
    </>
  )
}

const PoolProfile = () => {
  const { poolAddress } = useParams()

  if (!poolAddress) return <></>

  return (
    <PoolProfileContextProvider poolAddress={poolAddress}>
      <PoolProfileContent />
    </PoolProfileContextProvider>
  )
}

export default PoolProfile
