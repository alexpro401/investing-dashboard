import styled from "styled-components/macro"

import HeaderTabs from "components/Header/Tabs"
import RouteTabs from "components/RouteTabs"
import { respondTo } from "theme"

export const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const HeaderTabsWrp = styled(HeaderTabs)`
  justify-content: flex-start;
`

export const PageSubTabs = styled(RouteTabs)`
  ${respondTo("sm")} {
    width: max-content;
    min-width: 350px;
  }
`
