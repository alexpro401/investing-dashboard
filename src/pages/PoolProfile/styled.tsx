import styled from "styled-components/macro"
import { motion } from "framer-motion"

import { AppButton, Icon, Tabs } from "common"
import { respondTo } from "theme"
import { PoolAppearance, PoolBaseToken } from "./components"

export const Container = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}))`
  overflow: hidden auto;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  padding: var(--app-padding);
`

export const PoolProfileDefaultInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  overflow: hidden;
  background: #141926;
  border-radius: 20px;
  padding: var(--app-padding);

  ${respondTo("xs")} {
    background: transparent;
    padding: 0;
  }
`

export const PoolProfileGeneral = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PoolProfileAppearance = styled(PoolAppearance)``

export const PoolProfileBaseToken = styled(PoolBaseToken)``

export const PoolProfileStatisticsWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);

  ${respondTo("xs")} {
    padding: var(--app-padding);
  }

  ${respondTo("lg")} {
    background: #101520;
    border-radius: 20px;
  }
`

export const PoolProfileStatistics = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--app-gap);
`

export const PoolProfileActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--app-gap);
  width: 100%;

  ${respondTo("lg")} {
    width: auto;
  }
`

export const PoolProfileActionBtn = styled(AppButton).attrs((props) => ({
  size: "small",
}))`
  width: 100%;

  // temp hotfix
  border: none;
`

export const PageHeadDetailsRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--app-gap);
`

export const PoolDetailsBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PoolDetailsBadgeIcon = styled(Icon)`
  color: ${(props) => props.theme.brandColors.secondary};
`

export const PoolDetailsBadgeText = styled.span`
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${(props) => props.theme.textColors.primary};

  /* TEMP */
  transform: translateY(4px);
`

export const PoolHeadStatistics = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--app-gap);
  background: #101520;
  border-radius: 20px;
  padding: var(--app-padding);
`

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: var(--app-gap);
  width: 100%;
  margin: auto 0;

  ${respondTo("sm")} {
    grid-template-columns: repeat(2, minmax(0, 180px));
    margin: 0;
    width: auto;
  }
`

export const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: #20293a;
`

export const TabsWrp = styled(Tabs)`
  flex: 1;
`

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
`
