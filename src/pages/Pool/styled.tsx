import styled from "styled-components"
import { motion } from "framer-motion"

import { AppButton } from "common"
import { Text } from "theme"

export const Container = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}))`
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 1fr;
  grid-gap: 40px;
  width: 100%;
  max-height: 100%;
  height: calc(100vh - 94px);
  overflow: hidden auto;
  padding-bottom: 16px;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const Indents = styled.div<{ top?: boolean; side?: boolean }>`
  width: 100%;
  margin-top: ${({ top = false }) => (top ? "16px" : "0")};
  padding-left: ${({ side = true }) => (side ? "16px" : "0")};
  padding-right: ${({ side = true }) => (side ? "16px" : "0")};
`

export const Label = styled(Text).attrs(() => ({
  color: "#B1C7FC",
  fz: 13,
  fw: 500,
  lh: "15px",
}))``

export const Value = {
  Big: styled(Text).attrs(() => ({
    fz: 16,
    fw: 700,
    lh: "19px",
  }))``,
  Medium: styled(Text).attrs(() => ({
    fz: 13,
    fw: 600,
    lh: "16px",
  }))``,
  MediumThin: styled(Text).attrs(() => ({
    fz: 13,
    fw: 500,
    lh: "19px",
  }))``,
}

export const AppButtonFull = styled(AppButton)`
  width: 100%;
`
export const AppLink = styled(AppButton).attrs(() => ({
  color: "default",
  size: "small",
}))`
  padding: 0;
  border-radius: 0;
`
export const AppNavigation = styled(AppButton).attrs(() => ({
  color: "default",
  size: "x-small",
  scheme: "filled",
  iconSize: 26,
}))`
  padding: 4px 5.5px;
  color: #e4f2ff;
`

export const GridTwoColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 48px;
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(32, 41, 58, 0.6);
  opacity: 0.5;
`

export const Link = styled.a`
  display: block;
  width: 100%;
  text-decoration: none;
  color: initial;
`

const BarContainer = styled.div`
  background: #293c54;
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  height: 3px;
  width: 100%;
`

const BarProgress = styled.div<{ w: number }>`
  background: #7fffd4;
  box-shadow: 0 1px 4px rgba(164, 235, 212, 0.29),
    0 2px 5px rgba(164, 235, 212, 0.14);
  border-radius: 2px;
  height: 3px;
  width: ${(props) => props.w || 0}%;
  transition: width 0.3s ease-in-out;
`

export const ProgressBar = ({ w }) => {
  return (
    <BarContainer>
      <BarProgress w={w} />
    </BarContainer>
  )
}

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-gap: 16px;
  width: 100%;
`
