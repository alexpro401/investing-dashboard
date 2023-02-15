import styled from "styled-components/macro"
import { AppButton } from "common"
import { respondTo } from "theme"

export const TabCardTitle = styled.span`
  font-size: 14px;
  line-height: 1.25;
  font-weight: 600;
  color: ${(props) => props.theme.brandColors.secondary};
`

export const PnlSubChartCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: var(--app-gap);

  ${respondTo("md")} {
    flex-direction: row;
    align-items: center;
  }
`

export const PnlSubChartCardItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  width: 100%;

  ${respondTo("md")} {
    width: auto;

    &:last-child {
      margin-left: auto;
    }
  }
`

export const TabCardLabel = styled.span`
  font-size: 13px;
  line-height: 1.25;
  font-weight: 500;
  color: ${(props) => props.theme.textColors.secondary};
`

export const TabCardValue = styled.span`
  font-weight: 600;
  font-size: 13px;
  line-height: 1.25;
  color: ${(props) => props.theme.textColors.primary};
`

export const Link = styled.a`
  display: block;
  width: 100%;
  text-decoration: none;
  color: initial;
`

export const AppButtonFull = styled(AppButton)`
  width: 100%;
  border: none;
`

export const AppLink = styled(AppButton).attrs(() => ({
  color: "default",
  size: "small",
}))`
  padding: 0;
  border-radius: 0;
`

export const GridTwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 48px;
`

const BarContainer = styled.div`
  background: #293c54;
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  height: 3px;
  width: 100%;
`

const BarProgress = styled.div<{ w: number }>`
  background: #7fffd4;
  box-shadow: 0 1px 4px rgba(164, 235, 212, 0.29),
    0 2px 5px rgba(164, 235, 212, 0.14);
  border-radius: 2px;
  height: 3px;
  width: ${(props) => props.w || 0}%;
  transition: width 0.3s ease-in-out;
`

export const ProgressBar = ({ w }) => {
  return (
    <BarContainer>
      <BarProgress w={w} />
    </BarContainer>
  )
}
