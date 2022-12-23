import styled from "styled-components/macro"
import { motion } from "framer-motion"

import { opacityVariants } from "motion/variants"
import { Flex } from "theme"

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

export const Address = styled.div`
  font-family: ${(props) => props.theme.appFontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: ${({ theme }) => theme.textColors.primary};
`

export const TokenLabel = styled.span`
  font-weight: 400;
  font-size: 16px;
  color: #788ab4;
`

export const ButtonsContainer = styled(Flex)`
  width: fill-available;
  justify-content: space-around;
`

export const SelectFieldAddress = styled.span`
  color: ${({ theme }) => theme.textColors.primary};
`
