import styled from "styled-components/macro"
import RouteTabs from "components/RouteTabs"
import { respondTo } from "theme"

export const PageSubTabs = styled(RouteTabs)`
  ${respondTo("sm")} {
    width: max-content;
    min-width: 350px;
  }
`
