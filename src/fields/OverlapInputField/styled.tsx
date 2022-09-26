import styled from "styled-components"
import { motion } from "framer-motion"
import { fieldBg, fieldPaddingLeft, fieldPaddingRight } from "fields/styled"

export const Root = styled.div`
  position: relative;
`

export const Backdrop = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 95%;
  height: 80%;
  transform: translate(-50%, -50%);
  background: ${fieldBg};
  z-index: 1;
`

export const OverlapNodeLeft = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: ${fieldPaddingLeft}px;
  transform: translateY(-50%);
  z-index: 2;
`

export const OverlapNodeRight = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: ${fieldPaddingRight}px;
  transform: translateY(-50%);
  z-index: 2;
`
