import { motion } from "framer-motion"
import styled from "styled-components"
import { Text } from "theme"

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const Container = styled(motion.div).attrs(() => ({
  variants,
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  transition: { duration: 0.2 },
}))`
  display: grid;
  grid-template-rows: max-content 1fr;
  grid-gap: 40px;

  margin: 0 auto;
  width: fill-available;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.backgroundColors.primary};
  height: calc(100vh - 94px);

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

export const CardButtons = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`

export const CardDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #20293a;
`

export const ValidatorVotingPower = styled(Text).attrs(() => ({
  fw: 700,
  fz: 13,
  lg: "16px",
}))`
  background: linear-gradient(64.44deg, #2680eb 32.35%, #7fffd4 100%);
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
