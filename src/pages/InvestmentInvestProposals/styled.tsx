import styled from "styled-components/macro"
import { respondTo } from "theme"
import RouteTabs from "components/RouteTabs"

export const PageSubTabs = styled(RouteTabs)`
  ${respondTo("sm")} {
    width: max-content;
    min-width: 350px;
  }
`
