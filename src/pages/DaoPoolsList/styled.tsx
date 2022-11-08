import { motion } from "framer-motion"
import styled, { css } from "styled-components"
import { Flex } from "theme"
import { AppButton } from "common"

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const Container = styled(motion.div).attrs(() => ({
  variants,
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  transition: { duration: 0.2 },
}))`
  display: grid;
  grid-template-rows: max-content 1fr;
  grid-gap: 16px;
  overflow: hidden;
  padding: 16px 0 0;
  width: 100%;
  height: calc(100vh - 94px);

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const Indents = styled.div<{ top?: boolean; side?: boolean }>`
  width: 100%;
  margin-top: ${({ top = false }) => (top ? "16px" : "0")};
  padding-left: ${({ side = true }) => (side ? "16px" : "0")};
  padding-right: ${({ side = true }) => (side ? "16px" : "0")};
`

export const Action = styled(AppButton).attrs(() => ({
  color: "default",
  size: "small",
}))`
  padding: 0;
`

const centerGridItem = css`
  justify-content: center;
  align-content: center;
`

export const List = {
  Container: styled.div`
    display: grid;
    grid-template-rows: max-content 1fr;
    grid-gap: 16px;
    overflow: hidden;
  `,
  Header: styled.div`
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 19px;
  `,
  Scroll: styled.div<{ center: boolean }>`
    display: grid;
    grid-template-rows: max-content;
    grid-gap: 16px;
    overflow-y: auto;
    padding: 0 0 16px;

    ${({ center }) => (center ? centerGridItem : "")};
  `,
}
