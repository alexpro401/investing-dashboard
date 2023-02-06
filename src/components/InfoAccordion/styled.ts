import { motion } from "framer-motion"
import styled from "styled-components"
import { Flex } from "theme"

export const Container = styled(Flex)`
  flex-direction: column;
  width: fill-available;
  gap: 8px;
`

export const Row = styled(Flex)`
  width: fill-available;
  justify-content: flex-start;
  flex-direction: column;
  gap: 8px;
`

export const Content = styled(Flex)`
  justify-content: space-between;
  width: fill-available;
  height: 16px;
`

export const Body = styled(Flex)`
  width: fill-available;
  justify-content: flex-start;
  flex-direction: column;
  padding-right: 20px;
  box-sizing: border-box;
  gap: 8px;
`

export const Title = styled(Flex)`
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.01em;
  color: #b1c7fc;
`

export const Value = styled(Flex)`
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  text-align: right;
  letter-spacing: 0.01em;
  color: #e4f2ff;
`

export const Left = styled(Flex)`
  gap: 4px;
`
export const Right = styled(Flex)`
  gap: 4px;
`

export const AngleIconWrapper = styled(motion.div)`
  color: #b1c7fc;
  height: 16px;
  width: 16px;

  & > svg {
    transform: rotate(180deg);
  }
`
