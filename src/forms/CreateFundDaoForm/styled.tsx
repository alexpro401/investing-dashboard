import styled from "styled-components"

import { StepsNavigation } from "common"
import StepsControllerContext from "context/StepsControllerContext"
import { motion } from "framer-motion"
import { opacityVariants } from "motion/variants"
import { respondTo } from "theme"

export const Container = styled(StepsControllerContext)`
  display: flex;
  margin: 0 auto;
  background-color: #ff0000;
  width: 100%;
  overflow-y: auto;
`

export const StepsContainer = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
  variants: opacityVariants,
}))`
  overflow: hidden auto;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 775px;
  margin: 0 auto;
  align-self: center;

  ${respondTo("sm")} {
    padding-bottom: 40px;
  }
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

export const StepsWrapper = styled.div`
  display: flex;
  flex: 1;
  height: 100%;
`
