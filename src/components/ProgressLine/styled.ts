import styled from "styled-components/macro"
import { motion } from "framer-motion"

export const Container = styled.div`
  background: #293c54;
  box-shadow: inset 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  height: 3px;
  width: 100%;
  overflow: hidden;
`

export const Progress = styled(motion.div).attrs(() => ({
  initial: "hidden",
  transition: { duration: 0.5 },
}))`
  background: ${({ theme }) => theme.brandColors.primary};
  box-shadow: 0 1px 4px rgba(164, 235, 212, 0.29),
    0 2px 5px rgba(164, 235, 212, 0.14);
  border-radius: 2px;
  height: 3px;
`
