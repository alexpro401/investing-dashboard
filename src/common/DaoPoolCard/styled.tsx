import styled from "styled-components/macro"
import { respondTo, Text } from "theme"
import { Card, Icon } from "common"

export const DaoPoolCardRoot = styled(Card)`
  background: ${(props) => props.theme.backgroundColors.secondary};
  border-radius: 20px;
  color: ${(props) => props.theme.textColors.primary};
  cursor: pointer;

  ${respondTo("lg")} {
    flex-direction: row;
    align-items: center;
    border-radius: 60px 24px 24px 60px;
    padding: 0 24px 0 0;
  }
`

export const DaoPoolCardHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${respondTo("lg")} {
    width: initial;
    min-width: 30%;
  }
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

  ${respondTo("lg")} {
    font-size: 12px;
    font-weight: 500;
    color: #6781bd;
  }
`

export const DaoPoolCardShowVotingPower = styled(Icon)`
  height: 16px;

  ${respondTo("lg")} {
    height: 25px;
  }
`
export const DaoPoolCardVotingPower = styled(Text)`
  letter-spacing: 1px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.statusColors.success};

  ${respondTo("lg")} {
    font-size: 20px;
    font-weight: 900;
    line-height: 25px;
    color: rgba(228, 242, 255, 0.8);
  }
`

export const DaoPoolCardStatisticWrp = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  ${respondTo("lg")} {
    gap: 24px;
  }
`

export const DaoPoolCardStatisticItem = styled.div<{ alignItems?: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: ${({ alignItems }) => alignItems ?? "flex-start"};
  gap: 4px;

  ${respondTo("lg")} {
    gap: 0;
  }
`
export const DaoPoolCardStatisticLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  line-height: 20px;
  color: ${({ theme }) => theme.textColors.secondary};

  ${respondTo("lg")} {
    font-size: 12px;
    color: #6781bd;
  }
`
export const DaoPoolCardStatisticValue = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  color: rgba(228, 242, 255, 0.8);

  ${respondTo("lg")} {
    font-size: 20px;
    font-weight: 900;
    line-height: 25px;
  }
`
