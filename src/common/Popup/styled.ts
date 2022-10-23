import { motion } from "framer-motion"
import styled from "styled-components"

export const Backdrop = styled(motion.div).attrs(() => ({
  initial: { opacity: 0, pointerEvents: "none" },
  animate: { opacity: 1, pointerEvents: "auto" },
  exit: { opacity: 0, pointerEvents: "none" },
}))`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  background-filter: blur(50px);
`

export const ModalPane = styled(motion.div).attrs(() => ({
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: {
    hidden: {
      y: "100vh",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  },
  transition: { duration: 0.5 },
}))`
  background: ${(props) => props.theme.additionalColors.primary};
  color: ${(props) => props.theme.textColors.primary};
  border-radius: 16px;
  padding: 20px;
  margin: 16px;
  width: auto;
`
