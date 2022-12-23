import styled from "styled-components/macro"
import { motion } from "framer-motion"
import { AppButton, Card } from "common"
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

export const ChartContainer = styled.div`
  height: 80px;
  width: 280px;
  margin: 0 auto;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 79px;
    z-index: 1;
    background: linear-gradient(
      180deg,
      rgba(24, 30, 44, 0) 58.53%,
      #181e2c 92.23%
    );
  }
`

export const LegendDot = styled.div<{ color: string }>`
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 8px;
  border-radius: 4px;
  background: ${({ color }) => color ?? "transparent"};
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
