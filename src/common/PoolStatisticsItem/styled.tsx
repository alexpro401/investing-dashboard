import styled from "styled-components/macro"
import TokenIcon from "components/TokenIcon"
import { respondTo } from "theme"

export const PoolStatisticsItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PoolStatisticsItemTokenIcon = styled(TokenIcon).attrs(() => ({
  m: "0",
}))``

export const PoolStatisticsItemImage = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
`

export const PoolStatisticsItemDetails = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`

export const PoolStatisticsItemDetailsLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: flex-start;
  font-weight: 500;
  font-size: 12px;
  line-height: 1.5;
  color: #6781bd;
`

export const PoolStatisticsItemDetailsValue = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 16px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #e4f2ff;
  gap: 4px;

  ${respondTo("xs")} {
    font-weight: 900;
    font-size: 24px;
    line-height: 30px;
    /* identical to box height */

    text-align: right;
    letter-spacing: -0.01em;

    /* Text/white */

    color: #e4f2ff;
  }
`

export const PoolStatisticsItemDetailsPercentage = styled.span<{
  isRaise?: boolean
}>`
  align-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  padding: 2px 8px;
  width: auto;

  /* Text/white */

  color: #e4f2ff;

  background: ${(props) => (props.isRaise ? "#337833" : "#68282C")};
  border-radius: 5px;
`

export const PoolStatisticsItemDetailsPercentageLabel = styled(
  PoolStatisticsItemDetailsPercentage
)`
  background: #2669eb;
`
