import styled from "styled-components/macro"
import { Text } from "theme"
import { Icon } from "common"

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
  lh: "15px",
}))<{ align?: string }>`
  text-align: ${({ align }) => align ?? "right"};
  font-size: 13px;
  font-weight: 400;
  color: ${({ theme }) => theme.textColors.secondary};

  @media screen and (min-width: 1194px) {
    font-size: 12px;
    font-weight: 500;
    color: #6781bd;
  }
`

export const DaoPoolCardShowVotingPower = styled(Icon)`
  height: 16px;

  @media screen and (min-width: 1194px) {
    height: 25px;
  }
`
export const DaoPoolCardVotingPower = styled(Text)`
  letter-spacing: 1px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.statusColors.success};

  @media screen and (min-width: 1194px) {
    font-size: 20px;
    font-weight: 900;
    line-height: 25px;
    color: rgba(228, 242, 255, 0.8);
  }
`

export const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0 12px;
`
