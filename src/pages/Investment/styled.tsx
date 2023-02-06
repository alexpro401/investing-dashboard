import styled from "styled-components/macro"
import { respondTo } from "theme"
import HeaderTabs from "components/Header/Tabs"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  padding: var(--app-padding);
  flex: 1;
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
