import { motion } from "framer-motion"
import styled from "styled-components"
import theme, { Flex, Text } from "theme"

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
  margin: 0 auto;
  width: fill-available;
  overflow: hidden auto;
  background-color: ${({ theme }) => theme.backgroundColors.primary};
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

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #20293a;
`

export const CardButtons = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
`

export const ValidatorVotingPower = styled(Text).attrs(() => ({
  fw: 700,
  fz: 13,
  lg: "16px",
}))`
  background: linear-gradient(64.44deg, #2680eb 32.35%, #7fffd4 100%);
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const ChartFilter = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "center",
}))`
  padding: 2px;
  background: #141926;
  border-radius: 20px;
`

const ChartFilterItemVariants = {
  visible: { backgroundColor: "#20283A", color: "#E4F2FF" },
  hidden: { backgroundColor: "transparent", color: "#B1C7FC" },
}

export const ChartFilterItem = styled(Text).attrs((p) => ({
  block: true,
  fw: 500,
  fz: "13",
  lh: "15px",
  variants: ChartFilterItemVariants,
  initial: ChartFilterItemVariants.hidden,
  transition: { duration: 0.2 },
}))`
  padding: 2px 8px;
  border-radius: 20px;
  cursor: pointer;
`

const DaoProfileTextShared = {
  fz: 13,
  lg: "15px",
}

export const TextLabel = styled(Text).attrs(() => ({
  ...DaoProfileTextShared,
  color: theme.textColors.secondary,
}))``

export const TextValue = styled(Text).attrs(() => ({
  ...DaoProfileTextShared,
  color: theme.textColors.primary,
}))``

export const TreasuryRow = styled(Flex).attrs(() => ({
  full: true,
  ai: "center",
  jc: "flex-start",
}))`
  & > *:nth-child(1) {
    flex: 0 1 43%;
    align-self: flex-start;
  }
  & > *:nth-child(2) {
    flex: 0 1 40%;
    align-self: flex-start;
  }
  & > *:nth-child(3) {
    flex: 0 1 17%;
    align-self: flex-end;
  }
`

export const SliderContainer = styled(Flex).attrs(() => ({
  full: true,
}))`
  .swiper-pagination {
    position: initial;
  }
`

export const SliderHeader = styled(TreasuryRow)`
  & > *:nth-child(2) {
    flex: 0 1 20%;
  }
  & > *:nth-child(3) {
    flex: 0 1 37%;
  }
`
export const SliderItem = styled(TreasuryRow).attrs(() => ({
  p: "16px 0",
}))`
  min-height: 71px;
  border-top: 1px solid #20293a;
`

export const SliderItemToken = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "flex-start",
  gap: "8",

  target: "_blank",
  rel: "noopener noreferrer",
}))`
  text-decoration: none;
`
