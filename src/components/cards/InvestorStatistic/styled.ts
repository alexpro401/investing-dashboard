import { AppButton } from "common"
import styled from "styled-components/macro"
import theme, { Text } from "theme"

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
  width: 100%;
`
export const InvestorStatisticValue = styled(Text).attrs(() => ({
  color: "#f7f7f7",
  fw: 600,
  fs: 16,
  lh: "16px",
}))``

export const NewInvestment = styled(AppButton).attrs(() => ({
  color: "secondary",
  type: "button",
  size: "small",
}))`
  font-weight: 600;
  color: ${theme.textColors.primary};
  width: fill-available;
`

export const MyInvestments = styled(AppButton).attrs(() => ({
  color: "primary",
  type: "button",
  size: "small",
}))`
  width: fill-available;
`
