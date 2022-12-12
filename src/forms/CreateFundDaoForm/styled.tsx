import styled from "styled-components"

import { StepsNavigation } from "common"
import StepsControllerContext from "context/StepsControllerContext"
import { motion } from "framer-motion"
import { opacityVariants } from "motion/variants"

export const Container = styled(StepsControllerContext)`
  display: flex;
  margin: 0 auto;
  background-color: #040a0f;
  width: 100%;
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const StepsContainer = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
  variants: opacityVariants,
}))`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
  flex: 1;
`

export const StepsBottomNavigation = styled(StepsNavigation)`
  margin-top: auto;
`
