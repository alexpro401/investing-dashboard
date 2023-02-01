import styled from "styled-components/macro"
import { Flex } from "theme"

export const ChartTreasuryWrp = styled.div`
  display: grid;
  gap: 24px;
  grid-template-rows: max-content 1fr;
  grid-template-columns: auto 300px;
  width: 100%;
`

export const ChartSection = styled(Flex).attrs(() => ({}))``

export const TreasurySection = styled(Flex).attrs(() => ({}))`
  width: 300px;
  height: 100px;
  background-color: red;
`
