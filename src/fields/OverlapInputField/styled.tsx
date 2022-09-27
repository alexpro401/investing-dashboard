import styled, { css } from "styled-components"
import { motion } from "framer-motion"
import { fieldPaddingLeft, fieldPaddingRight } from "fields/styled"

export const Root = styled.div<{
  isOverlapping: boolean
}>`
  position: relative;

  ${(props) =>
    props.isOverlapping
      ? css`
          & input {
            color: transparent;
            -webkit-text-fill-color: transparent;
            fill: transparent;
          }
        `
      : ""}
`

export const OverlapNodeLeft = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
  delay: { duration: 0.5 },
}))`
  position: absolute;
  top: 50%;
  left: ${fieldPaddingLeft}px;
  transform: translateY(-50%);
  z-index: 2;
`

export const OverlapNodeRight = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
  delay: { duration: 0.5 },
}))`
  position: absolute;
  top: 50%;
  right: ${fieldPaddingRight}px;
  transform: translateY(-50%);
  z-index: 2;
`
