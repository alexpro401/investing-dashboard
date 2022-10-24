import styled from "styled-components"
import { Flex } from "theme"
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
  width: 100%;
  height: 100%;
  z-index: 90;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1.5px);

  @media all and (display-mode: standalone) {
    bottom: 86px;
  }
`

export const Body = styled(motion.div)<{ withHeader: boolean }>`
  max-width: 343px;
  width: 100%;
  height: fit-content;
  padding: ${({ withHeader }) =>
    withHeader ? "17px 24px 17px 16px" : "22px 24px 22px 16px"};
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  background: #181e2c;
  border-radius: 16px;
`

export const Header = styled(Flex)`
  width: 100%;
  justify-content: flex-start;
  margin-bottom: 7px;
`

export const Icon = styled.img`
  width: 24px;
  height: 24px;
`

export const Title = styled.span`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  letter-spacing: 0.03em;

  color: #ffffff;
`

export const Content = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.03em;
  color: #e4f2ff;
`

export const Close = styled.div`
  position: absolute;
  height: 24px;
  width: 24px;
  top: 2px;
  right: 6px;
`
