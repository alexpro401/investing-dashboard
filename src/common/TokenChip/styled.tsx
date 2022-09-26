import styled from "styled-components"
import { Icon } from "common"

export const Root = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.textColors.primary};
  gap: 4px;
`

export const TokenChipSymbol = styled.span`
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
  color: ${(props) => props.theme.textColors.primary};
`

export const TokenChipIcon = styled.img`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
`

export const TokenChipFallbackIcon = styled.span`
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  border-radius: 50%;
  background: ${(props) => props.theme.textColors.primary};
  color: ${(props) => props.theme.backgroundColors.secondary};
  font-weight: 700;
`

export const TokenChipIconDecor = styled(Icon)`
  width: 18px;
  height: 18px;
`

export const TokenChipLink = styled.a`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`
