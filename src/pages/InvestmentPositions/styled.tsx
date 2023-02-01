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
  color: #6781bd;
`

export const InvestorPositionsListWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${respondTo("lg")} {
    background: rgba(20, 25, 38, 0.5);
    border-radius: 20px;
    padding: 0 8px 8px;
  }
`

export const InvestorPositionsListHead = styled.div<{ childMaxWidth?: string }>`
  display: none;

  ${respondTo("lg")} {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 145px)) 1fr;
    justify-items: flex-start;
    gap: 0 var(--app-gap);
    padding: 8px 16px 0;
  }
`

export const InvestorPositionsListHeadItem = styled.div`
  ${respondTo("lg")} {
    width: 100%;
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
