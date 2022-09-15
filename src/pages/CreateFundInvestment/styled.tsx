import styled from "styled-components"
import { motion } from "framer-motion"

export const Container = styled(motion.div)`
  margin: 0 auto;
  background-color: #040a0f;
  width: fill-available;
  height: calc(100vh - 94px);
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`
