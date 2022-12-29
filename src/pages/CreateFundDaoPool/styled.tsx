import styled from "styled-components/macro"
import { motion } from "framer-motion"

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

export const Container = styled(motion.div)`
  margin: 0 auto;
  flex: 1;
  width: 100%;
`
