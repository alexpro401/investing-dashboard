import styled from "styled-components"
import { motion } from "framer-motion"

import { opacityVariants } from "motion/variants"
import { AppButton } from "common"

export const StepsContainer = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
  variants: opacityVariants,
}))`
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
`

export const VotingSettingsModalButton = styled(AppButton)`
  font-size: 13px;
`
