import styled from "styled-components/macro"
import { motion } from "framer-motion"

export const OutletWrp = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden auto;
  padding: var(--app-padding);
`

export const PageHolder = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}))`
  width: 100%;
  flex: 1;
`

export const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--app-gap);
  flex: 1;
`

export const SkeletonLoader = styled.div<{
  alignItems?: "flex-start" | "flex-end" | "center"
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: ${(props) => props.alignItems ?? "flex-start"};
  gap: var(--app-gap);
`
