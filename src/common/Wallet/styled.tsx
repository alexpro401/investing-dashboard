import styled, { css } from "styled-components/macro"
import { Flex, respondTo } from "theme"
import { Icon } from "common/index"
import TransactionHistory from "components/TransactionHistory"
import ExternalLink from "components/ExternalLink"

import cardBG from "assets/background/wallet-card.svg"
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
  padding: 4px 6px;
  min-width: 56px;
  color: #e4f2ff;
  border: none;

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
  top: 0;
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
    width: max-content;
    max-width: clamp(300px, 100vw, 375px);
  }
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

export const Header = styled(Flex)`
  justify-content: space-between;
  padding: 20px 0;
  width: 100%;
`

export const Info = styled(Flex)``

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

export const Card = styled.div`
  position: relative;
  background: url(${cardBG});
  background-repeat: no-repeat;
  border: 1px solid #2f3c3a;
  padding: 16px 16px 14px;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  width: 100%;
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
  color: #e4f2ff;
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
  color: #e4f2ff;
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
