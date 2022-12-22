import styled from "styled-components"
import theme, { Flex } from "theme"

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 8px 8px 16px;
  gap: 62px;
  isolation: isolate;
  width: fill-available;
  height: 48px;
  background: #1c2437;
  border-radius: 16px;
  flex: none;
  order: 0;
  flex-grow: 0;
`

export const VotingPower = styled(Flex)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: ${theme.textColors.primary};
  flex: none;
  order: 0;
  flex-grow: 0;
`

export const RightNode = styled(Flex)`
  align-items: center;
  padding: 0;
  gap: 8px;
  flex: none;
  order: 1;
  flex-grow: 0;
  z-index: 0;
`

export const TokenId = styled(Flex)`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  text-align: right;
  color: ${theme.textColors.secondary};
  flex: none;
  order: 0;
  flex-grow: 0;
  transform: translateY(1px);
`
