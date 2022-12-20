import styled from "styled-components"
import { motion } from "framer-motion"
import { Flex } from "theme"

export const FloatingContainer = styled(motion.div)`
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  z-index: 90;
  height: 100vh;
`

export const Container = styled.div`
  background: linear-gradient(64.44deg, #1f232c 32.35%, #282f3f 100%);
  box-shadow: 0 0.5px 0 rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 10px;
  height: 100%;
  width: 100%;
`

export const Handle = styled.div<{ active: boolean }>`
  position: relative;
  height: 21px;
  &:after {
    content: "";
    position: absolute;
    transition: all 0.1s ease-in-out;
    left: 0;
    right: 0;
    margin: auto;
    background: ${(props) => (props.active ? "#47635a" : "#ABA7A7")};
    border-radius: 6px;
    width: 38px;
    height: 5px;
    top: 16px;
  }
`

export const Header = styled(Flex)`
  padding-top: 24px;
  padding-bottom: 16px;
  width: 100%;
  justify-content: center;
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  color: #e4f2ff;
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
