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
  min-height: 100%;
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

export const PoolProfileGeneralActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--app-gap);
`

export const PoolProfileGeneralActionsFundType = styled.div`
  font-size: 12px;
  line-height: 1.2;
  font-weight: 700;
  color: ${(props) => props.theme.brandColors.secondary};
  border: 1px solid ${(props) => props.theme.brandColors.secondary};
  border-radius: 35px;
  padding: 4px 8px;
`

export const PoolProfileGeneralActionsDropdownToggler = styled.button`
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #6781bd;
  color: #6781bd;
`

export const PoolProfileGeneralActionsDropdownTogglerIcon = styled(Icon)``

export const PoolProfileGeneralActionsDropdownContent = styled.div`
  overflow: hidden auto;
  display: flex;
  flex-direction: column;
  width: max-content;
  height: 100%;
  color: ${(props) => props.theme.textColors.primary};
  border-radius: 20px;
  background-color: #20283a;
`

export const PoolProfileGeneralActionsDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #6781bd;
  padding: 16px 24px 16px 12px;
`

export const PoolProfileGeneralActionsDropdownItemIcon = styled(Icon)`
  width: 24px;
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

export const OptionalTabSplitter = styled.div`
  display: flex;
  gap: var(--app-gap);
`

export const SpecificStatistics = styled.div`
  display: flex;
  flex-direction: column;
  gap: calc(var(--app-gap) / 2);
  max-width: 275px;
  width: 100%;
  height: 100%;
`

export const SpecificStatisticsTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;

  /* Main/blue */

  color: #2669eb;

  &:not(:first-child) {
    margin-top: calc(var(--app-gap) / 2);
  }
`

export const SpecificStatisticsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--app-gap);
  background: #0f141e;
  padding: 2px 0;
`

export const SpecificStatisticsLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.01em;

  /* Text/white */

  color: #e4f2ff;
`

export const SpecificStatisticsValue = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: right;
  letter-spacing: 0.01em;

  /* Text/white */

  color: #e4f2ff;
`

export const TabsWrp = styled(Tabs)`
  flex: 1;
`

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
`

export const ModalHeadWrp = styled.div`
  display: flex;
  align-items: center;
`

export const ModalHeadBackBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  gap: 8px;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${(props) => props.theme.textColors.primary};
`

export const ModalHeadIcon = styled(Icon)`
  width: 14px;
  height: 14px;
  color: inherit;
`

export const ModalBodyWrp = styled.div`
  padding: 16px;
`
