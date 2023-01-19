import { motion } from "framer-motion"
import styled from "styled-components/macro"

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const Container = styled(motion.div).attrs(() => ({
  variants,
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  transition: { duration: 0.2 },
}))`
  overflow: hidden auto;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  padding: var(--app-padding);
  min-height: 100%;
`
