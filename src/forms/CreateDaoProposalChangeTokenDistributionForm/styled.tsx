import styled from "styled-components/macro"
import { motion } from "framer-motion"

import { opacityVariants } from "motion/variants"
import { respondTo } from "theme"
import { SideStepsNavigationBar } from "common"

export const ContainerWrp = styled.div`
  overflow: hidden;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;

  ${respondTo("sm")} {
    display: grid;
    grid-template-columns: 1fr 0.65fr;
    gap: 24px;
    padding: 0 20px;
  }
`

export const SideStepsNavigationBarWrp = styled(SideStepsNavigationBar)`
  width: 100%;
  height: 100%;
`

export const StepsContainer = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
  variants: opacityVariants,
}))`
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  height: 100%;
`
