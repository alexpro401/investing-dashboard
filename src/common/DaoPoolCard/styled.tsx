import styled from "styled-components"
import { Text } from "theme"

export const Root = styled.div`
  background: ${(props) => props.theme.backgroundColors.secondary};
  border-radius: 20px;
  color: ${(props) => props.theme.textColors.primary};
`

export const DaoPoolCardTitle = styled(Text).attrs(() => ({
  color: "#ffffff",
  fw: 700,
  fz: 16,
  lh: "20px",
}))``

export const DaoPoolCardDescription = styled(Text).attrs(() => ({
  block: true,
  color: "#B1C7FC",
  fw: 400,
  fz: 13,
  lh: "15px",
}))<{ align?: string }>`
  text-align: ${({ align }) => align ?? "right"};
`

export const DaoPoolCardVotingPower = styled(Text).attrs(({ theme }) => ({
  color: theme.statusColors.success,
  fw: 700,
  fz: 16,
  lh: "16px",
}))`
  letter-spacing: 1px;
`

export const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0 12px;
`
