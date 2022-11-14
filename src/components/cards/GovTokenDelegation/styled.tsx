import styled from "styled-components"
import { motion } from "framer-motion"
import { Card } from "common"
import { opacityVariants } from "motion/variants"

export const Container = styled(motion.div).attrs(() => ({
  variants: opacityVariants,
  initial: "hidden",
  animate: "visible",
}))`
  width: 100%;
`
export const Content = styled(Card)`
  width: 100%;
  padding-bottom: 0;
`

export const LegendDot = styled.div<{ color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 4px;
  background: ${({ color }) => color ?? "transparent"};
`

export const CollapseButton = styled.button`
  background: none;
  appereance: none;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.textColors.secondary};
  cursor: pointer;
  padding: 8px 0;
  margin: 0 auto;

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
