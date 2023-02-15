import styled, { css } from "styled-components/macro"
import { respondTo } from "theme"
import RouteTabs from "components/RouteTabs"
import { isNil } from "lodash"

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

export const RiskyPositionsListWrp = styled.div`
  ${respondTo("lg")} {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: rgba(20, 25, 38, 0.5);
    border-radius: 20px;
    padding: 0 8px 8px;
  }
`

export const RiskyPositionsListHead = styled.div<{
  childMaxWidth?: string
}>`
  display: none;

  ${respondTo("lg")} {
    display: grid;
    justify-items: stretch;
    gap: calc(var(--app-gap) / 2) var(--app-gap);
    padding: 8px 16px 0;
    grid-template-columns: repeat(5, minmax(0, 142px)) 1fr;
    ${({ childMaxWidth }) =>
      !isNil(childMaxWidth)
        ? css`
            grid-template-columns: repeat(5, minmax(0, ${childMaxWidth})) 1fr;
          `
        : css`
            grid-template-columns: repeat(5, minmax(0, 142px)) 1fr;
          `}
  }
`

export const RiskyPositionsListHeadItem = styled.div`
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

export const FundRiskyProposalsListWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 0 auto;

  ${respondTo("lg")} {
    gap: 16px;
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
