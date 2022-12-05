import styled from "styled-components"
import theme, { Flex } from "theme"
import { motion } from "framer-motion"

export const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  margin: auto;
  bottom: 56px;
  left: 0;
  right: 0;
  width: 343px;
  height: fit-content;
  border-radius: 16px;
  z-index: 101;
  background: rgba(13, 19, 32, 0.3);
  backdrop-filter: blur(1.5px);

  @media all and (display-mode: standalone) {
    bottom: 86px;
  }
`

export const Body = styled(motion.div)`
  max-width: 343px;
  width: 100%;
  height: fit-content;
  padding: 16px;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  background: ${theme.additionalColors.primary};
  border-radius: 16px;
`

export const Header = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;

  #modal-close-bg {
    fill: none;
  }
`

export const Icon = styled.img`
  width: 24px;
  height: 24px;
`

export const Title = styled.span`
  flex: 1;
  height: 17px;
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 130%;
  color: ${theme.textColors.primary};
`

export const Content = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: ${theme.textColors.primary};
  max-width: 100%;
`

export const Close = styled.div`
  position: absolute;
  height: 24px;
  width: 24px;
  top: 2px;
  right: 6px;
`
