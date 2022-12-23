import styled from "styled-components/macro"
import { motion } from "framer-motion"
import { Card } from "common"
import { Text } from "theme"
import { opacityVariants } from "motion/variants"

export const Root = styled(motion.div).attrs(() => ({
  variants: opacityVariants,
  initial: "hidden",
  animate: "visible",
}))`
  display: block;
  width: 100%;
  text-decoration: none;
  cursor: pointer;
`

export const GovDelegateeCardContent = styled(Card)`
  width: 100%;
  background-color: ${({ theme }) => theme.backgroundColors.secondary};
`

export const GovDelegateeCardDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.textColors.secondaryNegative};
`

export const GovDelegateeCardLabel = styled(Text).attrs(({ theme }) => ({
  color: theme.textColors.secondary,
  fz: 13,
  fw: 500,
}))``

export const GovDelegateeCardValue = styled(Text).attrs(() => ({
  fz: 13,
  fw: 600,
}))``

export const GovDelegateeCardValueNfts = styled(Text).attrs(() => ({
  fz: 13,
  fw: 600,
}))`
  max-width: 70%;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: right;
`
