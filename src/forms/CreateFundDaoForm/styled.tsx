import styled from "styled-components/macro"

import StepsControllerContext from "context/StepsControllerContext"
import { motion } from "framer-motion"
import { opacityVariants } from "motion/variants"
import { respondTo } from "theme"
import { SideStepsNavigationBar } from "common"

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
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 767px;
  margin: 0 auto;
  align-self: center;
`

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
  flex: 1;
`

export const StepsWrapper = styled.div`
  display: flex;
  overflow: hidden auto;
  flex: 1;
  height: 100%;

  ${respondTo("sm")} {
    padding-bottom: 40px;
    padding-right: 260px;
  }
`

export const SideStepsNavigationBarWrp = styled(SideStepsNavigationBar)`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  z-index: 1;
`
