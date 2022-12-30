import styled from "styled-components/macro"
import { respondTo, Text } from "theme"
import { Card } from "common"

export const Container = styled(Card)`
  width: 100%;

  ${respondTo("lg")} {
    flex-direction: row;
    align-items: center;
    border-radius: 60px 24px 24px 60px;
    padding: 0 24px 0 0;
  }
`

export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;

  ${respondTo("lg")} {
    width: initial;
    min-width: 35%;
  }
`

export const HeaderNodeLeft = styled.div`
  margin-right: 12px;
`
export const HeaderNodeRight = styled.div`
  margin-left: auto;
`

export const Divider = styled.div`
  background: radial-gradient(
      54.8% 53% at 50% 50%,
      #587eb7 0%,
      rgba(88, 126, 183, 0) 100%
    ),
    radial-gradient(
      60% 51.57% at 50% 50%,
      #6d99db 0%,
      rgba(109, 153, 219, 0) 100%
    ),
    radial-gradient(
      69.43% 69.43% at 50% 50%,
      rgba(5, 5, 5, 0.5) 0%,
      rgba(82, 82, 82, 0) 100%
    );
  opacity: 0.1;
  width: fill-available;
  margin-left: 63px;
  height: 1px;
`

export const CardInfoLabel = styled(Text).attrs(() => ({
  block: true,
  fw: 600,
  lh: "20px",
}))`
  font-size: 11px;
  color: ${({ theme }) => theme.textColors.secondary};

  ${respondTo("lg")} {
    font-size: 12px;
    color: #6781bd;
  }
`

export const CardInfoValue = styled(Text).attrs(() => ({
  block: true,
  color: "rgba(228, 242, 255, 0.8)",
}))`
  font-size: 16px;
  font-weight: 600;
  line-height: 1;

  ${respondTo("lg")} {
    font-size: 20px;
    font-weight: 900;
    line-height: 25px;
  }
`
