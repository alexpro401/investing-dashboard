import styled from "styled-components"
import { Flex } from "theme"

export const Container = styled(Flex)`
  width: 100%;
  flex-direction: column;
`

export const List = styled(Flex)`
  position: relative;
  box-sizing: border-box;
  min-width: 312px;
  align-items: center;
  padding: 16px;
  gap: 16px;
  flex-direction: column;
  width: 100%;
  max-height: 400px;
  overflow: auto;
  &:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    content: "";
    height: 1px;
    background: #28334a;
    opacity: 0.3;
  }
`

export const Card = styled(Flex)`
  cursor: pointer;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
  width: fill-available;
  background: #20283a;
  border-radius: 16px;
  flex: none;
  order: 0;
  flex-grow: 0;
`

export const Head = styled(Flex)`
  justify-content: flex-start;
`

export const Body = styled(Flex)`
  justify-content: flex-start;
  flex-direction: column;
  width: fill-available;
  gap: 16px;
  overflow: hidden;
`

export const Title = styled.div`
  font-family: "Gilroy";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  color: #e4f2ff;
  flex: none;
  order: 1;
  flex-grow: 0;
`

export const Footer = styled(Flex)`
  box-sizing: border-box;
  width: 100%;
  padding: 16px;
  position: relative;
  justify-content: center;
  &:before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    margin: auto;
    width: 100%;
    content: "";
    height: 1px;
    background: #28334a;
    opacity: 0.3;
  }
`
