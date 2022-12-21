import styled from "styled-components"
import { Text } from "theme"

import { motion } from "framer-motion"

export const Animation = styled(motion.div).attrs((p: { index: number }) => ({
  initial: !p.index ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -5 },
  transition: {
    duration: 0.2,
    delay: p.index / ((20 * p.index) ^ 2),
    ease: [0.29, 0.98, 0.29, 1],
  },
}))<{ index: number }>`
  width: 100%;
`

export const Title = styled(Text).attrs(() => ({
  fz: 16,
  lh: "20px",
}))`
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;

  @media screen and (min-width: 1194px) {
    color: ${({ theme }) => theme.brandColors.secondary};
    font-weight: 900;
    font-size: 20px;
  }
`
export const Description = styled(Text).attrs(({ theme }) => ({
  block: true,
  color: theme.textColors.secondary,
  fz: 13,
  fw: 400,
  lh: "15px",
}))<{ align?: string }>`
  text-align: ${({ align }) => align ?? "right"};
`

export const StatisticValue = styled(Text).attrs(() => ({
  block: true,
  color: "#f7f7f7",
  fw: 600,
  fz: 16,
  lh: "16px",
}))``
