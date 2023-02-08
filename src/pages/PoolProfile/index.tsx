import { useContext, useMemo, useState } from "react"
import {
  generatePath,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom"

import {
  TabPoolHolders,
  TabPoolInfo,
  TabPoolLockedFunds,
  TabPoolPnl,
  TabPoolStatistic,
} from "./tabs"

import Header from "components/Header/Layout"
import Dropdown from "components/Dropdown"

import * as S from "./styled"

import { DATE_FORMAT, ICON_NAMES, ROUTE_PATHS } from "consts"
import { DateUtil, formatNumber, normalizeBigNumber } from "utils"
import { useBreakpoints } from "hooks"
import { AccountInvestmentPools } from "common"
import {
  PoolProfileContext,
  PoolProfileContextProvider,
} from "pages/PoolProfile/context"
import { localizePoolType } from "localization"
import { copyToClipboard } from "utils/clipboard"
import getExplorerLink, { ExplorerDataType } from "utils/getExplorerLink"
import { useWeb3React } from "@web3-react/core"
import {
  FundDetailsGeneral,
  FundDetailsFee,
  FundDetailsInvestment,
  FundDetailsManager,
  FundDetailsMenu,
  FundDetailsWhitelist,
  FundDetailsWithdrawalHistory,
  TraderPoolsList,
  PoolStatisticsItem,
} from "pages/PoolProfile/components"
import Modal from "components/Modal"
import { useEffectOnce } from "react-use"
import { Bus, sleep } from "helpers"
import { useTranslation } from "react-i18next"

const PoolProfileContent = () => {
  const { chainId } = useWeb3React()

  const { isSmallTablet, isTablet, isMediumTablet } = useBreakpoints()

  const {
    fundType,
    fundAddress,
    basicToken,
    fundTicker,
    fundName,
    fundImageUrl,

    creationDate,
    isTrader,
    accountLPs,
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
                  poolAddress: fundAddress,
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
                routePath={generatePath(ROUTE_PATHS.poolInvest, {
                  poolAddress: fundAddress,
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

  const { t } = useTranslation()

  return (
    <>
      <Header />
      <S.Container>
        <S.Content>
          {isTrader ? <AccountInvestmentPools /> : <TraderPoolsList />}
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
                <S.PoolProfileGeneralActions>
                  {isTablet ? (
                    <S.PoolProfileGeneralActionsFundType>
                      {localizePoolType(fundType)}
                    </S.PoolProfileGeneralActionsFundType>
                  ) : (
                    <></>
                  )}
                  <Dropdown
                    name="pool-profile-general-actions-dropdown"
                    label={
                      <S.PoolProfileGeneralActionsDropdownToggler>
                        <S.PoolProfileGeneralActionsDropdownTogglerIcon
                          name={ICON_NAMES.dotsHorizontal}
                        />
                      </S.PoolProfileGeneralActionsDropdownToggler>
                    }
                    position="right"
                  >
                    <S.PoolProfileGeneralActionsDropdownContent>
                      <S.PoolProfileGeneralActionsDropdownItem
                        onClick={() => {
                          window.open(
                            getExplorerLink(
                              chainId || 0,
                              fundAddress,
                              ExplorerDataType.ADDRESS
                            ),
                            "_blank"
                          )
                        }}
                      >
                        <S.PoolProfileGeneralActionsDropdownItemIcon
                          name={ICON_NAMES.externalLink}
                        />
                        {t("pool-profile.explorer-link")}
                      </S.PoolProfileGeneralActionsDropdownItem>
                      <S.PoolProfileGeneralActionsDropdownItem
                        onClick={() => {
                          copyToClipboard(fundAddress || "")
                        }}
                      >
                        <S.PoolProfileGeneralActionsDropdownItemIcon
                          name={ICON_NAMES.copy}
                        />
                        {t("pool-profile.copy-btn")}
                      </S.PoolProfileGeneralActionsDropdownItem>
                      {!isMediumTablet ? (
                        [
                          { link: "", icon: ICON_NAMES.github, name: "Github" },
                          { link: "", icon: ICON_NAMES.github, name: "Github" },
                          { link: "", icon: ICON_NAMES.github, name: "Github" },
                          { link: "", icon: ICON_NAMES.github, name: "Github" },
                          { link: "", icon: ICON_NAMES.github, name: "Github" },
                        ].map((el, idx) => (
                          <S.PoolProfileGeneralActionsDropdownItem
                            key={idx}
                            onClick={() => window.open(el.link, "_blank")}
                          >
                            <S.PoolProfileGeneralActionsDropdownItemIcon
                              name={el.icon}
                            />
                            {el.name}
                          </S.PoolProfileGeneralActionsDropdownItem>
                        ))
                      ) : (
                        <></>
                      )}
                    </S.PoolProfileGeneralActionsDropdownContent>
                  </Dropdown>
                </S.PoolProfileGeneralActions>
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
                  percentage={-1.13}
                  tooltipMsg={"Lorem ipsum dolor sit amet!"}
                />

                <PoolStatisticsItem
                  label={"APY"}
                  value={apy?.toString()}
                  percentage={1.13}
                  tooltipMsg={"Lorem ipsum dolor sit amet!"}
                />

                <PoolStatisticsItem
                  label={"My share"}
                  value={normalizeBigNumber(accountLPs, 18, 2)}
                  percentage={-1.13}
                  tooltipMsg={"Lorem ipsum dolor sit amet!"}
                />

                <PoolStatisticsItem
                  label={"P&L"}
                  value={`${pnl?.total?.base.percent}%`}
                  percentage={1.13}
                  tooltipMsg={"Lorem ipsum dolor sit amet!"}
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
                  {t("pool-profile.statistic-heading")}
                </S.SpecificStatisticsTitle>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.trades-per-day-lbl")}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {trades?.perDay}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.order-size-lbl")}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {normalizeBigNumber(orderSize, 18)}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.daily-profit-lbl")}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {dailyProfitPercent}%
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.time-positions-lbl")}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {timePositions}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.sortino-lbl", {
                      currency: "ETH",
                    })}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {sortino?.eth}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.sortino-lbl", {
                      currency: "BTC",
                    })}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {sortino?.btc}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsTitle>
                  {t("pool-profile.total-pnl-heading")}
                </S.SpecificStatisticsTitle>
                {[
                  {
                    label: "DEXE",
                    amount: pnl?.total?.dexe?.amount,
                    percent: pnl?.total?.dexe?.percent,
                  },
                  {
                    label: "USD",
                    amount: pnl?.total?.usd?.amount,
                    percent: pnl?.total?.usd?.percent,
                  },
                  {
                    label: "ETH",
                    amount: pnl?.total?.eth?.amount,
                    percent: pnl?.total?.eth?.percent,
                  },
                  {
                    label: "BTC",
                    amount: pnl?.total?.btc?.amount,
                    percent: pnl?.total?.btc?.percent,
                  },
                ].map((el, idx) => (
                  <S.SpecificStatisticsRow key={idx}>
                    <S.SpecificStatisticsLabel>DEXE</S.SpecificStatisticsLabel>
                    <S.SpecificStatisticsValue>
                      {`${normalizeBigNumber(el.amount, 18)} (${el.percent}%)`}
                    </S.SpecificStatisticsValue>
                  </S.SpecificStatisticsRow>
                ))}
                <S.SpecificStatisticsTitle>
                  {t("pool-profile.details-heading")}
                </S.SpecificStatisticsTitle>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.emission-lbl")}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {normalizeBigNumber(emission, 18)}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.min-invest-amount-lbl")}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {normalizeBigNumber(minInvestAmount, 18)}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.fund-managers-lbl")}
                  </S.SpecificStatisticsLabel>
                  <S.SpecificStatisticsValue>
                    {fundManagers?.length || 0}
                  </S.SpecificStatisticsValue>
                </S.SpecificStatisticsRow>
                <S.SpecificStatisticsRow>
                  <S.SpecificStatisticsLabel>
                    {t("pool-profile.whitelist-lbl")}
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
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { isSmallTablet } = useBreakpoints()

  const [isManageModalShown, setIsManageModalShown] = useState(false)
  const [modalContent, setModalContent] = useState<
    | "menu"
    | "general"
    | "investment"
    | "whitelist"
    | "manager"
    | "fee"
    | "withdrawal_history"
  >("menu")

  useEffectOnce(() => {
    Bus.on("manage-modal", () => {
      setIsManageModalShown(true)
    })
    Bus.on("manage-modal/menu", () => {
      setModalContent("menu")

      if (!isSmallTablet) {
        navigate(
          generatePath(ROUTE_PATHS.poolProfile, {
            poolAddress: poolAddress || "",
            "*": "details",
          })
        )
      }
    })
    Bus.on("manage-modal/general", () => {
      setModalContent("general")
    })
    Bus.on("manage-modal/investment", () => {
      setModalContent("investment")
    })
    Bus.on("manage-modal/whitelist", () => {
      setModalContent("whitelist")
    })
    Bus.on("manage-modal/manager", () => {
      setModalContent("manager")
    })
    Bus.on("manage-modal/fee", () => {
      setModalContent("fee")
    })
    Bus.on("manage-modal/withdrawal-history", () => {
      setModalContent("withdrawal_history")
    })

    return () => {
      Bus.off("manage-modal", () => {
        setIsManageModalShown(false)
      })
      Bus.off("manage-modal/menu", () => {
        setModalContent("menu")
      })
      Bus.off("manage-modal/general", () => {
        setModalContent("menu")
      })
      Bus.off("manage-modal/investment", () => {
        setModalContent("menu")
      })
      Bus.off("manage-modal/whitelist", () => {
        setModalContent("menu")
      })
      Bus.off("manage-modal/manager", () => {
        setModalContent("menu")
      })
      Bus.off("manage-modal/fee", () => {
        setModalContent("menu")
      })
      Bus.off("manage-modal/withdrawal-history", () => {
        setModalContent("menu")
      })
    }
  })

  if (!poolAddress) return <></>

  return (
    <PoolProfileContextProvider poolAddress={poolAddress}>
      {!isSmallTablet ? (
        <Routes>
          <Route
            path="details"
            element={
              <>
                <Header />
                <S.Container>
                  <S.Content>
                    <Outlet />
                  </S.Content>
                </S.Container>
              </>
            }
          >
            <Route path="general" element={<FundDetailsGeneral />} />
            <Route path="investment" element={<FundDetailsInvestment />} />
            <Route path="whitelist" element={<FundDetailsWhitelist />} />
            <Route path="manager" element={<FundDetailsManager />} />
            <Route path="fee" element={<FundDetailsFee />} />
            <Route path="menu" element={<FundDetailsMenu />} />
            <Route index element={<Navigate replace to="menu" />} />
          </Route>

          <Route index path="/" element={<PoolProfileContent />} />
        </Routes>
      ) : (
        <>
          <PoolProfileContent />
          <Modal
            isOpen={isManageModalShown}
            onClose={async () => {
              setIsManageModalShown(false)
              await sleep(500)
              setModalContent("menu")
            }}
            title={
              modalContent === "menu" ? (
                "Manage fund"
              ) : (
                <S.ModalHeadWrp>
                  <S.ModalHeadBackBtn onClick={() => setModalContent("menu")}>
                    <S.ModalHeadIcon name={ICON_NAMES.angleLeft} />
                    {t("pool-profile.manage-fund-modal-title")}
                  </S.ModalHeadBackBtn>
                </S.ModalHeadWrp>
              )
            }
            maxWidth="420px"
          >
            <S.ModalBodyWrp>
              {
                {
                  general: <FundDetailsGeneral />,
                  investment: <FundDetailsInvestment />,
                  whitelist: <FundDetailsWhitelist />,
                  manager: <FundDetailsManager />,
                  fee: <FundDetailsFee />,
                  menu: <FundDetailsMenu />,
                  withdrawal_history: <FundDetailsWithdrawalHistory />,
                }[modalContent]
              }
            </S.ModalBodyWrp>
          </Modal>
        </>
      )}
    </PoolProfileContextProvider>
  )
}

export default PoolProfile
