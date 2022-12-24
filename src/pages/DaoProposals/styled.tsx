import styled from "styled-components/macro"
import RouteTabs from "components/RouteTabs"
import HeaderTabs from "components/Header/Tabs"
import { respondTo } from "theme"

export const Root = styled.div`
  overflow: hidden auto;
  flex: 1;
`

export const HeadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const PageTitle = styled.h2`
  font-size: 24px;
  line-height: 1.25;
  font-weight: 900;
  color: #e4f2ff;
  margin: 0;
`

export const PageHeadTabs = styled(HeaderTabs)`
  width: auto;
  height: auto;
  justify-content: flex-start;
  gap: 32px;

  &:before {
    top: auto;
    bottom: 0;
    background: #2669eb;
  }
`

export const PageSubTabs = styled(RouteTabs)`
  margin: 16px 0 0;

  ${respondTo("sm")} {
    width: max-content;
    min-width: 350px;
  }
`
