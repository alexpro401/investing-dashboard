import styled from "styled-components/macro"
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

  * {
    font-family: ${theme.appFontFamily};
  }
`

export const Head = styled(Flex)`
  width: fill-available;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`

export const Title = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: ${theme.textColors.primary};
`
