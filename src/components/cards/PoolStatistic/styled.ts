import styled from "styled-components/macro"
import { Text } from "theme"

import { motion } from "framer-motion"

export const Animation = styled(motion.div)`
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
    overflow: hidden;
    text-overflow: ellipsis;
    align-self: center;
    white-space: nowrap;
    max-width: 90%;
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
