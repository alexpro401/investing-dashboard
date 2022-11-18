import styled from "styled-components"
import theme, { Flex } from "theme"
import { motion } from "framer-motion"

export const Container = styled(motion.div)<{ maxWidth?: string }>`
  background: ${theme.backgroundColors.secondary};
  border-radius: 20px;
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  bottom: 0;
  margin: auto;
  height: fit-content;
  z-index: 100;
  padding: 0;
  max-width: ${({ maxWidth }) => maxWidth || "375px"};
`

export const Overlay = styled(motion.div)`
  background: rgba(27, 27, 27, 0.6);
  backdrop-filter: blur(6px);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 80;
  height: 100%;
  width: 100%;
`

export const Head = styled(Flex)`
  width: fill-available;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`

export const Title = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${theme.textColors.primary};
`
