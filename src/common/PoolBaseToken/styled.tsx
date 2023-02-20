import styled from "styled-components/macro"
import TokenIcon from "components/TokenIcon"
import { respondTo } from "theme"

export const PoolBaseTokenContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${respondTo("xs")} {
    flex-direction: row-reverse;
  }
`

export const PoolBaseTokenTokenIcon = styled(TokenIcon).attrs(() => ({
  size: 38,
  m: "0",
}))``

export const PoolBaseTokenImage = styled.img`
  width: 38px;
  height: 38px;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
`

export const PoolBaseTokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;

  ${respondTo("xs")} {
    flex-direction: column-reverse;
  }
`

export const PoolBaseTokenDetailsLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  line-height: 15px;
  color: #b1c7fc;

  ${respondTo("xs")} {
    align-self: flex-start;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;

    /* Text/dark gray */

    color: #6781bd;
  }
`

export const PoolBaseTokenDetailsValue = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 900;
  font-size: 24px;
  line-height: 30px;
  text-align: right;
  letter-spacing: -0.01em;
  color: #e4f2ff;
  width: 100%;

  ${respondTo("xs")} {
    flex-direction: column;
  }
`

export const PoolBaseTokenDetailsPercentage = styled.span<{
  isRaise?: boolean
}>`
  font-weight: 600;
  font-size: 11px;
  line-height: 13px;
  color: #9ae2cb;

  ${respondTo("xs")} {
    align-self: flex-end;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    padding: 2px 4px;
    width: auto;
    color: #e4f2ff;
    background: ${(props) => (props.isRaise ? "#337833" : "#68282C")};
    border-radius: 5px;
  }
`
