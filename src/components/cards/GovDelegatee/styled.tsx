import styled from "styled-components"
import { motion } from "framer-motion"
import { AppButton, Card } from "common"
import { opacityVariants } from "motion/variants"

export const Container = styled(motion.a).attrs(() => ({
  variants: opacityVariants,
  initial: "hidden",
  animate: "visible",
  target: "_blank",
  rel: "noopener noreferrer",
}))`
  display: block;
  width: 100%;
  text-decoration: none;
`

export const Content = styled(Card)`
  width: 100%;
  background-color: ${({ theme }) => theme.textColors.secondaryNegative};
`

export const ActionBase = styled(AppButton)`
  width: 100%;
  font-size: 13px;
  font-weight: 700;
  line-height: 16px;
`

export const ActionSecondary = styled(ActionBase).attrs(() => ({
  color: "default",
}))`
  color: ${({ theme }) => theme.textColors.secondary};
  margin-top: 4px;
  font-weight: 600;
`
