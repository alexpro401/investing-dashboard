import styled from "styled-components/macro"
import { motion } from "framer-motion"

export const PageHolder = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}))`
  width: 100%;
  overflow-y: auto;
`

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`
