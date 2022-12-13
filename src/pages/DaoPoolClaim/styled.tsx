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
  grid-template-rows: max-content 1fr;
  margin: 0 auto;
  width: fill-available;
  overflow: hidden;
  background-color: ${({ theme }) => theme.backgroundColors.primary};
`

export const List = styled.div`
  display: grid;
  grid-template-rows: 1fr max-content;
  margin: 0 auto;
  width: fill-available;
  overflow: hidden;
  position: relative;

  & > *:nth-child(1) {
    overflow: hidden auto;
  }
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

export const ActionContainer = styled.div`
  width: 100%;
  padding: 16px;
  box-shadow: inset 0 1px 0 ${rgba("#293c54", 0.5)};
  background-color: ${theme.backgroundColors.secondary};
`

export const AppButtonFull = styled(AppButton)`
  width: 100%;
  font-size: 13px;
  font-weight: 600;
`
