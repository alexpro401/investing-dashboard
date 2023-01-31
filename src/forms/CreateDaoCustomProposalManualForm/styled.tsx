import styled from "styled-components/macro"

import { Flex } from "theme"

export const DesktopHeaderWrp = styled.div`
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
`

export const Address = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.textColors.primary};
`

export const TokenLabel = styled.span`
  font-weight: 400;
  font-size: 16px;
  color: #788ab4;
`

export const ButtonsContainer = styled(Flex)`
  width: fill-available;
  justify-content: space-around;
`

export const SelectFieldAddress = styled.span`
  color: ${({ theme }) => theme.textColors.primary};
`
