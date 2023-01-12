import styled from "styled-components/macro"
import { respondTo } from "theme"
import RouteTabs from "components/RouteTabs"

export const ListTopWrp = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${respondTo("sm")} {
    justify-content: space-between;
  }
`

export const PageSubTabs = styled(RouteTabs)`
  ${respondTo("sm")} {
    width: max-content;
    min-width: 350px;
  }
`

export const ListTopInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.brandColors.secondary};
`
