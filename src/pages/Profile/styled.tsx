import styled from "styled-components"
import { Flex, ease, device, rotateVariants, GradientBorder } from "theme"
import { motion } from "framer-motion"

export const Container = styled(motion.div)`
  padding: 16px 16px 50px;
  height: -webkit-fill-available;
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 94px);

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-gap: 16px;
  padding: 10px 0 16px;
  width: 100%;
`

export const Details = styled(GradientBorder)`
  padding: 0 16px 16px;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  border-radius: 16px;
  margin-top: 27px;

  &:after {
    background: #181e2c;
  }
`
