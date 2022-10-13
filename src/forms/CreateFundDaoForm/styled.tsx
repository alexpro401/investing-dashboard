import styled from "styled-components"

import { Icon, StepsNavigation, Card, AppButton } from "common"
import StepsControllerContext from "context/StepsControllerContext"
import { motion } from "framer-motion"
import { opacityVariants } from "motion/variants"
import { getDefaultFieldBorderStyles } from "fields/styled"

export const Container = styled(StepsControllerContext)`
  display: flex;
  margin: 0 auto;
  background-color: #040a0f;
  width: 100%;
  height: calc(100vh - 94px);
  overflow-y: auto;

  @media all and (display-mode: standalone) {
    height: calc(100vh - 115px);
  }
`

export const StepsContainer = styled(motion.div).attrs(() => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
  variants: opacityVariants,
}))`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const CreateDaoCardNumberIcon = styled.div`
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #7fffd4;
`

export const CreateDaoCardNumberIconText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #7fffd4;
  font-size: 12px;
  line-height: 1.2;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
`

export const CreateFundDaoAvatarBtn = styled.button`
  background: none;
  color: #2669eb;
  font-size: 13px;
  line-height: 1.2;
  font-weight: 600;
  border: none;
  margin-top: 8px;
`

export const CenteredImage = styled.img`
  margin: 0 auto;
`

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
`

export const StepsBottomNavigation = styled(StepsNavigation)`
  margin-top: auto;
`

export const OverflowedCard = styled(Card)`
  overflow: hidden;
  height: 100%;
`

export const FieldValidIcon = styled(Icon)`
  color: ${(props) => props.theme.statusColors.success};
`

export const CardAddBtn = styled(AppButton)`
  margin: 0 auto;
`

export const CardFieldBtn = styled(AppButton)`
  text-align: left;
  justify-content: flex-start;
  width: 100%;

  ${getDefaultFieldBorderStyles}

  padding: 17.5px 16px;

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    ${getDefaultFieldBorderStyles}
  }
`
