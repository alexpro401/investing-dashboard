import styled from "styled-components"
import { Text } from "theme"

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 16px;
  width: 100%;
`
export const InvestorStatisticValue = styled(Text).attrs(() => ({
  color: "#f7f7f7",
  fw: 600,
  fs: 16,
  lh: "16px",
}))``
