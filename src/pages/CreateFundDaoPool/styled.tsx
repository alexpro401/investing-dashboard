import styled from "styled-components"
import { motion } from "framer-motion"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const Container = styled(motion.div)`
  margin: 0 auto;
  background-color: #040a0f;
  overflow-y: auto;
  flex: 1;
`
