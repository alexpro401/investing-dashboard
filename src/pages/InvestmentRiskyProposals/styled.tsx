import styled from "styled-components/macro"
import RouteTabs from "components/RouteTabs"
import { respondTo } from "theme"

export const PageSubTabs = styled(RouteTabs)`
  ${respondTo("sm")} {
    width: max-content;
    min-width: 350px;
  }
`

export const InvestorRiskyPositionsListWrp = styled.div`
  ${respondTo("lg")} {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(20, 25, 38, 0.5);
    border-radius: 20px;
    padding: 0 8px 8px;
  }
`

export const InvestorRiskyPositionsListHead = styled.div<{
  childMaxWidth?: string
}>`
  display: none;

  ${respondTo("lg")} {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    grid-column-gap: 12px;
    padding: 8px 16px 0;

    & > * {
      flex: 1 0 155px;
      max-width: ${({ childMaxWidth }) => childMaxWidth ?? "167px"};
    }
  }
`

export const InvestorRiskyPositionsListHeadItem = styled.div`
  ${respondTo("lg")} {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 0 4px;
    padding: 8px 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: #6781bd;
  }
`

export const InvestorRiskyProposalsListWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 0 auto;

  ${respondTo("lg")} {
    gap: 16px;
  }
`
