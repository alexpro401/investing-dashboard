import { motion } from "framer-motion"
import styled from "styled-components"
import theme, { Text } from "theme"
import { AppButton } from "common"
import { rgba } from "polished"

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
  grid-template-rows: max-content 1fr max-content;
  margin: 0 auto;
  width: fill-available;
  overflow: hidden;
  background-color: ${({ theme }) => theme.backgroundColors.primary};
  height: calc(100vh - 94px);

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const List = styled.div`
  margin: 0 auto;
  width: fill-available;
  overflow: hidden auto;
`

export const Indents = styled.div<{ top?: boolean; side?: boolean }>`
  width: 100%;
  margin-top: ${({ top = false }) => (top ? "16px" : "0")};
  padding-left: ${({ side = true }) => (side ? "16px" : "0")};
  padding-right: ${({ side = true }) => (side ? "16px" : "0")};
`

const DaoProfileTextShared = {
  fz: 13,
  lg: "15px",
}

export const TextLabel = styled(Text).attrs((props) => ({
  ...DaoProfileTextShared,
  color: props.color ?? theme.textColors.secondary,
}))``

export const BottomActionContainer = styled.div`
  width: 100%;
  padding: 16px;
  box-shadow: inset 0 1px 0 ${rgba("#293c54", 0.5)};
`

export const AppButtonFull = styled(AppButton)`
  width: 100%;
  font-size: 13px;
  font-weight: 600;
`
