import { motion } from "framer-motion"
import styled from "styled-components"
import { Flex, GradientBorder, respondTo } from "theme"

export const Overlay = styled(motion.div)`
  background: rgba(27, 27, 27, 0.6);
  backdrop-filter: blur(20px);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 101;
  height: 100%;
  width: 100%;
`

export const Root = styled(Flex)`
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 210px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 102;
`
export const Container = styled(GradientBorder)`
  max-width: 400px;
  min-width: 320px;
  padding: 16px;
  flex-direction: column;
  border-radius: 16px;

  ${respondTo("lg")} {
    padding: 24px 42px 22px;
  }

  &::after {
    background: linear-gradient(64.44deg, #191e2b 32.35%, #272e3e 100%);
  }
`
export const Title = styled.p`
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: #e4f2ff;
`
export const Text = styled.p`
  margin: 16px 0;
  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 500;
  font-size: 13px;
  line-height: 150%;
  text-align: center;
  color: #e4f2ff;
`
