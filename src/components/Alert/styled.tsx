import styled from "styled-components/macro"
import theme, { Flex, respondTo } from "theme"
import { motion } from "framer-motion"
import { Icon } from "common"

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

  ${respondTo("sm")} {
    bottom: 0;
    top: 0;
    width: 460px;
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

  ${respondTo("sm")} {
    max-width: 460px;
    background: ${theme.backgroundColors.secondary};
  }
`

export const Header = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
  position: relative;

  #modal-close-bg {
    fill: none;
  }

  ${respondTo("sm")} {
    flex-direction: column-reverse;
  }
`

export const Title = styled.span`
  flex: 1;
  height: 17px;
  font-family: ${theme.appFontFamily};
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  line-height: 130%;
  color: ${theme.textColors.primary};

  ${respondTo("sm")} {
    font-size: 20px;
    line-height: 24px;
  }
`

export const Content = styled.div`
  font-family: ${theme.appFontFamily};
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: ${theme.textColors.primary};
  max-width: 100%;

  ${respondTo("sm")} {
    font-weight: 500;
    font-size: 14px;
    line-height: 170%;
    text-align: center;
    letter-spacing: 0.01em;
    margin-bottom: 16px;
  }
`

export const AlertContentIcon = styled(Icon)`
  height: 24px;
  width: 24px;

  ${respondTo("sm")} {
    height: 96px;
    width: 96px;
  }
`

export const AlertCloseIcon = styled(Icon)`
  position: absolute;
  height: 24px;
  width: 24px;
  top: 0;
  right: 0;
`
