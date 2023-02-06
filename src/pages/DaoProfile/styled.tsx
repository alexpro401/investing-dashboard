import { motion } from "framer-motion"
import styled, { css } from "styled-components/macro"
import { Link } from "react-router-dom"

import theme, { Flex, respondTo, Text } from "theme"
import { AppButton, Card } from "common"
import ExternalLink from "components/ExternalLink"

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
  hidden: { backgroundColor: "rgba(0,0,0,0)", color: "#B1C7FC" },
}

export const ChartFilterItem = styled(Text).attrs(() => ({
  block: true,
  fw: 500,
  fz: "13",
  lh: "15px",
  variants: ChartFilterItemVariants,
  initial: ChartFilterItemVariants.hidden,
  transition: { duration: 0.2 },
}))<{ isActive: boolean }>`
  padding: 2px 8px;
  border-radius: 20px;
  cursor: pointer;

  ${respondTo("md")} {
    padding: 4px 16px;

    ${(props) =>
      props.isActive
        ? css`
            font-weight: 700 !important;
            color: ${theme.brandColors.secondary} !important;
          `
        : css``}
  }
`

const DaoProfileTextShared = {
  fz: 13,
  lg: "15px",
}

export const TextLabel = styled(Text).attrs((props) => ({
  ...DaoProfileTextShared,
  color: props.color ?? theme.textColors.secondary,
}))`
  ${respondTo("md")} {
    color: #6781bd;
  }
`

export const TreasuryAmountLabel = styled(Text).attrs(() => ({
  ...DaoProfileTextShared,
}))`
  color: ${theme.textColors.secondary};
  font-weight: 500;
  line-height: 19px;
  font-size: 13px;

  ${respondTo("md")} {
    color: ${theme.textColors.primary};
    font-size: 14px;
    line-height: 16.5px;
  }
`

export const TreasuryDesktopTokenName = styled.span`
  color: #6781bd;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;
`

export const TreasuryDesktopExternalLink = styled(ExternalLink).attrs(() => ({
  iconColor: theme.brandColors.secondary,
}))`
  color: ${theme.brandColors.secondary};

  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    margin-top: 4px;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
  }
`

export const TextValue = styled(Text).attrs((props) => ({
  ...DaoProfileTextShared,
  color: props.color ?? theme.textColors.primary,
}))``

export const TreasuryRow = styled(Flex).attrs(() => ({
  full: true,
  ai: "stretch",
  jc: "flex-start",
}))`
  & > *:nth-child(1) {
    flex: 0 1 43%;
  }
  & > *:nth-child(2) {
    flex: 0 1 40%;
  }
  & > *:nth-child(3) {
    flex: 0 1 17%;
  }

  ${respondTo("md")} {
    & > *:nth-child(1) {
      flex: 0 1 40% !important;
    }
    & > *:nth-child(2) {
      flex: 0 1 20% !important;
    }
    & > *:nth-child(3) {
      flex: 0 1 22% !important;
    }
    & > *:nth-child(4) {
      flex: 0 1 18% !important;
    }
  }
`

export const SliderContainer = styled.div`
  width: 100%;

  .swiper-slide {
    width: auto;
  }
  .swiper-pagination {
    position: initial;
  }
`

export const SliderHeader = styled(TreasuryRow)`
  & > *:nth-child(1) {
    flex: 0 1 43%;
  }
  & > *:nth-child(2) {
    flex: 0 1 20%;
  }
  & > *:nth-child(3) {
    flex: 0 1 37%;
  }

  ${respondTo("md")} {
    & > *:nth-child(1) {
      flex: 0 1 40% !important;
    }
    & > *:nth-child(2) {
      flex: 0 1 20% !important;
    }
    & > *:nth-child(3) {
      flex: 0 1 22% !important;
    }
    & > *:nth-child(4) {
      flex: 0 1 18% !important;
    }
  }
`
export const SliderItem = styled(TreasuryRow).attrs(() => ({
  p: "16px 0",
}))`
  min-height: 71px;
  border-top: 1px solid #20293a;

  ${respondTo("md")} {
    min-height: 50px;
    border-top: 1px solid transparent;
  }
`

export const FlexLink = styled(Flex).attrs(() => ({
  target: "_blank",
  rel: "noopener noreferrer",
}))`
  text-decoration: none;
  color: inherit;
`

export const AppLink = styled(Link).attrs(() => ({
  target: "_blank",
  rel: "noopener noreferrer",
}))`
  border-radius: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${theme.statusColors.info};
  text-decoration: none;
`
export const AppButtonFull = styled(AppButton)`
  width: 100%;
  font-size: 13px;
  font-weight: 600;

  ${respondTo("md")} {
    background: #13223e !important;
    color: ${theme.brandColors.secondary} !important;
    font-size: 14px;
    line-height: 17px;
    font-weight: 700;
    margin-top: auto;

    &:hover {
      background: #13223e !important;
      color: ${theme.brandColors.secondary} !important;
    }
  }
`

export const Counter = styled.div`
  height: 12px;
  min-width: 12px;
  padding: 0 2px;
  border-radius: 6px;
  background: linear-gradient(267.88deg, #d75e65 -0.85%, #e77171 98.22%);

  font-family: ${(props) => props.theme.appFontFamily};
  font-weight: 700;
  font-size: 9px;
  line-height: 12px;
  text-align: center;
  color: #ffffff;
`

export const Image = styled.img<{ w?: string; h?: string }>`
  height: ${(p) => p.h ?? "120px"};
  width: ${(p) => p.w ?? "120px"};
`

export const NewProposal = styled(AppButton).attrs(() => ({
  color: "secondary",
  type: "button",
  size: "small",
  text: "+ New proposal",
}))`
  font-weight: 600;
  color: ${theme.textColors.primary};
  width: fill-available;
`

export const AllProposals = styled(AppButton).attrs(() => ({
  color: "primary",
  type: "button",
  size: "small",
  text: "All proposals",
}))`
  width: fill-available;
`

export const NftIcon = styled.img`
  width: 35px;
  height: 35px;

  ${respondTo("md")} {
    width: 24px;
    height: 24px;
  }
`

export const TreasuryEmptyText = styled.span`
  color: ${theme.textColors.secondary};
  font-size: 13px;
  font-weight: 400;
`

export const DelegationTabs = styled(Flex).attrs(() => ({
  ai: "center",
  jc: "center",
}))`
  padding: 2px;
  background: #141926;
  border-radius: 20px;
  width: 100%;
`

const DelegationTabVariants = {
  visible: { backgroundColor: "#20283A", color: "#E4F2FF" },
  hidden: { backgroundColor: "rgba(0,0,0,0)", color: "#B1C7FC" },
}

export const DelegationTab = styled(Text).attrs(() => ({
  block: true,
  fw: 500,
  fz: "13",
  lh: "15px",
  variants: DelegationTabVariants,
  initial: DelegationTabVariants.hidden,
  transition: { duration: 0.2 },
}))<{ full?: boolean }>`
  ${(props) => (props.full ? "width: calc(100%);" : "width: calc(50%);")}
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  cursor: pointer;
`

export const DaoTreasuryCardWrap = styled(Card)`
  width: 100%;

  ${respondTo("md")} {
    height: 100%;
    padding: 16px;
    min-height: 280px;
  }
`

export const TreasuryDesktopTokensHolder = styled.div`
  width: 100%;
  display: flex;
  height: 150px;
  flex-direction: column;
  overflow-y: auto;
`

export const DaoChartCardWrap = styled(Card)`
  width: 100%;

  ${respondTo("md")} {
    height: 100%;
    width: auto;
    padding: 16px;
  }
`
