/**
 * Render Tabs
 */
import { ITab } from "interfaces"
import { useLocation } from "react-router-dom"
import { To } from "theme"
import isActiveRoute from "utils/isActiveRoute"
import { EHeaderTitles } from "."
import * as S from "./styled"
import { useMemo } from "react"
import { MotionProps } from "framer-motion"

interface IHeaderTabsProps extends MotionProps {
  tabs: ITab[]
}

const HeaderTabs = ({ tabs, ...rest }: IHeaderTabsProps) => {
  const { pathname } = useLocation()

  const isActive = useMemo(
    () => (source, activeSource) => {
      if (activeSource && activeSource.length > 0) {
        return activeSource.some((s) => isActiveRoute(pathname, s))
      }

      return isActiveRoute(pathname, source)
    },
    [pathname]
  )

  return tabs.length > 0 ? (
    <S.Tabs {...rest}>
      {tabs.map((tab: ITab) => {
        if (tab.source) {
          return (
            <To
              key={tab.title}
              to={tab.source}
              onClick={tab.onClick ?? undefined}
            >
              <S.Tab active={isActive(tab.source, tab.activeSource)}>
                {tab.title}
              </S.Tab>

              {(tab?.amount || 0) > 0 && (
                <S.TabAmount>{tab.amount}</S.TabAmount>
              )}
            </To>
          )
        }

        return (
          <To key={tab.title} as="div" onClick={tab.onClick ?? undefined}>
            <S.Tab active={tab.isActive}>{tab.title}</S.Tab>

            {(tab?.amount || 0) > 0 && <S.TabAmount>{tab.amount}</S.TabAmount>}
          </To>
        )
      })}
    </S.Tabs>
  ) : null
}

/**
 * Get Tabs depending on the title
 */
export const getHeaderTabs = (title: EHeaderTitles) => {
  switch (title) {
    case EHeaderTitles.investing:
      return [
        {
          title: `All funds`,
          source: "all",
        },
        {
          title: `Basic`,
          source: "basic",
        },
        {
          title: `Investment`,
          source: "invest",
        },
      ]
    case EHeaderTitles.myInvestment:
      return [
        {
          title: "Open positions",
          source: "basic",
          amount: 0,
        },
        {
          title: "Proposals",
          source: "invest",
          amount: 0,
        },
        {
          title: "Closed positions",
          source: "invest",
          amount: 0,
        },
      ]
    case EHeaderTitles.insurance:
      return [
        {
          title: "Management",
          source: "basic",
          amount: 0,
        },
        {
          title: "Proposals",
          source: "invest",
          amount: 0,
        },
        {
          title: "Voting",
          source: "invest",
          amount: 0,
        },
      ]
    case EHeaderTitles.fundPositionsTrader:
      return [
        {
          title: "Open positions",
          source: "basic",
          amount: 0,
        },
        {
          title: "Closed positions",
          source: "invest",
          amount: 0,
        },
      ]
    case EHeaderTitles.myFund:
      return [
        {
          title: "Fund details",
          source: "basic",
          amount: 0,
        },
        {
          title: "Performance Fees",
          source: "invest",
          amount: 0,
        },
      ]
    case EHeaderTitles.fundPositionsInvestor:
      return [
        {
          title: "Whitelist",
          source: "basic",
          amount: 0,
        },
        {
          title: "Risk Proposals",
          source: "invest",
          amount: 0,
        },
        {
          title: "Fund History",
          source: "invest",
          amount: 0,
        },
      ]
    default:
      return []
  }
}

export default HeaderTabs
