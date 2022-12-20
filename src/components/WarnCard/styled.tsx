import styled from "styled-components"
import { Flex } from "theme"

export const Card = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  margin: 16px;
  gap: 16px;

  width: fill-available;
  height: fit-content;

  background: ${({ theme }) => theme.textColors.secondaryNegative};
  border: 1px solid ${({ theme }) => theme.statusColors.error};
  border-radius: 24px;
`

export const Head = styled(Flex)`
  font-family: ${(props) => props.theme.appFontFamily};
  gap: 8px;
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 130%;
  color: ${({ theme }) => theme.statusColors.error};
`

export const Text = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
  color: ${({ theme }) => theme.textColors.primary};
`

export const Inner = styled(Text)``
