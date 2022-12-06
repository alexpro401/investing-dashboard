import { Icon } from "common"
import styled from "styled-components"

export const LockedIcon = styled(Icon)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  transition: opacity 0.1s;

  & > svg {
    height: 16px;
    width: 16px;
  }
`

export const NftIcon = styled.img`
  height: 32px;
  width: 32px;
`

export const Container = styled.div<{ locked?: boolean; round?: boolean }>`
  position: relative;
  overflow: hidden;
  width: 32px;
  height: 32px;
  background: #000000;
  border-radius: ${({ round }) => (round ? "50%" : "10px")};
  flex: none;
  order: 1;
  flex-grow: 0;

  ${NftIcon}, img {
    opacity: ${({ locked }) => (locked ? 0.6 : 1)};
    filter: ${({ locked }) => (locked ? "blur(0.3px)" : "none")};
  }
`
