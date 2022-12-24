import styled from "styled-components/macro"
import { Flex } from "theme"
import { Card } from "common"

export const Container = styled(Card)`
  width: 100%;
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

export const Content = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0 12px;
`

export const Item = styled(Flex)`
  flex-direction: column;
  flex: 1;
  align-items: flex-start;

  &:nth-child(1) {
    justify-self: start;
  }
  &:nth-child(2) {
    justify-self: start;
  }
  &:nth-child(3) {
    justify-self: start;
  }
  &:nth-child(4) {
    justify-self: center;
  }
`
