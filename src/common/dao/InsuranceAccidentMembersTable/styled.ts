import styled, { css } from "styled-components/macro"
import { motion } from "framer-motion"
import { respondTo, Text } from "theme"
import { Icon } from "common"

export const Table = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.backgroundColors.secondary};
  border-radius: 20px;
  padding: 16px;
  gap: 12px;

  ${respondTo("sm")} {
    gap: 0;
    padding: 0;
  }
`
export const TableHead = styled(motion.div)`
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(32, 41, 58, 0.6);
  color: ${({ theme }) => theme.textColors.secondary};
  font-weight: 500;

  ${respondTo("sm")} {
    padding-bottom: 0;
  }
`
export const TableBody = styled(motion.div)`
  max-height: 299px;
  height: fit-content;
  width: 100%;
  margin: 12px 0;
  color: ${({ theme }) => theme.textColors.primary};
  overflow-y: auto;

  ${respondTo("sm")} {
    margin: 0;
  }

  & > *:not(:last-child) {
    margin-bottom: 16px;

    ${respondTo("sm")} {
      margin-bottom: 0;
    }
  }
`
export const TableFooter = styled(motion.div)`
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid rgba(32, 41, 58, 0.6);
  color: ${({ theme }) => theme.textColors.primary};
  font-weight: 600;

  ${respondTo("sm")} {
    padding-top: 0;
  }
`

function getActiveRowStyles({ active = false, fw }) {
  if (active) {
    return css`
      background: transparent;
      color: ${({ theme }) => theme.brandColors.secondary};
      font-weight: 600;

      ${respondTo("sm")} {
        background: #161b29;
        color: inherit;
      }
    `
  }

  return css`
    background: transparent;
    color: inherit;
    font-weight: ${fw ?? 400};
  `
}

export const TableRow = styled(motion.div)<{
  active?: boolean
  gap?: string
  fw?: number
}>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${(p) => p.gap ?? "0"};

  ${({ active, fw }) => getActiveRowStyles({ active, fw })};

  &:not(:last-child) {
    border-bottom: 1px solid transparent;

    ${respondTo("sm")} {
      border-bottom: 1px solid rgba(32, 41, 58, 0.6);
    }
  }

  & > *:last-child {
    text-align: right;
  }

  & > *:nth-child(1) {
    width: 30%;
  }

  & > *:nth-child(2) {
    width: 23%;
  }

  & > *:nth-child(3) {
    width: 17%;
  }

  & > *:nth-child(4) {
    width: 30%;
  }

  ${respondTo("sm")} {
    height: 49px;
    padding: 0 16px;
  }
`

export const TableCell = styled(Text)`
  display: block;
  width: 100%;
  color: ${({ color }) => color ?? "inherit"};
  font-weight: inherit;
  font-size: 13px;

  ${respondTo("sm")} {
    font-size: 14px;
  }

  span {
    display: inline-block;
    margin-left: 4px;
    color: #6781bd;
  }
`

export const TableCellActiveIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`
