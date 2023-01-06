import styled from "styled-components"
import { Flex } from "theme"

export const Row = styled(Flex)`
  width: fill-available;
  justify-content: flex-start;
  flex-direction: column;
`

export const Content = styled(Flex)`
  justify-content: space-between;
  width: fill-available;
`

export const Body = styled(Flex)`
  width: fill-available;
  justify-content: flex-start;
  flex-direction: column;
  padding-right: 20px;
  box-sizing: border-box;
`

export const Title = styled(Flex)`
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #b1c7fc;
`

export const Value = styled(Flex)`
  font-weight: 500;
  font-size: 13px;
  line-height: 15px;
  text-align: right;
  color: #e4f2ff;
`

export const Left = styled(Flex)`
  gap: 4px;
`
export const Right = styled(Flex)`
  gap: 4px;
`
