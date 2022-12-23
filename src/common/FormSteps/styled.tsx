import styled from "styled-components/macro"
import { motion } from "framer-motion"

import { opacityVariants } from "motion/variants"
import { respondTo } from "theme"
import { SideStepsNavigationBar } from "common"
import StepsControllerContextProvider from "context/StepsControllerContext"

export const StepsFormContainer = styled(StepsControllerContextProvider)`
  display: flex;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`

export const StepsWrapper = styled.div`
  display: flex;
  flex: 1;

  ${respondTo("sm")} {
    padding-bottom: 40px;
  }
`

export const SideStepsNavigationBarWrp = styled(SideStepsNavigationBar)`
  min-width: 300px;
  position: sticky;
  top: 0px;
`

export const StepsContainer = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
  variants: opacityVariants,
}))`
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;

  ${respondTo("sm")} {
    width: auto;
    max-width: 775px;
  }
`

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
`
