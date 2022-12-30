import styled, { css } from "styled-components/macro"
import { Flex, respondTo } from "theme"
import { Icon } from "common"
import TransactionHistory from "components/TransactionHistory"
import ExternalLink from "components/ExternalLink"

import InsuranceBg from "assets/background/insurance-bg.svg"

import { motion } from "framer-motion"

const sidePadding = "16px"

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  filter: blur(5px);
  z-index: 998;
`

export const TogglersWrp = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const TogglerBtn = styled(motion.button)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  background: #20283a;
  border-radius: 12px;
  // right padding is increased to 20px to prevent overlapping of the icon
  padding: 4px 20px 4px 6px;
  min-width: 56px;
  color: ${(props) => props.theme.textColors.primary};
  border: none;
  gap: 4px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 12px;
    border: 2px solid transparent;
    background: linear-gradient(41.86deg, #2680eb 0%, #7fffd4 117.98%);
    -webkit-mask: linear-gradient(41.86deg, #2680eb 0%, #7fffd4 117.98%)
        padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;

    ${(props) =>
      props.isActive
        ? css`
            opacity: 1;
          `
        : ""}
  }
`

export const TogglerBtnAccount = styled.span`
  font-size: 14px;
  font-weight: 600;

  color: #6781bd;

  display: none;

  ${respondTo("sm")} {
    display: block;
  }
`

export const TogglerBtnIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

export const TogglerBtnIconIndicator = styled(Icon)<{ isActive: boolean }>`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 1.4em;
  height: 1.4em;
  color: #6781bd;
  padding: 4px;
  transition: transform 0.2s ease-in-out;

  ${(props) =>
    props.isActive
      ? css`
          transform: translateY(-50%) rotate(180deg);
        `
      : ""}
`

export const DropdownContentWrp = styled(motion.div).attrs(() => ({
  key: "content",
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  variants: {
    visible: {
      height: "fit-content",
      y: 0,
      display: "block",
      opacity: 1,
    },
    hidden: {
      height: 0,
      opacity: 0,
      y: -5,
      transitionEnd: {
        display: "none",
      },
    },
  },
}))`
  position: fixed;
  top: 100px;
  left: 0;
  transform: translateX(-50%);
  z-index: 999;
  padding: 0 16px;
  width: 100%;

  ${respondTo("sm")} {
    position: absolute;
    top: 125%;
    left: auto;
    right: 0;
    width: 375px;
  }
`

export const Container = styled(Flex)`
  overflow: hidden auto;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`

export const ContainerInner = styled.div`
  background: #141926;
  border-radius: 20px;
  width: 100%;
`

export const Title = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #e7efff;
  padding: 0 ${sidePadding};
`

export const GradientBadge = styled.div`
  background: linear-gradient(91.68deg, #122b5a 1.93%, #1864c1 97.66%);
  border-radius: 20px;
  padding: 30px 20px;
`

export const AccountBadgeWrp = styled(GradientBadge)`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 16px ${sidePadding};
`

export const InsuranceBadgeWrp = styled(GradientBadge)`
  display: flex;
  gap: 8px;
  margin: 16px ${sidePadding};
`

export const InsuranceBadgeWrpDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const InsuranceBadgeWrpDetailsLabel = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 1.15;
  color: #6781bd;
`

export const InsuranceBadgeWrpDetailsMultiplier = styled.span`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
  margin-left: 4px;
  background: linear-gradient(64.44deg, #2680eb 32.35%, #7fffd4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  padding: 4px;
  min-width: 35px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 12px;
    border: 2px solid transparent;
    background: linear-gradient(41.86deg, #2680eb 0%, #7fffd4 117.98%);
    -webkit-mask: linear-gradient(41.86deg, #2680eb 0%, #7fffd4 117.98%)
        padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }
`

export const InsuranceBadgeWrpDetailsTitle = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: ${(props) => props.theme.textColors.primary};
`

export const InsuranceBadgeWrpManageBtn = styled.button`
  cursor: pointer;
  margin-left: auto;
  background: none;
  border: none;
  font-weight: 700;
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: ${(props) => props.theme.textColors.primary};
`

export const InsuranceAmountsRowsWrp = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 ${sidePadding};
  margin: 16px 0;
`

export const InsuranceAmountsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const InsuranceAmountsRowLabel = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 0.01em;
  color: #6781bd;
`

export const InsuranceAmountsRowValue = styled.div`
  text-align: right;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: ${(props) => props.theme.textColors.primary};
`

export const InsuranceFooter = styled.div`
  padding: 16px ${sidePadding};
  border-top: 1px solid #1d2435;
`

export const InsuranceCallToActionBlock = styled.div`
  background: url(${InsuranceBg}) no-repeat 95% 90% #122b5a;
  border-radius: 20px;
  padding: 20px ${sidePadding};
`

export const InsuranceCallToActionBlockTitle = styled.h3`
  margin: 0;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.8;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${(props) => props.theme.textColors.primary};
`

export const InsuranceCallToActionBlockLink = styled.a`
  font-size: 14px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: ${(props) => props.theme.brandColors.secondary};
`

export const Header = styled(Flex)`
  justify-content: space-between;
  padding: 20px 0;
  width: 100%;
`

export const Name = styled.input`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.5px;
  color: #c5d1dc;
  appearance: none;
  background: none;
  outline: none;
  border: none;
  border-bottom: 1px solid transparent;
  border-radius: 0;
  max-width: 154px;
  padding: 0;

  &:not(:disabled) {
    border-bottom: 1px solid #5a60717f;
  }

  &::placeholder {
    color: #c5d1dc;
  }

  &:disabled {
    color: #c5d1dc;
  }
`

export const AddressWrp = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 16px 2px 6px;
  background: rgba(13, 40, 78, 0.2);
  border-radius: 12px;
`

export const Address = styled(ExternalLink)`
  font-size: 12px;
  line-height: 1.15;
  color: ${(props) => props.theme.textColors.primary};
`

export const NetworkIcon = styled.img`
  height: 20px;
  margin-left: 5px;
`

export const TextButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  color: ${(props) => props.theme.textColors.primary};
  background: rgba(13, 40, 78, 0.2);
  border-radius: 12px;
  min-width: 32px;
  padding: 12px;
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  border: none;
  cursor: pointer;
`

export const TextIcon = styled(Icon)`
  width: 1.2em;
  height: 1.2em;
`

export const TransactionHistoryWrp = styled(TransactionHistory)``
