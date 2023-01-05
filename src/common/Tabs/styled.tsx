import styled from "styled-components/macro"
import { motion } from "framer-motion"

export const Container = styled.div`
  display: grid;
  grid-template-rows: 40px 1fr;
  grid-gap: 16px;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const List = styled(motion.div)<{
  count: number
  gap?: number
}>`
  display: grid;
  grid-template-columns: ${({ count }) => `repeat(${count}, max-content)`};
  gap: ${({ gap = 12 }) => gap}px;
  height: 40px;
  width: 100%;
  position: relative;
  overflow-y: auto;

  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(32, 41, 58, 0.5);
    z-index: 0;
  }
`

export const Tab = styled(motion.div)<{ active }>`
  justify-content: center;
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: normal;
  font-size: 13px;
  line-height: 15px;
  text-align: center;
  color: ${(props) => (props.active ? "#9AE2CB" : "#b1c7fc")};
  position: relative;
  cursor: pointer;

  &:first-child {
    margin-left: 12px;
  }
  &:last-child {
    margin-right: 12px;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: ${(props) => (props.active ? "1px" : 0)};
    background: #7fffd4;
    border-radius: 1px;
    transition: height ease-in-out 0.3s;
    z-index: 1;
  }
`

export const Content = styled.div`
  width: 100%;
`
