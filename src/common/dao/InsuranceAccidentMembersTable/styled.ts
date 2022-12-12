import styled from "styled-components"
import { motion } from "framer-motion"
import { Text } from "theme"

export const Table = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #181e2c;
  border-radius: 20px;
  padding: 16px;
  gap: 12px;
`
export const TableHead = styled(motion.div)`
  width: 100%;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(32, 41, 58, 0.6);
  color: #b1c7fc;
  font-weight: 500;
`
export const TableBody = styled(motion.div)`
  max-height: 299px;
  height: fit-content;
  width: 100%;
  margin: 12px 0;
  color: #e4f2ff;
  overflow-y: auto;

  & > *:not(:last-child) {
    margin-bottom: 16px;
  }
`
export const TableFooter = styled(motion.div)`
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid rgba(32, 41, 58, 0.6);
  color: #e4f2ff;
  font-weight: 600;
`

export const TableRow = styled(motion.div)<{
  color?: string
  fw?: string | number
  gap?: string
}>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: ${(p) => p.gap ?? "0"};
  color: ${(p) => p.color ?? "inherit"};
  font-weight: ${(p) => p.fw ?? 400};

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
`

export const TableCell = styled(Text)`
  display: block;
  width: 100%;
  color: inherit;
  font-weight: inherit;
  font-size: 13px;
`
