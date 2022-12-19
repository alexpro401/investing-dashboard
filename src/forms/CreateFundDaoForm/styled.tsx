import styled, { css } from "styled-components"

import { StepsNavigation } from "common"
import StepsControllerContext from "context/StepsControllerContext"
import { motion } from "framer-motion"
import { opacityVariants } from "motion/variants"

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

export const StepsSideNavigation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: max-content;
  white-space: nowrap;
  height: 100%;
  padding: 20px;
`

export const StepsSideNavigationItem = styled.div<{
  isPassed: boolean
  isActive: boolean
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #293c54;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: 0.01em;
  padding: 16px;
  border-radius: 14px;

  ${(props) =>
    props.isActive
      ? css`
          background: #181e2c;
          color: #2669eb;
        `
      : css``}
`

export const StepsSideNavigationItemIcon = styled.div<{
  isPassed: boolean
  isActive: boolean
}>`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid #293c54;

  ${(props) =>
    props.isPassed
      ? css`
          background: #293c54;
        `
      : css``}

  ${(props) =>
    props.isActive
      ? css`
          background: #2669eb;
          color: #181e2c;
        `
      : css``}
`

export const StepsSideNavigationItemText = styled.span<{
  isPassed: boolean
  isActive: boolean
}>``
