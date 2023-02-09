import styled from "styled-components/macro"
import { respondTo } from "theme"

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
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 155px)) 1fr;
    justify-items: flex-start;
    gap: 0 var(--app-gap);
    padding: 8px 16px 0;
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

export const InvestorRiskyPositionsListBody = styled.div`
  width: fill-available;
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);

  ${respondTo("lg")} {
    gap: calc(var(--app-gap) / 2);
  }
`
