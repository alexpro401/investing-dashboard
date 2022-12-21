import styled from "styled-components"
import { Text } from "theme"
import { Card } from "common"

export const Container = styled(Card)`
  width: 100%;

  //@media screen and (min-width: 744px) {
  //  flex-direction: row;
  //  border-radius: 60px 24px 24px 60px;
  //  padding: 0 16px 0 0;
  //}

  @media screen and (min-width: 1194px) {
    flex-direction: row;
    border-radius: 60px 24px 24px 60px;
    padding: 0 16px 0 0;
  }
`

export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
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
  color: "#B1C7FC",
  fw: 600,
  fz: 11,
  lh: "20px",
}))``

export const CardInfoValue = styled(Text).attrs(() => ({
  block: true,
  color: "#f7f7f7",
  fw: 600,
  fz: 16,
  lh: "16px",
}))``
