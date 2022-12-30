import { motion } from "framer-motion"
import styled, { css } from "styled-components/macro"
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
  display: flex;
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
    overflow-y: auto;
    padding: 0 0 16px;

    ${({ center }) => (center ? centerGridItem : "")};
  `,
  CardIconWrp: styled.div`
    flex: 1 0 7px;
    svg {
      width: 7px;
      height: 12px;
    }
  `,
}
