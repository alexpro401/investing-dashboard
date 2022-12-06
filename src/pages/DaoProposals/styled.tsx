import styled from "styled-components"
import RouteTabs from "components/RouteTabs"

export const Root = styled.div`
  overflow: hidden auto;
  flex: 1;
  height: calc(100vh - 94px);
  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const PageSubTabs = styled(RouteTabs)`
  margin: 16px 0 0;
`
