import styled from "styled-components"
import { motion } from "framer-motion"

import { opacityVariants } from "motion/variants"
import { Flex } from "theme"
import { Icon, AppButton } from "common"
import { getDefaultFieldErrorStyles } from "fields/styled"

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

export const StepsRoot = styled.div`
  display: flex;
  flex-direction: column;
  transform: scale(1);
  gap: 16px;
  padding: 14px 16px 20px;
`

export const AvatarWrapper = styled(Flex)`
  position: absolute;
  top: -35px;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 117px;
`

export const ChangeDaoAvatarBtn = styled.button`
  background: none;
  color: #2669eb;
  font-size: 13px;
  line-height: 1.2;
  font-weight: 600;
  border: none;
  margin-top: 8px;
`

export const ChangeFundDaoAvatarActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ChangeFundDaoAvatarBtnErrorMessage = styled.span`
  ${getDefaultFieldErrorStyles};
`

export const FieldValidIcon = styled(Icon)`
  color: ${(props) => props.theme.statusColors.success};
`

export const CardAddBtn = styled(AppButton)`
  margin: 0 auto;
`
