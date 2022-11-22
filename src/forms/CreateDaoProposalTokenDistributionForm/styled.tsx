import styled from "styled-components"
import { motion } from "framer-motion"

import { opacityVariants } from "motion/variants"
import { AppButton } from "common"
import theme from "theme"

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
`

export const SubmitButton = styled(AppButton)`
  width: 100%;
`

export const TokenContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const TokenContainerLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`

export const TokenContainerRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
`

export const TokenImg = styled.img`
  width: 35px;
  height: 35px;
`

export const TokenNamings = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
`

export const TokenTitle = styled.div`
  display: flex;
  gap: 5px;
`

export const TokenTitleInner = styled.span`
  color: ${theme.textColors.primary};
  font-size: 13px;
  text-transform: uppercase;
  font-weight: 600;
`

export const TokenName = styled.span`
  font-size: 13px;
  font-weight: 500px;
  color: ${theme.textColors.secondary};
`

export const TokenUsdAmount = styled.span`
  color: ${theme.textColors.primary};
  font-size: 13px;
  font-weight: 600;
`
