import styled from "styled-components/macro"
import RouteTabs from "components/RouteTabs"
import HeaderTabs from "components/Header/Tabs"
import { respondTo } from "theme"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  overflow: hidden auto;
  flex: 1;
  padding: var(--app-padding);
`

export const HeadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
`

export const PageTitle = styled.h2`
  font-size: 24px;
  line-height: 1.25;
  font-weight: 900;
  color: #e4f2ff;
  margin: 0;
`

export const PageHeadTabs = styled(HeaderTabs)`
  ${respondTo("sm")} {
    justify-content: flex-start;
  }
`

export const PageSubTabs = styled(RouteTabs)`
  ${respondTo("sm")} {
    width: max-content;
    min-width: 350px;
  }
`
